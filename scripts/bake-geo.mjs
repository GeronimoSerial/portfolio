// Bakes the geo outlines used by the particle globe and Argentina map.
// Run once with `pnpm bake:geo`; the outputs are committed under public/data/geo/.
import { writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/data/geo');

const topojson = require('topojson-client');
const atlas = (name) => require(`world-atlas/${name}`);

const DECIMALS = 3;
const ARGENTINA_ID = '032';
const USA_ID = '840';
const USA_BOX = { minLon: -125, maxLon: -66, minLat: 24, maxLat: 50 };
const MALVINAS_ID = '238';

function round(coords) {
  if (typeof coords[0] === 'number') {
    return coords.map((v) => Number(v.toFixed(DECIMALS)));
  }
  return coords.map(round);
}

function roundGeometry(geometry) {
  return { type: geometry.type, coordinates: round(geometry.coordinates) };
}

function featureCollection(features) {
  return { type: 'FeatureCollection', features };
}

// Merges polygonal parts of several geometries into one MultiPolygon.
function mergeToMultiPolygon(geometries) {
  const coordinates = [];
  for (const g of geometries) {
    if (g.type === 'Polygon') coordinates.push(g.coordinates);
    else if (g.type === 'MultiPolygon') coordinates.push(...g.coordinates);
    else throw new Error(`Unexpected geometry type: ${g.type}`);
  }
  return { type: 'MultiPolygon', coordinates };
}

async function writeJson(name, data) {
  const text = JSON.stringify(data);
  await writeFile(resolve(outDir, name), text + '\n');
  return text.length;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const land110 = atlas('land-110m.json');
  const landFc = topojson.feature(land110, land110.objects.land);
  const landGeometry = mergeToMultiPolygon(landFc.features.map((f) => f.geometry));
  const landSize = await writeJson(
    'land-110m.json',
    featureCollection([
      { type: 'Feature', properties: { name: 'land' }, geometry: roundGeometry(landGeometry) },
    ]),
  );

  const countries50 = atlas('countries-50m.json');
  const countriesFc = topojson.feature(countries50, countries50.objects.countries);
  const picked = countriesFc.features.filter((f) => f.id === ARGENTINA_ID || f.id === MALVINAS_ID);
  const found = new Set(picked.map((f) => f.id));
  for (const id of [ARGENTINA_ID, MALVINAS_ID]) {
    if (!found.has(id)) throw new Error(`Country ${id} missing from countries-50m.json`);
  }
  // Malvinas/Falklands are drawn as part of Argentina, per Argentine map convention.
  const argentinaGeometry = mergeToMultiPolygon(picked.map((f) => f.geometry));
  const argentinaSize = await writeJson(
    'argentina-50m.json',
    featureCollection([
      {
        type: 'Feature',
        properties: { name: 'Argentina', includes: ['Malvinas/Falkland Islands'] },
        geometry: roundGeometry(argentinaGeometry),
      },
    ]),
  );

  // Contiguous USA: polygons whose bbox meets the crop box survive, which drops Alaska and Hawaii.
  const usa = countriesFc.features.find((f) => f.id === USA_ID);
  if (!usa) throw new Error(`Country ${USA_ID} missing from countries-50m.json`);
  const usaPolygons = usa.geometry.type === 'MultiPolygon' ? usa.geometry.coordinates : [usa.geometry.coordinates];
  const usaKept = usaPolygons.filter((poly) => bboxMeets(poly, USA_BOX));
  const usaSize = await writeJson(
    'usa-50m.json',
    featureCollection([
      {
        type: 'Feature',
        properties: { name: 'United States (contiguous)' },
        geometry: roundGeometry({ type: 'MultiPolygon', coordinates: usaKept }),
      },
    ]),
  );

  console.log(`land-110m.json: ${landSize} bytes`);
  console.log(`argentina-50m.json: ${argentinaSize} bytes`);
  console.log(`usa-50m.json: ${usaSize} bytes (${usaKept.length} polygons)`);
}

function bboxMeets(polygon, box) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const ring of polygon) {
    for (const [lon, lat] of ring) {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }
  return !(maxLon < box.minLon || minLon > box.maxLon || maxLat < box.minLat || minLat > box.maxLat);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
