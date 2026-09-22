# PNG/PDF reading exports — September 21, 2026

## Scope and preservation

Implemented the confirmed static-export layout in the active `tutorial-demo-builder-v2.html`: annotated image on the left, all hotspot cards expanded in numbered order on the right. This replaces the earlier proposed per-hotspot-step PNG rule for PNG/PDF only. Marker coordinates are preserved regardless of lock state. The interactive tutorial is not rearranged.

The builder was backed up to `backups/2026-09-21-before-reading-exports/`. Its embedded `project-state` remains byte-for-byte identical to that backup. Named project data and history were not edited, and the user's original browser draft was not reloaded. Autosave remains automatic. No deployment or commit was performed. Concurrent blank-slide filtering changes were preserved and their test passes; that separate work is not attributed to this change.

## Implementation

- Added a PDF export button next to PNG. PNG still downloads a ZIP.
- Added `scripts/tutorial-reading-export.js`, an isolated reading-page layout shared by PNG and PDF. Export captures a snapshot and renders in a separate frame without navigating or redrawing the live editor.
- Pages are landscape US Letter: 3300 × 2550 pixels at 300 dpi. Card body text defaults to the equivalent of 13 pt. Long cards continue across pages instead of shrinking. Image-only slides use the available width, and long scrolling images continue over multiple pages.
- Added the pinned local `pdf-lib-1.17.1.min.js` browser runtime and its MIT license. PDF embeds the lossless PNG page artwork; the resulting PDF is image-based, not searchable/selectable text.
- Native browser image capture preserves rich formatting, line-label spacing, blur, magnifiers, shadows, and image proportions. Missing image assets stop export with an error rather than silently dropping artwork. Failed jobs release the export guard and remove their frame.
- Fixed rich-text serialization when one saved rich-text row contains multiple physical lines. This prevents repeated rendering/export from duplicating subsequent text. Existing repetitions already saved in a draft are not removed. Untouched automatic hotspot titles are no longer marked manual by synchronization.
- Standalone HTML exports exclude the reading/PDF runtime dependencies.

## Verification

All 11 current regression suites pass: blank-slide-export, combined-text-controls, copy-paste-properties, draft-integrity, highlight-color-routing, plain-text-list-toolbar, published-export-contract, resize-format-preservation, scaling-interactions, three-card-treatment, and tutorial-output-checks. Main/runtime JavaScript parses, and embedded project-state preservation is asserted.

Browser checks used isolated fixtures under `audits/`, including a read-only snapshot of the saved tutorial and synthetic cases:

- Exported actual PNG ZIPs and an eight-page PDF. All eight final PDF pages and all four edge-case PNGs were visually inspected using the PDF skill's render-and-verify workflow. Card columns fit without overflow.
- Confirmed all locked and unlocked markers retain their authored positions; all hotspot cards appear in order, with empty bodies remaining tidy.
- Confirmed every character of a long styled paragraph survives continuation pages, including emoji, pink/bold spans, and numbered list items 7–28.
- Verified soft breaks, numbered text, line labels, character spacing, blur, magnifier content, and the top/middle/bottom of a long scrolling image.
- Repeated PNG/PDF exports passed a fixture check that draft text and annotation geometry remain unchanged.
- Deliberately missing artwork stops both PNG and PDF exports with an error; retry works and the editor remains usable.
- ZIP integrity passes. All eight PNGs and PDF embedded page images measure 3300 × 2550. PDF page boxes are 792 × 612 points. PNG/PDF card-column pixels match exactly; independent captures have only tiny background-image raster-rounding differences (mean below 0.01 per 255-level channel).
- Exported standalone tutorial HTML parses and opens independently. Start hides the site header; Back/Next/Menu remain visible. A narrow-viewport smoke test kept navigation within the viewport, and the player reported no console errors. This was not a comprehensive responsive-layout audit.

The browser checks ran in the in-app browser. An isolated Chrome connection attempt failed with a detached-command error, so no separate Chrome pass is claimed. Scratch fixtures, downloaded outputs, and rendered pages are QA artifacts, not deliverables or published tutorials.

## Still separate

The broader builder-integrity audit, interactive locked-hotspot/card behavior, and remaining card-control simplification requests are not marked complete by this focused export verification. Video export was not changed or audited.
