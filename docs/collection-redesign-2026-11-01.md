# Personal collection redesign — 2026-11-01

## Scope and rationale
The user's screenshot shows small pixel-font game names, no cover artwork, repeated heart/edit controls opening the same dialog, and separate status groups requiring a long scan. The task is identifying saved games, narrowing to the player's current intent, and changing status with the existing five categories. Navigation, catalog facts, game names, routes, sound events, achievements and the `carto-personal-wishlist` key stay in place.

The connected Mobbin reference search refused access because it requires a paid plan. No Mobbin screenshots or product-pattern claims inform this implementation. The choices below are design judgments from the supplied screen and the user's stated goal.

## Interface
- Compact cover-led cards, readable Tajawal titles, device pictogram/name and documented genre.
- The same five statuses in labeled filter buttons with counts; an all-games view replaces five permanently expanded groups.
- Search matches names, documented display names, genres and devices. Device filtering intersects with status and search.
- Sorting by play plan (playing, later, someday, completed, avoid), recently added, or title. All sorting is a view; records and timestamps are not reordered in storage.
- One inline native classification select and a separate details action per card. The original dialog still supports editing and explicit removal from the list.
- Full empty-library and zero-search-result states; resetting filters never deletes saved games. Failed cover images reveal a lightweight existing device pictogram.
- One-column compact cards on narrow screens, two on medium and three on desktop. Existing CARTO palette, fonts, border and shadow roles are retained. No new dependency or remote image provider.

## Data behavior
A pure model filters/sorts copies and updates only the requested record's category. Its existing device, addedAt and extra fields are retained. The write path uses the existing save function and emits the same wishlist-change category event only after successful persistence, preserving sound and achievement behavior. Unknown legacy records remain visible in the all-games view and may be classified explicitly; no migration or clearing is performed.

## Validation
Five added regression tests cover combined filters and legacy records, Arabic/English/genre search, nonmutating sorting, field-preserving classification, and dependency/storage-key integrity. Browser checks use temporary games added through the public heart/category interface, not direct storage writes. Temporary test entries are removed through the interface after documentation.
