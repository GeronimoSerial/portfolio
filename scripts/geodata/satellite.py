#!/usr/bin/env python3
"""Sentinel-2 true-colour base for the featured-project teardown.

Called by bake.mjs (stage `satellite`). Runs in an isolated environment that uv
provides, so the repository gains no dependency:

  uv run --no-project --with rasterio --with numpy --with pillow \
    python -I scripts/geodata/satellite.py --bbox w,s,e,n --out ... --cache ... --province ...

Source: Copernicus Sentinel-2 L2A, AWS open data (Element84 earth-search STAC, COGs in
sentinel-cogs). Reads COG overviews only (10 m bands at 1/16 scale, about 160 m), so no
full-resolution raster is downloaded. Cloud, cloud shadow, cirrus and no-data pixels are
replaced from the next-least-cloudy scene of the same tile; pixels clean in no scene use
the least-bad observation.
"""

import argparse
import io
import json
import math
import sys
import urllib.request
from pathlib import Path

import numpy as np
import rasterio
from PIL import Image, ImageDraw, ImageFilter
from rasterio import Env
from rasterio.transform import Affine, from_bounds
from rasterio.warp import Resampling, reproject

STAC_SEARCH = "https://earth-search.aws.element84.com/v1/search"
COLLECTION = "sentinel-2-l2a"
# Austral winter 2025: dry season, same year as the bake, cloud cover below 10 %.
DATETIME = "2025-06-01T00:00:00Z/2025-09-30T23:59:59Z"
MAX_CLOUD = 10
SCENES_PER_TILE = 3
REDUCE = 16  # 10 m native -> about 160 m read from the overview level
# SCL classes: 0 no data, 1 saturated/defective, 3 cloud shadow, 8 cloud medium, 9 cloud high, 10 thin cirrus.
INVALID_SCL = (0, 1, 3, 8, 9, 10)
SIZE = 2048
WEBP_BUDGET_BYTES = 1_600_000
WEBP_QUALITIES = (96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60)
MASK_SUPERSAMPLE = 2
# Reflectance = DN * 1e-4. STAC declares offset -0.1 for baseline >= 04.00, but the stored
# DN in these COGs do not carry that shift: with it, the 1st percentile of water and the median
# of land go negative (impossible). Without it the values are plausible (water ~0.02, vegetation
# green > red). Verified on scene S2C_21JTJ_20250922_0_L2A; see SOURCES.md.
REFLECTANCE_SCALE = 1.0 / 10000.0
DN_OFFSET = 0.0
GAMMA = 1.15
BANDS = {"red": "B04", "green": "B03", "blue": "B02"}


def log(*args):
    print("[satellite]", *args, file=sys.stderr)


def search(bbox):
    body = {
        "collections": [COLLECTION],
        "bbox": bbox,
        "datetime": DATETIME,
        "limit": 250,
        "query": {"eo:cloud_cover": {"lt": MAX_CLOUD}},
    }
    req = urllib.request.Request(
        STAC_SEARCH,
        data=json.dumps(body).encode(),
        headers={"content-type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.load(res)["features"]


def tile_id(item):
    p = item["properties"]
    if "s2:mgrs_tile" in p:
        return p["s2:mgrs_tile"]
    return f"{p['mgrs:utm_zone']}{p['mgrs:latitude_band']}{p['mgrs:grid_square']}"


def pick_scenes(features):
    """Least-cloudy scenes per MGRS tile, most-cloudy-last overall."""
    ordered = sorted(features, key=lambda f: f["properties"]["eo:cloud_cover"])
    per_tile = {}
    for item in ordered:
        bucket = per_tile.setdefault(tile_id(item), [])
        if len(bucket) < SCENES_PER_TILE:
            bucket.append(item)
    return sorted(
        (item for bucket in per_tile.values() for item in bucket),
        key=lambda f: f["properties"]["eo:cloud_cover"],
    )


def grid_shape(href):
    with rasterio.open(href) as src:
        return math.ceil(src.height / REDUCE), math.ceil(src.width / REDUCE)


def read_asset(href, shape, resampling):
    """Overview-level read on a fixed output grid; returns the array, its transform and CRS."""
    with rasterio.open(href) as src:
        arr = src.read(1, out_shape=shape, resampling=resampling)
        transform = src.transform * Affine.scale(src.width / shape[1], src.height / shape[0])
        return arr, transform, src.crs


def load_scene(item, cache_dir):
    scene_id = item["id"]
    cached = cache_dir / f"{scene_id}.npz"
    if cached.exists():
        data = np.load(cached)
        return {k: data[k] for k in ("red", "green", "blue", "scl", "transform", "epsg")}

    assets = item["assets"]
    shape = grid_shape(assets["red"]["href"])
    bands = {}
    transform = None
    crs = None
    for name in BANDS:
        arr, transform, crs = read_asset(assets[name]["href"], shape, Resampling.average)
        bands[name] = arr
    scl, _, _ = read_asset(assets["scl"]["href"], shape, Resampling.nearest)
    out = {
        **bands,
        "scl": scl.astype(np.uint8),
        "transform": np.array(transform.to_gdal(), dtype=np.float64),
        "epsg": np.array(crs.to_epsg()),
    }
    np.savez_compressed(cached, **out)
    return {k: out[k] for k in ("red", "green", "blue", "scl", "transform", "epsg")}


def warp_scene(scene, dst_transform, size):
    """Reprojects one scene to the EPSG:4326 plate grid.

    Returns RGB reflectance (3, size, size), a clean mask (no cloud or shadow, not no-data)
    and an observed mask (any valid spectral pixel)."""
    # Stored in GDAL order (c, a, b, f, d, e); Affine(...) expects (a, b, c, d, e, f).
    src_transform = Affine.from_gdal(*scene["transform"][:6])
    src_crs = f"EPSG:{int(scene['epsg'])}"
    observed = (scene["red"] > 0) & (scene["green"] > 0) & (scene["blue"] > 0)
    clean = observed & ~np.isin(scene["scl"], INVALID_SCL)

    def warp(arr, resampling, dtype):
        out = np.zeros((size, size), dtype=dtype)
        reproject(
            source=arr,
            destination=out,
            src_transform=src_transform,
            src_crs=src_crs,
            dst_transform=dst_transform,
            dst_crs="EPSG:4326",
            resampling=resampling,
        )
        return out

    rgb = np.stack(
        [
            warp(
                scene[name].astype(np.float32) * REFLECTANCE_SCALE + DN_OFFSET,
                Resampling.bilinear,
                np.float32,
            )
            for name in BANDS
        ]
    )
    clean_mask = warp(clean.astype(np.uint8), Resampling.nearest, np.uint8) > 0
    observed_mask = warp(observed.astype(np.uint8), Resampling.nearest, np.uint8) > 0
    return rgb, clean_mask, observed_mask


def composite(scenes, size, dst_transform):
    """Priority mosaic: the least-cloudy observation wins; holes take the next scene."""
    rgb = np.zeros((3, size, size), np.float32)
    filled = np.zeros((size, size), bool)
    fb_rgb = np.zeros((3, size, size), np.float32)
    fb_filled = np.zeros((size, size), bool)
    used = []
    for item, scene in scenes:
        s_rgb, clean, observed = warp_scene(scene, dst_transform, size)
        take = clean & ~filled
        rgb[:, take] = s_rgb[:, take]
        filled |= take
        take_fb = observed & ~fb_filled
        fb_rgb[:, take_fb] = s_rgb[:, take_fb]
        fb_filled |= take_fb
        used.append(item["id"])
    return rgb, filled, fb_rgb, fb_filled, used


def province_mask(geojson_path, bbox, size):
    w, s, e, n = bbox
    scale = MASK_SUPERSAMPLE
    img = Image.new("L", (size * scale, size * scale), 0)
    draw = ImageDraw.Draw(img)
    geo = json.loads(Path(geojson_path).read_text())
    for polygon in geo["features"][0]["geometry"]["coordinates"]:
        outer, *holes = polygon
        rings = [(outer, 255)] + [(hole, 0) for hole in holes]
        for ring, fill in rings:
            pts = [
                ((lon - w) / (e - w) * size * scale, (n - lat) / (n - s) * size * scale)
                for lon, lat in ring
            ]
            draw.polygon(pts, fill=fill)
    return img.resize((size, size), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.7))


def encode_webp(rgba_img):
    chosen = None
    for quality in WEBP_QUALITIES:
        buf = io.BytesIO()
        rgba_img.save(buf, "WEBP", quality=quality, method=6)
        chosen = (quality, buf.getvalue())
        if len(buf.getvalue()) <= WEBP_BUDGET_BYTES:
            break
    return chosen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bbox", required=True, help="w,s,e,n WGS84 of the square plate")
    ap.add_argument("--out", required=True)
    ap.add_argument("--cache", required=True)
    ap.add_argument("--province", required=True, help="GeoJSON with the province outline")
    ap.add_argument("--size", type=int, default=SIZE)
    args = ap.parse_args()

    bbox = [float(v) for v in args.bbox.split(",")]
    cache_dir = Path(args.cache) / "satellite"
    cache_dir.mkdir(parents=True, exist_ok=True)

    env = {
        "AWS_NO_SIGN_REQUEST": "YES",
        "GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR",
        "CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif",
        "GDAL_HTTP_MERGE_CONSECUTIVE_RANGES": "YES",
    }
    with Env(**env):
        features = search(bbox)
        log(f"STAC matches with cloud < {MAX_CLOUD}%: {len(features)}")
        picked = pick_scenes(features)
        log(f"scenes kept (<= {SCENES_PER_TILE} per tile): {len(picked)}")
        scenes = []
        for item in picked:
            scene = load_scene(item, cache_dir)
            scenes.append((item, scene))
            log(
                f"{item['id']} tile={tile_id(item)} date={item['properties']['datetime'][:10]} "
                f"cloud={item['properties']['eo:cloud_cover']:.2f}%"
            )

        dst_transform = from_bounds(*bbox, args.size, args.size)
        rgb, filled, fb_rgb, fb_filled, used = composite(scenes, args.size, dst_transform)

    mask = np.asarray(province_mask(args.province, bbox, args.size), dtype=np.float32) / 255.0
    inside = mask > 0.5
    final = np.where(filled[None], rgb, fb_rgb)
    alpha_data = filled | fb_filled
    valid_vals = final[:, alpha_data & inside]
    lo, hi = np.percentile(valid_vals, [1.0, 99.5])
    norm = np.clip((final - lo) / max(hi - lo, 1e-6), 0.0, 1.0) ** (1.0 / GAMMA)
    rgb8 = (norm * 255.0 + 0.5).astype(np.uint8).transpose(1, 2, 0)
    alpha8 = (np.where(alpha_data, mask, 0.0) * 255.0 + 0.5).astype(np.uint8)
    rgba = np.dstack([rgb8, alpha8])
    quality, payload = encode_webp(Image.fromarray(rgba, "RGBA"))

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(payload)

    province_px = int(inside.sum())
    clean_px = int((filled & inside).sum())
    obs_px = int((fb_filled & ~filled & inside).sum())
    summary = {
        "scenes": [
            {
                "id": item["id"],
                "tile": tile_id(item),
                "date": item["properties"]["datetime"][:10],
                "cloudCover": round(item["properties"]["eo:cloud_cover"], 2),
                "baseline": item["properties"].get("s2:processing_baseline"),
            }
            for item, _ in scenes
        ],
        "size": args.size,
        "webp": {"quality": quality, "bytes": len(payload)},
        "coverage": {
            "provincePx": province_px,
            "cleanPct": round(100.0 * clean_px / max(province_px, 1), 2),
            "leastBadPct": round(100.0 * obs_px / max(province_px, 1), 2),
            "emptyPct": round(100.0 * (province_px - clean_px - obs_px) / max(province_px, 1), 2),
        },
        "stretch": {"lo": round(float(lo), 4), "hi": round(float(hi), 4), "gamma": GAMMA},
    }
    print(json.dumps(summary, indent=2))
    log(f"wrote {out} ({len(payload) / 1e6:.2f} MB, q={quality})")


if __name__ == "__main__":
    main()
