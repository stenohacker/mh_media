# Toolbar, fonts and export audit — September 13, 2026

**Implementation is in place in V2. Automated source/DOM checks pass. This is not final browser or playback sign-off.** The earlier browser security rejection prevented live interaction and pixel verification; no alternate browser route was used.

Changed file: `../tutorial-demo-builder-v2.html`. Backup: `../backups/before-toolbar-fonts-20260913/tutorial-demo-builder-v2.html`.

## Implemented

- Three horizontally scrolling toolbar rows using all 68 current artwork files. Removed the three separate italic/bold/underline creation buttons from the active toolbar.
- A17 main stroke width; A18 independent outer-outline color and width for markup, and magnifier border color/width. A zero width disables the outline. Filled circles/squares retain an independent interior fill.
- A7 magnifier shape choices and selected-magnifier controls; combined spacing, underline, corners, shadow, color, and opacity popups.
- Circular ten-swatch palettes sampled from the supplied color-selector PNG, with a custom-color input. Palette hex values: `#000000 #ffffff #cbcbcb #91a8ed #ff74e9 #d3f3f0 #fcf3fb #fe6f51 #ffc900 #f7fb4f`. CSS renders the circles/shadows; it does not reproduce the raster reference's grain texture.
- Main color applies to selected words, text, or fillable shapes. When nothing is selected, it sets the shared color for new text and markup. It does not recolor raster images or add an unsolicited image border. Filled markup's main-stroke color is available within A17.
- Command/Ctrl+B, I, U toggles formatting on selected words. Safe rich-text serialization retains that formatting through save/reload and export. Selected words are required; insertion-point typing-format toggles are not implemented.
- Highlight and underline have independent colors. Underline thickness/offset are independent from object strokes. Highlight/underline selection trims leading/trailing whitespace; internal spaces remain. Highlight spans have square corners and no horizontal padding.
- Underline currently uses the browser's **wavy** decoration. Its suitability for the requested hand-drawn appearance remains a visual-review item; it is not a custom hand-drawn SVG stroke.
- Ordinary, handwriting, Impact Label, and reversed Impact Label text keep their font families. Single-face display fonts use synthesized inline emphasis when needed; Hanken uses its true italic face and variable weight.
- Five font faces embedded into the builder and both HTML exports: Hanken normal/italic, Impact Label, Impact Label Reversed, Shadows Into Light Two. All five embedded binaries match the local font files. Font readiness is awaited for real exports; loading failure stops export instead of silently accepting fallback.
- Hotspot title/body rich formatting persists and moves with content when hotspot rows move, leaving marker slots fixed.
- A11 popup renames the slide/menu and can add/select a persistent title annotation. Intro-card creation remains a separate command inside that popup.
- C8 resets crop while preserving corners. GIF insertion and draft-management commands remain in menus. Save status remains visible.
- Older plain-filled markup migrates its previously rendered main color into the corrected fill property so opening old data does not change its appearance.

## Automated checks

**109 DOM/source tests passed**, plus **10 existing behavior tests**, and the link/video-popup regression suites. Tests use Happy DOM or isolated JavaScript functions. They do not exercise a real rendering engine, audio output, video decoding, native file pickers, or native popover layout.

The DOM suite checks selected-word toggles, adjacent-word preservation, partial spans, trailing spaces, mixed colors, all four text families, normalization/reload, filled-shape compatibility, crop reset, title synchronization, outline toggling, all toolbar artwork paths, and the three rendered rows. It constructs both player exports and evaluates their annotation renderers in player mode. Font readiness and layout are mocked only in those export-construction tests; actual font loading is not marked passed.

| Annotation | Normalization / save roundtrip | Builder renderer | Demo export renderer | Tutorial export renderer | Live behavior / pixels |
|---|---|---|---|---|---|
| Image | Pass | Pass | Pass | Pass | Pending |
| GIF | Pass | Pass | Pass | Pass | Animation pending |
| Shape artwork | Pass | Pass | Pass | Pass | Pending |
| Text | Pass | Pass | Pass | Pass | Font pixels/selection UI pending |
| Intro card | Pass | Pass | Pass | Pass | Timing/layout pending |
| Callout | Pass | Pass | Pass | Pass | Layout pending |
| Markup: line/arrow/circle/square | Pass | Pass | Pass | Pass | Geometry/outline pixels pending |
| Cover block | Pass | Pass | Pass | Pass | Pending |
| Blur | Pass | Pass | Pass | Pass | Backdrop effect pending |
| Magnifier | Pass | Pass | Pass | Pass | Magnified scene/outline pixels pending |
| Clip frame | Pass | Pass | Pass | Pass | Actual clipping pending |
| Link | Pass | Pass | Pass | Pass | Navigation pending; URL/form regression tests pass |
| Video annotation | Pass | Pass | Pass | Pass | Playback pending; title/picker cancellation simulations pass |
| Audio annotation | Pass | Pass | Pass | Pass | Playback pending |

Hotspot deletion/renumbering, detachment, row movement, lock-related visibility, and single/multiple alignment behavior pass the existing focused suite. Hotspot rich text moving with content passes the new suite.

## Export findings and limits

- A22 produces Video/Demo HTML, not MP4. A23 produces interactive Tutorial HTML. Both keep embedded fonts and saved word styles.
- A24 produces one PNG per slide in a ZIP, not every hotspot state. No pixel-level ZIP export was run. Blur, SVG outline filters, magnification, clipping, and selected-word decoration need special attention during PNG verification.
- Hosted image/audio/video URLs remain external by the existing architecture; embedding fonts does not make those media files offline assets.
- Live video and audio playback, hotspot progression/timing, native popovers, native color controls, dragging/resizing, wrapping, and final appearance still need browser verification.
- The save-status artwork has the filename prefix `Ab23`; it is placed at the end of row A with its status text visible. C12 is explicitly labeled as slide background fill. These placements/labels remain reviewable.

## Background and data preservation

No background creation/replacement function was changed. `addSlide`, `applyDefaultBackground`, `replaceSlideMedia`, and `replaceCoverBackground` match the backup. The new background image, regular/scroll default behavior, removal choice, and zoom/placement are deferred. B3 therefore retains the existing scrolling-slide creation behavior for now.

The embedded `project-state` JSON is byte-for-byte unchanged. The active filename/URL was not moved. No website files, sibling builders, or published pages were changed.

Evidence: [DOM test results](toolbar-fonts-tests/dom-results.json), [behavior results](toolbar-fonts-tests/behavior-results.json), [font binary checks](toolbar-fonts-tests/font-binary-checks.json), [DOM test source](toolbar-fonts-tests/test.mjs).

## Follow-up: rename location

Removed Rename Draft from the toolbar menus, including the old More menu. The opening Tutorial Drafts chooser now has Rename beside each draft. It renames the selected draft without opening it. A focused mocked-API check passed for correct draft targeting, unchanged other drafts, invalid IDs, and failed requests preserving the original name. Browser interaction remains unverified.
