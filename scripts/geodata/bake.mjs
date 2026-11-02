// Bakes public, credential-free geodata for the featured-project teardown.
//
//   node scripts/geodata/bake.mjs            # all stages with cached downloads
//   node scripts/geodata/bake.mjs --stage=province,dem,roads
//
// Outputs:
//   public/data/geo/corrientes.json        province outline (WGS84 FeatureCollection)
//   public/data/featured/manifest.json     contract read by teardown/data.ts
//   public/data/featured/heightmap.f32     Float32 LE, grid x grid, 0..1
//   public/data/featured/roads.json        {lines: [[[u, v], ...]], classes: [0|1|2]} in plate coordinates
//   public/data/featured/footprint.json    province ring in plate coordinates
//   public/data/featured/hillshade.webp    1024 px hillshade from the DEM (PNG when no WebP encoder)
//   public/data/featured/floodmask.png     512 px JRC flood hazard, R = G = B = hazard 0..255
//   public/data/featured/flood.f32         JRC flood hazard on the heightmap grid, Float32 LE, 0..1
//   public/data/featured/satellite.webp    Sentinel-2 true colour, 2048 px, alpha = province mask (satellite.py)
//
// Raw downloads go to scripts/geodata/.cache/ (gitignored). Node >= 20, no npm deps.
// The flood stage needs ImageMagick (`magick`) to crop the JRC GeoTIFF and python3 to unzip it.

import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { deflateSync, inflateSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const CACHE = join(here, '.cache');
const CACHE_JRC = join(CACHE, 'jrc-rp100');
const FEATURED = join(root, 'public/data/featured');
const GEO = join(root, 'public/data/geo');

const GRID = 129;
const PROVINCE_ISO = 'AR-W'; // Corrientes in ISO 3166-2
const PROVINCE_TOLERANCE_DEG = 0.01;
const FOOTPRINT_MAX_POINTS = 300;
// OSM highway value -> road class: 0 national (motorway, trunk), 1 provincial (primary, secondary), 2 tertiary.
const ROAD_CLASS = { motorway: 0, trunk: 0, primary: 1, secondary: 1, tertiary: 2 };
const HILLSHADE_SIZE = 1024;
const HILLSHADE_AZIMUTH_DEG = 315; // clockwise from north: light from the north-west
const HILLSHADE_ALTITUDE_DEG = 45;
const HILLSHADE_Z_FACTOR = 3; // vertical exaggeration, DEM metres against ground metres
const METRES_PER_DEG = 111320;
const FLOOD_MASK_SIZE = 512;
// Documented scale: JRC depth in metres maps linearly to hazard 0..1, saturating at this depth.
// The scene's exposure threshold (0.5) therefore means 0.5 m of modelled flood depth.
const FLOOD_FULL_HAZARD_DEPTH_M = 1;
const ROAD_VERTEX_BUDGET = 6000;
const ROAD_TOLERANCE = 0.0012; // plate units, about 0.5 km on the ground
const ROAD_MIN_LENGTH = 0.01; // plate units, about 4 km; shorter fragments are dropped
const BBOX_MARGIN = 0.05; // extra degrees around the plate for road extraction
const SATELLITE_SCRIPT = join(here, 'satellite.py');

const URLS = {
  naturalEarth:
    'https://github.com/nvkelso/natural-earth-vector/raw/master/geojson/ne_10m_admin_1_states_provinces.geojson',
  pbf: 'https://download.geofabrik.de/south-america/argentina-latest.osm.pbf',
  demTile: (name) =>
    `https://copernicus-dem-90m.s3.eu-central-1.amazonaws.com/${name}/${name}.tif`,
  jrcRp100: 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/FLOODS/GlobalMaps/floodMapGL_rp100y.zip',
};

const stages = (process.argv.find((a) => a.startsWith('--stage='))?.slice(8) ?? 'province,dem,roads,flood,satellite').split(',');

// ---------------------------------------------------------------- utilities

const log = (...args) => console.log('[bake]', ...args);

async function fetchCached(url, file) {
  if (!existsSync(file)) {
    log('download', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFile(file);
}

// Douglas-Peucker over [x, y] pairs, iterative to survive long roads.
function simplifyLine(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / len2));
      const d = Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const round = (v, digits) => Number(v.toFixed(digits));

function encodeFloat32(values) {
  const buf = Buffer.alloc(values.length * 4);
  for (let i = 0; i < values.length; i++) buf.writeFloatLE(values[i], i * 4);
  return buf;
}

// ---------------------------------------------------------------- province

async function bakeProvince() {
  const geojson = JSON.parse(
    (await fetchCached(URLS.naturalEarth, join(CACHE, 'ne_10m_admin_1_states_provinces.geojson'))).toString('utf8'),
  );
  const feature = geojson.features.find(
    (f) => f.properties?.iso_3166_2 === PROVINCE_ISO || f.properties?.name === 'Corrientes',
  );
  if (!feature) throw new Error('Corrientes not found in Natural Earth admin-1');

  const polygons =
    feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

  // Simplified outline for the public GeoJSON asset.
  const outline = polygons
    .map((rings) =>
      rings
        .map((ring) => simplifyLine(ring, PROVINCE_TOLERANCE_DEG).map(([x, y]) => [round(x, 4), round(y, 4)]))
        .filter((ring) => ring.length >= 4),
    )
    .filter((rings) => rings.length > 0);
  const out = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Corrientes', iso_3166_2: PROVINCE_ISO, source: 'Natural Earth 10m admin-1' },
        geometry: { type: 'MultiPolygon', coordinates: outline },
      },
    ],
  };
  const text = JSON.stringify(out);
  await writeFile(join(GEO, 'corrientes.json'), text + '\n');
  log(`corrientes.json ${(text.length / 1024).toFixed(1)} KB, ${outline.length} polygon(s)`);

  // Largest outer ring: the footprint is built from it in main().
  const largest = polygons.reduce((best, rings) =>
    ringArea(rings[0]) > ringArea(best[0]) ? rings : best,
  );
  return { provinceRing: largest[0], bboxLonLat: lonLatBounds(polygons) };
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a / 2);
}

function lonLatBounds(polygons) {
  let w = Infinity;
  let s = Infinity;
  let e = -Infinity;
  let n = -Infinity;
  for (const rings of polygons)
    for (const ring of rings)
      for (const [x, y] of ring) {
        w = Math.min(w, x);
        e = Math.max(e, x);
        s = Math.min(s, y);
        n = Math.max(n, y);
      }
  return { w, s, e, n };
}

// Square plate centred on the province. Longitude is scaled by cos(latitude) so one
// plate unit is the same ground distance east-west and north-south.
function plateFrame(b) {
  const midLat = (b.s + b.n) / 2;
  const cos0 = Math.cos((midLat * Math.PI) / 180);
  const widthProj = (b.e - b.w) * cos0;
  const heightProj = b.n - b.s;
  const side = Math.max(widthProj, heightProj) * 1.04;
  const cx = (b.w + b.e) / 2;
  const cy = (b.s + b.n) / 2;
  const halfLon = side / 2 / cos0;
  const halfLat = side / 2;
  const bbox = {
    w: cx - halfLon,
    e: cx + halfLon,
    s: cy - halfLat,
    n: cy + halfLat,
  };
  return {
    bbox,
    toPlate: (lon, lat) => [(lon - bbox.w) / (bbox.e - bbox.w), (bbox.n - lat) / (bbox.n - bbox.s)],
    fromPlate: (u, v) => [bbox.w + u * (bbox.e - bbox.w), bbox.n - v * (bbox.n - bbox.s)],
  };
}

// ---------------------------------------------------------------- DEM (GeoTIFF)

const TYPE_SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

// Minimal little-endian classic TIFF reader: float32, one band, strips or tiles,
// deflate (8 / 32946) with predictor 1 or 3. Anything else throws.
function readTiff(buf) {
  if (buf.toString('latin1', 0, 2) !== 'II' || buf.readUInt16LE(2) !== 42) {
    throw new Error('Only little-endian classic TIFF is supported');
  }
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const tags = new Map();
  const ifd = dv.getUint32(4, true);
  const count = dv.getUint16(ifd, true);
  for (let e = 0; e < count; e++) {
    const at = ifd + 2 + e * 12;
    const tag = dv.getUint16(at, true);
    const type = dv.getUint16(at + 2, true);
    const n = dv.getUint32(at + 4, true);
    const size = (TYPE_SIZE[type] ?? 1) * n;
    const dataAt = size <= 4 ? at + 8 : dv.getUint32(at + 8, true);
    const values = [];
    for (let k = 0; k < n; k++) {
      const p = dataAt + k * (TYPE_SIZE[type] ?? 1);
      if (type === 3) values.push(dv.getUint16(p, true));
      else if (type === 4 || type === 13) values.push(dv.getUint32(p, true));
      else if (type === 12) values.push(dv.getFloat64(p, true));
      else if (type === 11) values.push(dv.getFloat32(p, true));
      else if (type === 1 || type === 7) values.push(buf[p]);
    }
    tags.set(tag, values);
  }
  const one = (t) => tags.get(t)?.[0];
  const width = one(256);
  const height = one(257);
  if (one(258) !== 32 || one(339) !== 3) throw new Error('Expected float32 samples');
  if ((one(277) ?? 1) !== 1) throw new Error('Expected a single band');
  const compression = one(259) ?? 1;
  const predictor = one(317) ?? 1;
  if (compression !== 8 && compression !== 32946 && compression !== 1) {
    throw new Error(`Unsupported TIFF compression ${compression}`);
  }
  if (predictor !== 1 && predictor !== 3) throw new Error(`Unsupported predictor ${predictor}`);

  const tiled = tags.has(322);
  const blockW = tiled ? one(322) : width;
  const blockH = tiled ? one(323) : one(278) ?? height;
  const offsets = tags.get(tiled ? 324 : 273);
  const byteCounts = tags.get(tiled ? 325 : 279);
  const across = Math.ceil(width / blockW);
  const out = new Float32Array(width * height);

  for (let b = 0; b < offsets.length; b++) {
    const bx = (b % across) * blockW;
    const by = Math.floor(b / across) * blockH;
    const raw = buf.subarray(offsets[b], offsets[b] + byteCounts[b]);
    let data = compression === 1 ? raw : inflateSync(raw);
    if (predictor === 3) data = undoFloatPredictor(data, blockW, blockH);
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    for (let r = 0; r < blockH && by + r < height; r++) {
      for (let c = 0; c < blockW && bx + c < width; c++) {
        out[(by + r) * width + bx + c] = view.getFloat32((r * blockW + c) * 4, true);
      }
    }
  }

  const tie = tags.get(33922);
  const scale = tags.get(33550);
  return { width, height, data: out, x0: tie[3], y0: tie[4], sx: scale[0], sy: scale[1] };
}

// Inverse of TIFF floating-point predictor 3: undo the byte-wise running delta, then
// regroup the byte planes (most significant first) into little-endian floats.
function undoFloatPredictor(data, bw, rows) {
  const rowBytes = bw * 4;
  const out = Buffer.alloc(data.length);
  const tmp = Buffer.alloc(rowBytes);
  for (let r = 0; r < rows; r++) {
    const base = r * rowBytes;
    data.copy(tmp, 0, base, base + rowBytes);
    for (let i = 1; i < rowBytes; i++) tmp[i] = (tmp[i] + tmp[i - 1]) & 0xff;
    for (let k = 0; k < bw; k++) {
      for (let b = 0; b < 4; b++) out[base + k * 4 + b] = tmp[(3 - b) * bw + k];
    }
  }
  return out;
}

function sampleTiles(tiles, lon, lat) {
  for (const t of tiles) {
    // Tiles meet at a half-pixel seam; accept up to one pixel outside and clamp to the edge.
    const col = (lon - t.x0) / t.sx;
    const row = (t.y0 - lat) / t.sy;
    if (col < -1 || row < -1 || col > t.width || row > t.height) continue;
    const c0 = Math.min(Math.max(Math.floor(col), 0), t.width - 1);
    const r0 = Math.min(Math.max(Math.floor(row), 0), t.height - 1);
    const c1 = Math.min(c0 + 1, t.width - 1);
    const r1 = Math.min(r0 + 1, t.height - 1);
    const fc = Math.min(1, Math.max(0, col - c0));
    const fr = Math.min(1, Math.max(0, row - r0));
    const d = t.data;
    const top = d[r0 * t.width + c0] + (d[r0 * t.width + c1] - d[r0 * t.width + c0]) * fc;
    const bot = d[r1 * t.width + c0] + (d[r1 * t.width + c1] - d[r1 * t.width + c0]) * fc;
    return top + (bot - top) * fr;
  }
  return null;
}

const demName = (lat0, lon0) => {
  const ns = lat0 < 0 ? 'S' : 'N';
  const ew = lon0 < 0 ? 'W' : 'E';
  const la = String(Math.abs(lat0)).padStart(2, '0');
  const lo = String(Math.abs(lon0)).padStart(3, '0');
  return `Copernicus_DSM_COG_30_${ns}${la}_00_${ew}${lo}_00_DEM`;
};

async function loadDemTiles(bbox) {
  const tiles = [];
  for (let lat0 = Math.floor(bbox.s); lat0 < bbox.n; lat0++) {
    for (let lon0 = Math.floor(bbox.w); lon0 < bbox.e; lon0++) {
      const name = demName(lat0, lon0);
      const file = join(CACHE, `${name}.tif`);
      const bytes = await fetchCached(URLS.demTile(name), file);
      tiles.push(readTiff(bytes));
      log(`dem tile ${name} ${(bytes.length / 1e6).toFixed(1)} MB`);
    }
  }
  return tiles;
}

// Terrain stage: one dense DEM grid over the plate drives the elevation range, the
// heightmap (129 nodes, same normalisation) and the hillshade (1024 px).
async function bakeTerrain(frame) {
  const tiles = await loadDemTiles(frame.bbox);
  const n = HILLSHADE_SIZE;
  const dense = new Float32Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const [lon, lat] = frame.fromPlate(i / (n - 1), j / (n - 1));
      const h = sampleTiles(tiles, lon, lat);
      if (h === null || !Number.isFinite(h)) throw new Error(`DEM gap at ${lon},${lat}`);
      dense[j * n + i] = h;
    }
  }
  let lo = Infinity;
  let hi = -Infinity;
  for (const h of dense) {
    lo = Math.min(lo, h);
    hi = Math.max(hi, h);
  }
  const span = hi - lo || 1;

  const values = new Float32Array(GRID * GRID);
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      const [lon, lat] = frame.fromPlate(i / (GRID - 1), j / (GRID - 1));
      const h = sampleTiles(tiles, lon, lat);
      values[j * GRID + i] = Math.min(1, Math.max(0, (h - lo) / span));
    }
  }
  await writeFile(join(FEATURED, 'heightmap.f32'), encodeFloat32(values));
  log(`heightmap.f32 elevation ${lo.toFixed(0)}..${hi.toFixed(0)} m`);

  // Ground size of one dense cell: the plate is square in ground metres.
  const cellM = ((frame.bbox.n - frame.bbox.s) * METRES_PER_DEG) / (n - 1);
  const shade = hillshade(dense, n, cellM);
  const hillshadeFile = await writeHillshade(shade, n);
  log(`${hillshadeFile} ${n} px, azimuth ${HILLSHADE_AZIMUTH_DEG}, altitude ${HILLSHADE_ALTITUDE_DEG}`);

  return {
    elevation: { minM: Math.round(lo), maxM: Math.round(hi) },
    hillshadeFile,
  };
}

// Horn 3x3 gradients on the dense DEM, Lambertian shade for a light at the configured
// azimuth (clockwise from north) and altitude. Row 0 is the north edge, as in the plate.
function hillshade(z, n, cellM) {
  const az = (HILLSHADE_AZIMUTH_DEG * Math.PI) / 180;
  const alt = (HILLSHADE_ALTITUDE_DEG * Math.PI) / 180;
  // Unit vector towards the light: x east, y north, z up.
  const lx = Math.sin(az) * Math.cos(alt);
  const ly = Math.cos(az) * Math.cos(alt);
  const lz = Math.sin(alt);
  const at = (i, j) => z[Math.min(n - 1, Math.max(0, j)) * n + Math.min(n - 1, Math.max(0, i))];
  const out = new Uint8Array(n * n);
  const k = 8 * cellM;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const west = i - 1;
      const east = i + 1;
      const north = j - 1;
      const south = j + 1;
      const dzdx =
        ((at(east, north) + 2 * at(east, j) + at(east, south)) -
          (at(west, north) + 2 * at(west, j) + at(west, south))) /
        k;
      const dzdyNorth =
        ((at(west, north) + 2 * at(i, north) + at(east, north)) -
          (at(west, south) + 2 * at(i, south) + at(east, south))) /
        k;
      const nx = -dzdx * HILLSHADE_Z_FACTOR;
      const ny = -dzdyNorth * HILLSHADE_Z_FACTOR;
      const len = Math.hypot(nx, ny, 1);
      const dot = (nx * lx + ny * ly + lz) / len;
      out[j * n + i] = Math.round(255 * Math.max(0, dot));
    }
  }
  return out;
}

const hasMagick = () => spawnSync('magick', ['-version'], { stdio: 'ignore' }).status === 0;

// WebP through ImageMagick when available; otherwise a greyscale PNG from the built-in encoder.
async function writeHillshade(shade, n) {
  if (hasMagick()) {
    const webp = execFileSync('magick', ['-size', `${n}x${n}`, '-depth', '8', 'gray:-', '-quality', '85', 'webp:-'], {
      input: Buffer.from(shade),
      maxBuffer: 64 * 1024 * 1024,
    });
    if (webp.length < 1_000_000) {
      await writeFile(join(FEATURED, 'hillshade.webp'), webp);
      return 'hillshade.webp';
    }
    log(`hillshade.webp is ${webp.length} bytes, over budget; falling back to PNG`);
  }
  await writeFile(join(FEATURED, 'hillshade.png'), encodePng(n, n, 1, shade));
  return 'hillshade.png';
}

// ---------------------------------------------------------------- PNG (no dependencies)

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let k = 0; k < 256; k++) {
    let c = k;
    for (let b = 0; b < 8; b++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[k] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length);
  const typed = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed));
  return Buffer.concat([head, typed, crc]);
}

// 8-bit PNG, unfiltered rows. channels 1 = greyscale, 3 = RGB.
function encodePng(width, height, channels, pixels) {
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    raw.set(pixels.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = channels === 1 ? 0 : 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------- flood (JRC GFH, 100-year)

// Extracts the GeoTIFF and its world file from the zip into a fresh directory, then moves them into the cache.
async function extractJrc(zipFile) {
  const dir = join(CACHE_JRC, `extract-${Date.now()}`);
  await mkdir(dir);
  const script = [
    'import sys, zipfile, shutil, os',
    'z = zipfile.ZipFile(sys.argv[1])',
    'for name in z.namelist():',
    '    if name.endswith(".tif") or name.endswith(".tfw"):',
    '        with z.open(name) as src, open(os.path.join(sys.argv[2], os.path.basename(name)), "wb") as dst:',
    '            shutil.copyfileobj(src, dst)',
  ].join('\n');
  execFileSync('python3', ['-I', '-c', script, zipFile, dir]);
  await rename(join(dir, 'floodMapGL_rp100y.tif'), join(CACHE_JRC, 'floodMapGL_rp100y.tif'));
  await rename(join(dir, 'floodMapGL_rp100y.tfw'), join(CACHE_JRC, 'floodMapGL_rp100y.tfw'));
  await rm(dir, { recursive: true, force: true });
}

async function bakeFlood(frame) {
  if (!hasMagick()) throw new Error('ImageMagick (magick) is required to crop the JRC GeoTIFF');
  await mkdir(CACHE_JRC, { recursive: true });
  const tif = join(CACHE_JRC, 'floodMapGL_rp100y.tif');
  const tfw = join(CACHE_JRC, 'floodMapGL_rp100y.tfw');
  if (!existsSync(tif) || !existsSync(tfw)) {
    await fetchCached(URLS.jrcRp100, join(CACHE_JRC, 'floodMapGL_rp100y.zip'));
    await extractJrc(join(CACHE_JRC, 'floodMapGL_rp100y.zip'));
  }

  // World file: A, D, B, E, C, F. Pixel centres, WGS84, no rotation (verified here).
  const [pxW, rotD, rotB, pxH, x0, y0] = (await readFile(tfw, 'utf8'))
    .split(/\s+/)
    .filter(Boolean)
    .map(Number);
  if (rotD !== 0 || rotB !== 0 || pxW <= 0 || pxH >= 0) throw new Error('JRC world file: unexpected transform');
  const [rasterW, rasterH] = execFileSync('magick', ['identify', '-format', '%w %h', tif]).toString().trim().split(' ').map(Number);

  const b = frame.bbox;
  const col0 = Math.max(0, Math.floor((b.w - x0) / pxW) - 1);
  const col1 = Math.min(rasterW - 1, Math.ceil((b.e - x0) / pxW) + 1);
  const row0 = Math.max(0, Math.floor((y0 - b.n) / -pxH) - 1);
  const row1 = Math.min(rasterH - 1, Math.ceil((y0 - b.s) / -pxH) + 1);
  const ww = col1 - col0 + 1;
  const wh = row1 - row0 + 1;

  // Crop with ImageMagick as float32 (depth in metres); no-data and dry cells are not positive.
  const raw = execFileSync(
    'magick',
    [tif, '-crop', `${ww}x${wh}+${col0}+${row0}`, '+repage', '-define', 'quantum:format=floating-point', '-depth', '32', 'gray:-'],
    { maxBuffer: 256 * 1024 * 1024 },
  );
  if (raw.length !== ww * wh * 4) throw new Error(`JRC crop: expected ${ww * wh * 4} bytes, got ${raw.length}`);
  const hazardWindow = new Float32Array(ww * wh);
  let floodedCells = 0;
  let maxDepth = 0;
  for (let k = 0; k < hazardWindow.length; k++) {
    const depth = raw.readFloatLE(k * 4);
    if (!(depth > 0) || depth > 1e4) continue;
    maxDepth = Math.max(maxDepth, depth);
    hazardWindow[k] = Math.min(1, depth / FLOOD_FULL_HAZARD_DEPTH_M);
    floodedCells++;
  }

  // Mask on the plate: nearest JRC pixel per mask cell.
  const m = FLOOD_MASK_SIZE;
  const mask = new Float32Array(m * m);
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < m; i++) {
      const [lon, lat] = frame.fromPlate((i + 0.5) / m, (j + 0.5) / m);
      const col = Math.min(ww - 1, Math.max(0, Math.round((lon - x0) / pxW) - col0));
      const row = Math.min(wh - 1, Math.max(0, Math.round((y0 - lat) / -pxH) - row0));
      mask[j * m + i] = hazardWindow[row * ww + col];
    }
  }
  const rgb = new Uint8Array(m * m * 3);
  for (let k = 0; k < m * m; k++) {
    const v = Math.round(mask[k] * 255);
    rgb[k * 3] = v;
    rgb[k * 3 + 1] = v;
    rgb[k * 3 + 2] = v;
  }
  const png = encodePng(m, m, 3, rgb);
  await writeFile(join(FEATURED, 'floodmask.png'), png);

  // Flood field on the heightmap grid: area mean of the mask cells under each grid node.
  const flood = new Float32Array(GRID * GRID);
  const half = m / (GRID - 1) / 2;
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      const cx = (i / (GRID - 1)) * (m - 1);
      const cy = (j / (GRID - 1)) * (m - 1);
      let sum = 0;
      let count = 0;
      for (let y = Math.max(0, Math.round(cy - half)); y <= Math.min(m - 1, Math.round(cy + half)); y++) {
        for (let x = Math.max(0, Math.round(cx - half)); x <= Math.min(m - 1, Math.round(cx + half)); x++) {
          sum += mask[y * m + x];
          count++;
        }
      }
      flood[j * GRID + i] = count ? sum / count : 0;
    }
  }
  await writeFile(join(FEATURED, 'flood.f32'), encodeFloat32(flood));
  log(
    `JRC rp100 window ${ww}x${wh}px, flooded ${((100 * floodedCells) / hazardWindow.length).toFixed(1)}% of window, ` +
      `max depth ${maxDepth.toFixed(2)} m, floodmask.png ${(png.length / 1024).toFixed(0)} KB`,
  );
  return { flood: 'flood.f32', floodmask: 'floodmask.png' };
}

// ---------------------------------------------------------------- roads (OSM PBF)

function varint(buf, pos) {
  let value = 0;
  let mul = 1;
  let b;
  do {
    b = buf[pos++];
    value += (b & 0x7f) * mul;
    mul *= 128;
  } while (b & 0x80);
  return { value, pos };
}

// Protobuf fields of one message: [field, wire, number | null, bytes | null].
function* protoFields(buf) {
  let pos = 0;
  while (pos < buf.length) {
    const key = varint(buf, pos);
    pos = key.pos;
    const field = Math.floor(key.value / 8);
    const wire = key.value % 8;
    if (wire === 0) {
      const v = varint(buf, pos);
      pos = v.pos;
      yield [field, wire, v.value, null];
    } else if (wire === 2) {
      const len = varint(buf, pos);
      pos = len.pos;
      yield [field, wire, null, buf.subarray(pos, pos + len.value)];
      pos += len.value;
    } else if (wire === 1) {
      yield [field, wire, null, buf.subarray(pos, pos + 8)];
      pos += 8;
    } else if (wire === 5) {
      yield [field, wire, null, buf.subarray(pos, pos + 4)];
      pos += 4;
    } else {
      throw new Error(`Unsupported protobuf wire type ${wire}`);
    }
  }
}

function packedVarints(buf, signed) {
  const out = [];
  let pos = 0;
  while (pos < buf.length) {
    const v = varint(buf, pos);
    pos = v.pos;
    out.push(signed ? (v.value % 2 === 0 ? v.value / 2 : -(v.value + 1) / 2) : v.value);
  }
  return out;
}

async function bakeRoads(frame) {
  const pbfFile = join(CACHE, 'argentina-latest.osm.pbf');
  if (!existsSync(pbfFile)) throw new Error(`Missing ${pbfFile}; run the download first (see README)`);
  const bytes = await readFile(pbfFile);
  const b = frame.bbox;
  const minLon = b.w - BBOX_MARGIN;
  const maxLon = b.e + BBOX_MARGIN;
  const minLat = b.s - BBOX_MARGIN;
  const maxLat = b.n + BBOX_MARGIN;

  // Node coordinates inside the padded bbox, keyed by OSM id.
  const nodes = new Map();
  const waysRaw = [];
  let pos = 0;
  while (pos < bytes.length) {
    const headerLen = bytes.readUInt32BE(pos);
    pos += 4;
    const header = bytes.subarray(pos, pos + headerLen);
    pos += headerLen;
    let type = '';
    let dataSize = 0;
    for (const [field, , num, sub] of protoFields(header)) {
      if (field === 1) type = sub.toString('utf8');
      if (field === 3) dataSize = num;
    }
    const blob = bytes.subarray(pos, pos + dataSize);
    pos += dataSize;
    if (type !== 'OSMData') continue;

    let raw = null;
    let zlibData = null;
    for (const [field, , , sub] of protoFields(blob)) {
      if (field === 1) raw = sub;
      if (field === 3) zlibData = sub;
    }
    const block = raw ?? inflateSync(zlibData);
    readPrimitiveBlock(block, nodes, waysRaw, { minLon, maxLon, minLat, maxLat });
  }
  log(`pbf: ${nodes.size} nodes in bbox, ${waysRaw.length} highway ways`);

  // Resolve ways into polylines, splitting where a node falls outside the bbox.
  const lines = [];
  for (const way of waysRaw) {
    let current = [];
    for (const ref of way.refs) {
      const p = nodes.get(ref);
      if (!p) {
        if (current.length >= 2) lines.push({ pts: current, cls: way.cls });
        current = [];
        continue;
      }
      current.push(p);
    }
    if (current.length >= 2) lines.push({ pts: current, cls: way.cls });
  }

  // Project to plate coordinates, thin at a fixed tolerance, drop short fragments, then
  // keep the longest lines that fit the vertex budget (main roads first).
  const thinned = lines
    .map(({ pts, cls }) => ({
      pts: simplifyLine(pts.map(([lon, lat]) => frame.toPlate(lon, lat)), ROAD_TOLERANCE),
      cls,
    }))
    .filter((l) => l.pts.length >= 2 && polylineLength(l.pts) >= ROAD_MIN_LENGTH)
    .sort((a, b) => polylineLength(b.pts) - polylineLength(a.pts));
  const kept = [];
  let vertices = 0;
  for (const l of thinned) {
    if (vertices + l.pts.length > ROAD_VERTEX_BUDGET) continue;
    kept.push(l);
    vertices += l.pts.length;
  }
  const out = {
    lines: kept.map((l) => l.pts.map(([u, v]) => [round(u, 4), round(v, 4)])),
    classes: kept.map((l) => l.cls),
  };
  const text = JSON.stringify(out);
  await writeFile(join(FEATURED, 'roads.json'), text + '\n');
  const perClass = [0, 1, 2].map((c) => out.classes.filter((k) => k === c).length);
  log(
    `roads.json ${out.lines.length} of ${lines.length} lines (class 0/1/2: ${perClass.join('/')}), ` +
      `${vertices} vertices, ${(text.length / 1024).toFixed(0)} KB`,
  );
  return out.lines.length;
}

function polylineLength(line) {
  let total = 0;
  for (let k = 1; k < line.length; k++) total += Math.hypot(line[k][0] - line[k - 1][0], line[k][1] - line[k - 1][1]);
  return total;
}

function readPrimitiveBlock(block, nodes, waysRaw, box) {
  let strings = [];
  let granularity = 100;
  let latOffset = 0;
  let lonOffset = 0;
  const groups = [];
  for (const [field, , num, sub] of protoFields(block)) {
    if (field === 1) strings = [...protoFields(sub)].map((f) => f[3].toString('utf8'));
    else if (field === 2) groups.push(sub);
    else if (field === 17) granularity = num;
    else if (field === 19) latOffset = num;
    else if (field === 20) lonOffset = num;
  }
  const highwayKey = strings.indexOf('highway');
  const toLat = (v) => (latOffset + granularity * v) * 1e-9;
  const toLon = (v) => (lonOffset + granularity * v) * 1e-9;
  const inBox = (lon, lat) =>
    lon >= box.minLon && lon <= box.maxLon && lat >= box.minLat && lat <= box.maxLat;

  for (const group of groups) {
    for (const [field, , , sub] of protoFields(group)) {
      if (field === 2) {
        // DenseNodes: delta-coded id, lat and lon arrays.
        let ids = [];
        let lats = [];
        let lons = [];
        for (const [f, , , s] of protoFields(sub)) {
          if (f === 1) ids = packedVarints(s, true);
          else if (f === 8) lats = packedVarints(s, true);
          else if (f === 9) lons = packedVarints(s, true);
        }
        let id = 0;
        let lat = 0;
        let lon = 0;
        for (let k = 0; k < ids.length; k++) {
          id += ids[k];
          lat += lats[k];
          lon += lons[k];
          const la = toLat(lat);
          const lo = toLon(lon);
          if (inBox(lo, la)) nodes.set(id, [lo, la]);
        }
      } else if (field === 3) {
        if (highwayKey < 0) continue;
        let keys = [];
        let vals = [];
        let refs = [];
        for (const [f, , , s] of protoFields(sub)) {
          if (f === 2) keys = packedVarints(s, false);
          else if (f === 3) vals = packedVarints(s, false);
          else if (f === 8) refs = packedVarints(s, true);
        }
        let highway = null;
        for (let k = 0; k < keys.length; k++) {
          if (keys[k] === highwayKey) highway = strings[vals[k]];
        }
        const cls = highway !== null && Object.hasOwn(ROAD_CLASS, highway) ? ROAD_CLASS[highway] : undefined;
        if (cls === undefined) continue;
        let acc = 0;
        waysRaw.push({ refs: refs.map((d) => (acc += d)), cls });
      }
    }
  }
}

// ---------------------------------------------------------------- satellite

// Sentinel-2 L2A overviews via satellite.py. Python and rasterio come from uv, so the
// repository adds no npm or pip dependency. Output is written next to the other grids.
function bakeSatellite(bbox) {
  execFileSync(
    'uv',
    [
      'run', '--no-project', '-q',
      '--with', 'rasterio', '--with', 'numpy', '--with', 'pillow',
      'python', '-I', SATELLITE_SCRIPT,
      `--bbox=${bbox.join(',')}`,
      `--out=${join(FEATURED, 'satellite.webp')}`,
      `--cache=${CACHE}`,
      `--province=${join(GEO, 'corrientes.json')}`,
    ],
    { stdio: 'inherit' },
  );
  log('satellite.webp written (Sentinel-2 L2A, see SOURCES.md)');
  return 'satellite.webp';
}

// ---------------------------------------------------------------- manifest

async function main() {
  await mkdir(GEO, { recursive: true });
  await mkdir(FEATURED, { recursive: true });
  await mkdir(CACHE, { recursive: true });

  const { provinceRing, bboxLonLat } = await bakeProvince();
  const frame = plateFrame(bboxLonLat);
  const bbox = [frame.bbox.w, frame.bbox.s, frame.bbox.e, frame.bbox.n].map((v) => round(v, 5));
  log('plate bbox [w,s,e,n] =', bbox);

  const footprintLonLat = simplifyLine(provinceRing, PROVINCE_TOLERANCE_DEG);
  let ring = footprintLonLat;
  let tol = PROVINCE_TOLERANCE_DEG;
  while (ring.length > FOOTPRINT_MAX_POINTS) {
    tol *= 1.5;
    ring = simplifyLine(provinceRing, tol);
  }
  const footprint = ring.map(([lon, lat]) => frame.toPlate(lon, lat).map((x) => round(x, 4)));
  await writeFile(join(FEATURED, 'footprint.json'), JSON.stringify({ ring: footprint }) + '\n');
  log(`footprint.json ${footprint.length} points`);

  const files = {};
  const meta = {};
  if (stages.includes('dem')) {
    const terrain = await bakeTerrain(frame);
    meta.elevation = terrain.elevation;
    files.heightmap = 'heightmap.f32';
    files.hillshade = terrain.hillshadeFile;
  }
  if (stages.includes('roads')) {
    await bakeRoads(frame);
    files.roads = 'roads.json';
  }
  if (stages.includes('flood')) {
    Object.assign(files, await bakeFlood(frame));
  }
  if (stages.includes('satellite')) {
    files.satellite = bakeSatellite(bbox);
  }
  files.footprint = 'footprint.json';

  const manifest = {
    version: 1,
    grid: GRID,
    bbox,
    projection: 'Square plate, longitude scaled by cos(mid-latitude); u = west to east, v = north to south',
    source:
      'Copernicus DEM (heightmap, hillshade), OpenStreetMap via Geofabrik (roads), ' +
      'JRC Global Flood Hazard 100-year (flood), Natural Earth 10m admin-1 (outline)',
    ...meta,
    files,
  };
  await writeFile(join(FEATURED, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  log('manifest.json written with files:', Object.keys(files).join(', '));
}

main().catch((err) => {
  console.error('[bake] failed:', err);
  process.exitCode = 1;
});
