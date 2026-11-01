# CARTO performance changes — 2026-11-01

## Observed causes
- Wishlist decoration reparsed localStorage per card and observed every image mutation across the entire game grid.
- Two separate mutation observers repeatedly scanned all cards even though the app already emits a catalog-render event.
- Shared CSS and JavaScript were fragmented across many requests. Static sections also loaded game rendering and wishlist code they do not use.
- Reader image bytes existed only in a short-lived in-memory cache; reopening the document discarded them.

## Changes
- Deterministic content-hashed shared bundles, retaining original source files and dependency order. Relative CSS image paths are rewritten for the generated directory.
- Remove the overridden Cairo font request; retain Tajawal, Lalezar and Silkscreen and preconnect to the font host.
- One wishlist storage read per render, event-based decoration, no grid mutation rescans; 100ms coalescing for game/term searches.
- Bounded intent-based document prefetch, disabled for data saving/2G connections; no PDF or emulator prefetch.
- Optional CacheStorage for verified page-image bytes, versioned by original source checksum/page. Maximum 48 entries and 16MB. Corrupt entries, quota errors and unavailable storage fall back to normal reading. Preferences and bookmarks remain in their existing keys.
- Inline a small build-generated issue index in the reader HTML, removing the initial catalog network round trip; fetch original PDF chunk metadata only on explicit download. Warm the next rendered page only, reducing background decoding; modulepreload the image adapter. Catalog loading has a body-inclusive 15s deadline.

## Static request inventory (script + stylesheet elements only)
| Page | Before | After |
| --- | ---: | ---: |
| Home | 21 | 7 |
| Games | 22 | 8 |
| Magazine library | 19 | 6 |
| Reader | 20 | 7 |
| Sakhr | 23 | 7 |

These counts exclude images, font files and module imports; they are not a percentage improvement in wall-clock load time.

## Validation
Six new regression tests cover bounded disk caching, corruption/quota fallback, reopening without image network traffic, one wishlist read for 100 cards, and bundle dependency order. The complete repository suite additionally verifies original PDFs, all 19/1270 page manifests, lists, achievements, sound, themes and navigation. Run `node --test tests/*.test.cjs` from a complete checkout; regenerate bundles with `python scripts/build-performance.py` after shared source edits. CI verifies deterministic output.
