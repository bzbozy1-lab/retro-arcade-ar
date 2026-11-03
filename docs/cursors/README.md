# CARTO native cursors

Three original 32×32 designs, normal and pressed variants. Arrow hotspot (3,3), glove (12,3), cartridge arrow (3,3). SVG with PNG fallback, ink outline and paper keyline. Limited lime, cream, blue and orange gradients preserve the incumbent brand. All 12 image assets total 19,177 bytes.

## Distribution
- Arrow: page background and general browsing.
- Glove: navigation, links, buttons, hearts, dialog controls, theme, sound and CRT tools.
- Cartridge arrow: device links, archive cards, game and personal collection cards, game details, magazine covers, Sakhr program cards. Buttons inside discovery cards keep action semantics; game-detail buttons use the cartridge.
- Native cursors: text and editing fields, native selects/ranges/files/colors, disabled/busy actions, and the complete magazine reading stage.

## Behavior
Native CSS cursors, without hiding the system pointer, pointermove tracking, followers, timers or animation loops. Only enabled for a fine hover input; forced-colors retains system cursors. Pressed color changes keep identical silhouettes and fixed opaque hotspots. Six SVGs warm once on eligible sessions. Touch-only and opted-out sessions request no cursor images. Preference uses only carto-cursor-v1; existing saved data is untouched.

Identity section #cartoCursors documents enlarged and actual-size artwork, normal/pressed states, distribution, live test targets and a persisted system-cursor toggle.

## Validation
82 local tests passed; two existing full-original-PDF tests were excluded because original PDF chunks are absent from the local checkout. Six new cursor tests cover preferences, touch/forced-color gating, storage isolation, deterministic images/hotspots and semantic CSS. Build and asset generation are deterministic.

Cloud Chrome: normal/pressed artwork inspected on desktop; 360 and 390 identity layouts have no horizontal overflow; 1440 game cards and search field resolve to cartridge and text cursors respectively; at 1024 the magazine reading stage and children resolve to auto. System opt-out survived reload; re-enabling and cartridge demo worked. Dark theme and CRT remained enabled alongside cursors. No site-origin console errors observed in identity; browser-extension metadata errors are unrelated. Cloud pointer overlay does not prove native OS cursor rendering; verify other operating systems separately.

## References
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/cursor
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/any-pointer
