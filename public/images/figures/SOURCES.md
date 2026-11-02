# Figure sources

Each accordion figure is a point cloud baked from an illustration by Katerina Limpitsouni, published on unDraw (https://undraw.co), under the unDraw licence (https://undraw.co/license): free for commercial and personal use, no attribution required. The source SVGs live in `scripts/figures/svg/`. Reproduce with `node scripts/figures/bake-svg.mjs` (needs ImageMagick `magick` on PATH).

| Output | Item | Illustration |
| --- | --- | --- |
| `architecture.bin` | 1 Software architecture | Database tables (`undraw_database-tables_yft5.svg`) |
| `platform.bin` | 2 Platform engineering | Key insights (`undraw_key-insights_ex8y.svg`) |
| `cloud.bin` | 3 Cloud infrastructure | Server status (`undraw_server-status_7viz.svg`) |
| `security.bin` | 4 Security and reliability | Fingerprint (`undraw_fingerprint_kdwq.svg`) |
| `performance.bin` | 5 Performance | Rocket (`rocket.svg`), an original drawing made for this site; no licence needed |

Modifications: rasterized at 900 px wide; near-white fills dropped so shapes read as outlines; colours mapped to brightness (accent 1.0, dark ink 0.85, warm tones 0.7, light grey 0.35) and to three shallow depth planes; centred and scaled to 3.2 units tall; 14000 points sampled per pixel, with edge pixels (colour-class boundaries) weighted 30x so shapes read as line drawings.

Format `f32xyzb`: little-endian Float32 [x, y, z, brightness] x 14000 per file (224000 bytes). Mobile reads the first 6000 points.

Flame flag: in `performance.bin`, about 58% of points are the rocket's flame, sampled over its interior (other figures: 22%). Their brightness is in (1, 2], so the shader reads bright > 1 as the flame flag and clamps brightness to 1 for drawing. No other figure has points above 1.
