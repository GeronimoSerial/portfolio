# Geodata bake

Reproducible bake of the public geodata behind the featured-project teardown
(Corrientes, Argentina). Node 20+, no npm dependencies.

```sh
node scripts/geodata/bake.mjs                       # all stages
node scripts/geodata/bake.mjs --stage=province,dem  # subset
```

Raw downloads land in `scripts/geodata/.cache/` (gitignored) and are reused on later runs.
Delete a cached file to force a re-download.

| Stage      | Source (see `public/data/featured/SOURCES.md`)                         | Output                                          |
| ---------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| `province` | Natural Earth 10m admin-1 (Corrientes, `iso_3166_2 = AR-W`)            | `public/data/geo/corrientes.json`, footprint    |
| `dem`      | Copernicus DEM GLO-90 tiles on the AWS open-data bucket (no login)     | `heightmap.f32`, `hillshade.webp` (PNG fallback), elevation range in manifest |
| `roads`    | OpenStreetMap extract from Geofabrik (`argentina-latest.osm.pbf`)      | `roads.json` as `{lines, classes}` (0 national, 1 provincial, 2 tertiary, 3 minor), clipped to the plate |
| `facilities` | Same OSM extract: `amenity=school`, `amenity=hospital\|clinic`, `healthcare=hospital` inside the footprint | `facilities.json` as `{schools, hospitals}` of `[u, v]` points |
| `places`   | Same OSM extract: `place=city\|town\|village` with a name, inside the footprint | `places.json` as `[{name, u, v, kind}]`: all cities and towns, 40 largest villages |
| `flood`    | JRC Global Flood Hazard, 100-year (`floodMapGL_rp100y.zip`, public)    | `floodmask.png` (512 px), `flood.f32` (heightmap grid)                    |
| `satellite` | Copernicus Sentinel-2 L2A, AWS open data (Element84 STAC, `sentinel-cogs` COGs, no login) | `satellite.webp` (2048 px true colour, alpha = province mask) |

Requirements: Node 20+, and for `flood` also ImageMagick (`magick`, to crop the GeoTIFF)
and `python3` (to unzip it).
For `satellite`: `uv` (the stage runs `scripts/geodata/satellite.py` through
`uv run --no-project --with rasterio --with numpy --with pillow`, so no dependency is added to the repo).
The script searches STAC for 2025-06-01..2025-09-30 scenes with cloud cover under 10 %, keeps the three least
cloudy per MGRS tile, reads the 10 m bands at overview level (1/16, about 160 m), reprojects to the plate
(EPSG:4326, 2048 px) and fills cloud, shadow and cirrus pixels from the next-least-cloudy scene.
Per-scene arrays are cached in `.cache/satellite/` so a re-bake does not re-read the COGs. `hillshade.webp` needs `magick` with WebP; without it the
bake writes `hillshade.png` instead. Flood depth maps to hazard at 1 m = full hazard
(`FLOOD_FULL_HAZARD_DEPTH_M`, see SOURCES.md).

Before `roads` runs, fetch the extract once (about 435 MB):

```sh
curl -fL -o scripts/geodata/.cache/argentina-latest.osm.pbf \
  https://download.geofabrik.de/south-america/argentina-latest.osm.pbf
```

`manifest.json` is rewritten on every run. A subset run (`--stage=...`) keeps the `files` entries
and `elevation` of the stages it did not run, read from the previous `manifest.json`.
The JRC zip (49 MB) is downloaded on the first `flood` run and cached under `.cache/jrc-rp100/`.
`roads`, `facilities` and `places` share one pass over the extract (about 25 s, about 2 GB peak memory).
Run all stages before publishing.

Plate projection: a square centred on the province, longitude scaled by cos(mid-latitude).
Grid: 129 cells per side, values normalised to 0..1.
