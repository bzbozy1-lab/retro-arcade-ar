# Compact CARTO controls and archive-only Sakhr entry

Sound and appearance controls: 108×48 CSS pixels, 26px icons. CRT toggle: 96×48, with an independent 44×48 settings button. Shared short offset shadows, paper gradients, clear text states, lime enabled states and dark-theme surfaces. Existing sound/theme/CRT JavaScript, preference keys, animations and reduced-motion behavior are unchanged. Mobile tools form one row inside the existing disclosure, with 20px icons and responsive widths.

Sakhr is accessed only through archive.html#sakhrPortal. Its former header, footer and homepage links were removed; the visual identity link leads to the archive card. The original Sakhr mark is reused. Archive cards form two columns on desktop and one on mobile. Sakhr content is unchanged, with Archive as its active parent navigation.

Identity documentation was updated in the existing controls section and the CRT mobile description.

## Validation
82 local tests passed, excluding two existing original-PDF tests whose chunks are unavailable locally. Existing navigation regression test now verifies exactly one direct Sakhr entry in the archive across all public pages. Deterministic bundle regeneration verified.

Cloud Chrome tested: archive layouts at 360,390,1024,1440 widths, no horizontal page overflow; 360 mobile labels inspected after adjustment; magazine mobile menu at390 and reader at360; reader stage untouched. Sound, theme and CRT toggles work by pointer and Enter; CRT medium setting opens/selects/closes; states persist on navigation and reload; Sakhr card opens correctly and Archive remains active. Full cross-browser and physical touch-device testing was not performed.

## Research
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced — preserve generous targets while reducing decoration.
- https://www.w3.org/WAI/ARIA/apg/patterns/button/ — native keyboard activation and state semantics.
- https://web.dev/articles/prefers-reduced-motion — keep existing reduced-motion behavior.
