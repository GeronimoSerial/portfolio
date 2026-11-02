# Featured project: geodata sources

Baked by `scripts/geodata/bake.mjs` (see `scripts/geodata/README.md`).
Raw downloads are cached in `scripts/geodata/.cache/` and are not committed.

Precipitation and indicators are **not** real data. They stay as labelled example values from the
placeholder generator. Schools and hospitals are real OpenStreetMap points (see the OSM rows).

## Per source

| Source | URL | Status | Licence / attribution | Output (size) |
| --- | --- | --- | --- | --- |
| Natural Earth 10m admin-1 (states and provinces) | https://github.com/nvkelso/natural-earth-vector/raw/master/geojson/ne_10m_admin_1_states_provinces.geojson (mirror of https://www.naturalearthdata.com) | Reached. Feature `iso_3166_2 = AR-W` (Corrientes). Cache 39 MB. | Public domain. No attribution required; credit "Natural Earth" appreciated. | `geo/corrientes.json` (2.5 KB), `featured/footprint.json` (1.9 KB) |
| IGN Argentina, provincias (official) | ign.gob.ar, wms.ign.gob.ar, geoservicios.ign.gob.ar | **Not reached.** DNS resolution fails from the bake environment. | IGN open data, to verify at source. | Not used. |
| IGN provincias copy on datos.gob.ar | https://infra.datos.gob.ar/catalog/modernizacion/dataset/7/distribution/7.12/download/provincias.geojson | Reached, but the file holds only one `Point` (centroid) per province, not polygons. | Per datos.gob.ar dataset terms. | Not used (not a polygon outline). |
| Copernicus DEM (GLO-90 tiles, 1200 x 1200 px per tile, about 90 m) | AWS open data, bucket `copernicus-dem-90m`, keys `Copernicus_DSM_COG_30_<lat>_<lon>_DEM`. Tiles S31..S28 x W060..W056 (20 tiles). | Reached. Tiles 4.4–5.5 MB each, cache about 95 MB. | Copernicus DEM, free and open access. Attribution per Copernicus terms: "© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved", to verify wording at source. | `featured/heightmap.f32` (66.6 KB, 129 x 129 Float32 LE, 0..1), `featured/hillshade.webp` (46 KB, 1024 px). Elevation range 16–364 m in manifest `elevation` (`minM`, `maxM`), taken from the dense 1024 px DEM grid. |
| OpenStreetMap via Geofabrik | https://download.geofabrik.de/south-america/argentina-latest.osm.pbf | Reached. Cache 435 MB. | ODbL 1.0. Attribution "© OpenStreetMap contributors" (https://www.openstreetmap.org/copyright). Share-alike: see open item 2. | `featured/roads.json` (477 KB, 8,741 polylines, 28,784 vertices, clipped to the plate, 190 m tolerance, 4 decimals). Road class 0 = motorway and trunk with `_link` (312 polylines), 1 = primary and secondary with `_link` (291), 2 = tertiary with `_link` (738), 3 = unclassified, residential, track (7,400). Ways of all classes were kept; the vertex budget (40,000) was not reached. © OpenStreetMap contributors. |
| OpenStreetMap via Geofabrik, facilities (same extract, one pass with roads and places) | As above. | Reached. | ODbL 1.0. "© OpenStreetMap contributors". Schools and hospitals are points from the OSM database, not a derived estimate. | `featured/facilities.json` (25 KB): `schools` 1,327 (`amenity=school`: nodes, and ways as the centroid of their nodes), `hospitals` 277 (`amenity=hospital` or `clinic`, `healthcare=hospital`). Only points inside the footprint polygon (ray casting). Both lists are below the 4,000 cap, so no subset was taken. Names are not stored. Duplicates are kept as mapped. |
| OpenStreetMap via Geofabrik, places (same extract) | As above. | Reached. | ODbL 1.0. "© OpenStreetMap contributors". | `featured/places.json` (3 KB): 54 named places inside the footprint: 1 city, 13 towns, 40 villages. Villages are the 40 largest by the `population` tag (unknown population last, then by name); 24 other villages are dropped. Hamlets are not included. |
| OpenStreetMap via Overpass API | overpass-api.de, lz4.overpass-api.de, z.overpass-api.de | **Not used.** Timeouts (overpass-api.de) and HTTP 502/504 from every mirror. | ODbL, as above. | Not used. |
| JRC Global Flood Hazard Maps, 100-year return period (`floodMapGL_rp100y.zip`) | https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/FLOODS/GlobalMaps/floodMapGL_rp100y.zip | Reached. Zip 49.4 MB. Inside: GeoTIFF 41616 x 16468 px, Float32, WGS84 (EPSG:4326 per world file), 30 arc-second pixels, values = flood depth in metres, no-data for dry cells. Cropped to the plate window (509 x 446 px). | JRC open data, reuse per the Commission reuse policy; attribution to "JRC Global Flood Hazard Maps", licence wording to verify at source. | `featured/floodmask.png` (27 KB, 512 x 512, R = G = B = hazard 0..255), `featured/flood.f32` (66.6 KB, 129 x 129 Float32 LE, 0..1). |
| Copernicus Sentinel-2 L2A, true colour (B04, B03, B02) | STAC https://earth-search.aws.element84.com/v1 (collection `sentinel-2-l2a`), COGs in `s3://sentinel-cogs` (https://sentinel-cogs.s3.us-west-2.amazonaws.com), no login. Licence per STAC collection: `proprietary`, legal notice https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice (free, full and open access under EU law). | Reached. 89 scenes, 30 MGRS tiles, dates 2025-08-25 to 2025-09-29 (austral late winter / early spring, same year, dry season). Cloud cover below 10 % per scene; the three least cloudy scenes per tile are kept. Per-scene cache about 119 MB (`scripts/geodata/.cache/satellite/`, gitignored). | **Attribution: "Contains modified Copernicus Sentinel data 2025".** The bake applies a stretch and gamma and composites cloud-free pixels from the next-least-cloudy scene. | `featured/satellite.webp` (2048 px RGBA, alpha = province mask, about 1.2 MB, WebP q96). |


## Satellite imagery (`satellite.webp`)

- Bake: `scripts/geodata/satellite.py` (stage `satellite` of `bake.mjs`), run with `uv` and rasterio. No change to the repository's dependencies.
- Selection: STAC search for `2025-06-01/2025-09-30` with cloud cover below 10 %. The three least cloudy scenes per tile are read at overview level (1/16, about 160 m), so no full-resolution raster is downloaded.
- Compositing: the least cloudy observation wins. Cloud, cloud shadow, cirrus and no-data pixels (SCL classes 0, 1, 3, 8, 9, 10) are replaced from the next scene of the same tile.
- Reflectance = DN x 1e-4 with **no** BOA offset. STAC declares `offset: -0.1` for baseline 05.11, but the stored DN do not carry it: with the offset, water and land go negative. Checked on `S2C_21JTJ_20250922_0_L2A` (median green 0.059, median red 0.045, 1st percentile red 0.022).
- Stretch: common 1st to 99.5th percentile across the three bands, then gamma 1.15 (`lo` 0.0066, `hi` 0.1157 in this bake).
- Known limitation: the tiles were acquired on different dates, so there are visible tile-scale seams in brightness. A per-tile brightness match or a single-date mosaic would reduce them; not done in this bake.

## Derived values and scales

- **Flood hazard** = `min(1, depth_m / 1 m)`. A cell with 1 m or more of modelled depth reads as full hazard. The scene's exposure threshold (0.5) therefore means 0.5 m of modelled 100-year flood depth. This scale is a documented choice, not a value from JRC; confirm it before presenting exposure numbers as real.
- Flood mask: nearest JRC pixel per mask cell. Flood field: mean of the mask cells under each 129-grid node.
- **Hillshade**: Horn 3x3 gradients on the dense DEM, azimuth 315°, altitude 45°, vertical exaggeration 3x for flat terrain. The relief is low, so the shading is subtle by design.
- **Simulated water** in the scene is not the JRC model. It is masked to the flood field above and labelled as a simulation.

## Projection and grid

- Square plate centred on the province, with longitude scaled by cos(mid-latitude). The manifest `bbox` is `[w, s, e, n]` in WGS84.
- Heightmap and flood grids: 129 x 129, row-major, u = west to east, v = north to south. Float32 little-endian, normalised 0..1.
- Hillshade and flood mask: 1024 px and 512 px square, same plate, row 0 = north.
- `roads.json` polylines and `footprint.json` ring are in the same plate coordinates.

## Licence notes

- **OpenStreetMap (ODbL 1.0):** the scene must show "© OpenStreetMap contributors" wherever the roads, schools, hospitals or place names are displayed, and the link to the copyright page is in the table above.
- **Share-alike:** `roads.json`, `facilities.json` and `places.json` are simplified, clipped, classed or selected extracts of the OSM database. Publishing those extracts is the conservative case for ODbL share-alike. See open item 2.
- No personal data or non-public data is included.

## Open items

1. **Flood scale:** the depth-to-hazard scale (1 m = full hazard) is a documented assumption. Confirm it, or change `FLOOD_FULL_HAZARD_DEPTH_M` in the bake and re-bake.
2. **ODbL for roads, facilities and places:** `roads.json`, `facilities.json` and `places.json` are derivative extracts of OpenStreetMap data. Decide whether to keep publishing them under ODbL terms (with attribution and share-alike), or to replace them.
3. **IGN official polygons:** not reachable from this environment. Natural Earth is used instead. Swap in the IGN polygon once it can be fetched, then re-bake.
4. **Overpass:** mirrors unavailable. Geofabrik PBF is used instead.
5. **JRC licence wording:** confirm the attribution text at the JRC data catalogue.
6. **Copernicus attribution wording:** confirm at source.
7. **Satellite seams:** tile-scale brightness seams from mixed acquisition dates. Accepted for now; a per-tile brightness match is the next improvement.
