# New hotspot artwork and unified palette — September 14, 2026

Implemented in the live V2 builder, five retained builder/working copies, five current standalone players, and the current local website. No deployment.

## Final palette

Black `#000000`, white `#FFFFFF`, existing gray `#E1E2E7`, yellow `#F1F332`, teal `#26AB9D`, pink `#FF90E7`, soft pink `#FBEAF9`, purple `#91A8ED`, orange/yellow `#FFC900`, mint `#D3F3F0`, mauve `#B23386`.

The eight original PNGs are in `mh_media/images/tutorial-annotations/hotspots/`. Their names provide exact color codes. The teal file was renamed to `teal-26AB9D.png` during this work. That supplied color replaces the website's earlier `#24A094`. Shared tokens, hardcoded website styles, and builder picker presets agree. Old V2 saved teal values normalize on load, including RGB rich-text values.

## Behavior

- All six V2 color menus (main, highlight, underline, background, outline, stroke) share the same eleven presets and retain custom colors.
- Native color inputs in the retained builders use the same palette suggestions.
- Hotspot marker, numbered preview, and card header use the same slot color. Reordering title/body contents preserves marker positions and color assignments; renumbering keeps marker/header pairs consistent.
- The mauve marker and header use white text; other supplied colors use black text.
- Original PNG bytes are embedded directly in every updated runtime and future tutorial/demo export. Hotspots require no media-host deployment.
- Callout header colors use the same palette. Slide title cards retain their black headers and existing controls.

## Verification

- `hotspot-header-colors.test.mjs`: all eight named PNGs embedded byte-for-byte, exact colors, matching headers/previews, reload/reorder/delete, preserved geometry, tutorial and demo serialization.
- `website-palette-pickers.test.mjs`: all eleven colors agree with website tokens; all six menus and native inputs expose the same options; custom colors remain usable.
- `cards-drafts-popup.test.mjs`: card creation/editing/header-only behavior, two complete callout color cycles, Drafts, and popup playback controls pass.
- Existing text formatting, margin-placement, and ordinary-slide regression tests passed during this change before the final teal addition.
- Browser: V2 color choices applied through the toolbar; eight original hotspot images load, matching colored headers and readable numbers; menu preview artwork loads. All five retained runtimes tested using isolated copies and real navigation.
- Browser: generated tutorial and demo exports load the embedded artwork. At a measured CSS viewport of 375 × 667, the tutorial has no horizontal overflow and the navigation controls remain inside the viewport. Temporary viewport override reset.
- All five updated current player URLs loaded successfully. Reporter Tools computes the new teal, mint, mauve, and existing gray from shared CSS.
- All 98 inline scripts in the 50 changed/backed-up files parse. All 11 saved project-state blocks are byte-identical to their backups.
- Website release checklist passes: 340 checks, links/media/content architecture valid.

Backups and changed-file manifest: `mh_media/backups/before-new-hotspots-20260914/`.
Artwork filenames, exact codes, and SHA-256 checksums: `new-hotspot-artwork.json` in this audit directory.
Temporary fixture files were removed after verification. The user's live builder URL and browser draft were not replaced or reset. Save and refresh the live builder to load this runtime; previously downloaded standalone HTML requires a new export to receive changes.

## Follow-up: exact callout rotation

The user confirmed the eight named hotspot files are the website/rotating-callout palette. Automatic callout headers now derive directly from HOTSPOT_STYLES, excluding the additional neutral picker colors. A full eight-card browser cycle used all eight unique colors, and reload preserved the assignments. Card tests verify two cycles without adjacent repeats. All six current runtimes were patched without changing project data. Hotspot/header tests and website 340-check release checklist passed. No move/resize/locking code changed after the user withdrew that request. Backup: `backups/before-eight-color-callout-cycle-20260914/`.
