# Credits · Larios Tres Legal concept by Noir Digital

## Photos (Imagen ilustrativa)

Both photos come from Wikimedia Commons. They show the square and the port, not the firm's office, building interior or staff. Each one is captioned "imagen ilustrativa" on the page, and the footer credits them.

| File(s) in `img/` | Used for | Source | Author · licence |
|---|---|---|---|
| `back-*`, `mid-*`, `front-*` (.webp) | Hero, three parallax layers (sea and port, plaza, foreground palms) | https://commons.wikimedia.org/wiki/File:Plaza_de_la_Marina_at_night.jpg | Pablo · CC BY-SA 2.0 |
| `farola-700.webp`, `farola-1100.webp` | Principles section (lighthouse) | https://commons.wikimedia.org/wiki/File:La_Farola,_M%C3%A1laga_at_night,_2023.jpg | Thomas Dahlstrøm Nielsen · CC BY-SA 4.0 |

Processing: the hero photo was split into three layers. The foreground palms were cut out by luminance mask, the plaza layer had the palms filled in (OpenCV inpainting) so the layers can move apart, and container lettering in the port (a shipping-line and a haulier name) was removed. Each layer was cropped (the mobile hero is a portrait crop), converted to greyscale and mapped to a dark green-to-mint duotone in ImageMagick, then exported to WebP. Under CC BY-SA, these edited versions carry the same licence. The lighthouse beams and lamp glow are CSS effects.

## Fonts (self-hosted in `fonts/`)

- **Gloock** 400, SIL Open Font License 1.1 (from `@fontsource/gloock`). Licence: `fonts/OFL-gloock.txt`.
- **Instrument Sans** (variable weight), SIL OFL 1.1 (from `@fontsource-variable/instrument-sans`). Licence: `fonts/OFL-instrument-sans.txt`.
- **IBM Plex Mono** 500, SIL OFL 1.1 (from `@fontsource/ibm-plex-mono`). Licence: `fonts/OFL-ibm-plex-mono.txt`.

## Map data

`img/globe-map.svg` is projected at build time from **Natural Earth** 1:10m land data (public domain) via the `world-atlas` package (ISC licence), simplified and drawn as an orthographic view. The country points are indicative positions (capital cities) for the countries the firm names on its website.

## Graphics

The compass dial, the nautical-chart route, the contour lines, the monograms and the icons are original inline SVG and CSS made for this concept. The optional tick sound is synthesised in the browser (Web Audio), with no audio file.

## Content

These facts come from lariostreslegal.com and the firm's Google listing, checked 19 Nov 2026: name, address, phone, email, hours, practice areas and services, team names and roles, principles, figures (394 cases in 2023, 7 languages, group founded 2005, partners in the UK, France, Sweden, Norway and Denmark) and the Google rating (5.0 from 121 reviews, re-checked on Google Maps on 19 Nov 2026).

The client checklists, the "how a case moves" stages as worded here, and the non-resident home-purchase route are general, orientative information written for this concept and marked as such on the page. They are not the firm's own published guidance.
