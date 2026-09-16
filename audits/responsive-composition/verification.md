# V2 export composition repair — September 14, 2026

Active builder: `tutorial-demo-builder-v2.html?project=project-20260911224204-78c95f64`.

The user's labels outside the 5:3 stage are intentional. Player layout now includes those objects in the composition bounds, including rotated extents and space for outlines/shadows. Authored coordinates remain unchanged. Both player modes use a 1500 × 900 design stage and scale the composition together. Ordinary text and spacing now use stage-relative units, and exported text/card frames fit overflowing text before the composition is scaled. Slide navigation uses yellow rectangular Back/Menu/Next buttons; demo playback uses compact boxed controls and a blue timeline.

The V2 builder has a different scene-coordinate system from the older V1 builders named in the historical handoff. This repair targets the user's explicit live V2 file and its two standalone output modes; the older builders and website were not changed.

Backup: `backups/before-responsive-composition-20260914-003918/`, including the builder and project databases. Final comparison verified all five slides, annotation values and positions, and embedded template state unchanged.

Fresh standalone outputs from the current disk draft:
- `exports/2026-09-14/appearance-pages-demo.html`
- `exports/2026-09-14/appearance-pages-slides.html`

Verification:
- Actual builder-generated previews: demo and slide modes; desktop and narrow iframe sizes; no clipped top-level composition objects or overflowing ordinary text frames.
- Final standalone HTML: phone at 358 × 761 CSS pixels; slides at 1492 × 1045; demo at 1910 × 1075 and landscape 895 × 358. No clipped top-level objects, preserved 5:3 stage ratio, no horizontal page overflow in phone checks, footer visible in landscape, demo controls 44 × 44 CSS pixels.
- Back, Next, Menu navigation to another slide, play/pause and restart were exercised in the browser.
- Browser reported no JavaScript errors during final demo checks.
- Bounds regression test verifies intentional left/right overflow, rotated corners, nonmutation, and separate scroll-page behavior.
- Exported JavaScript parsed; embedded draft content compared with saved state. Fonts and player runtime are embedded. Existing hosted media remains external.

The in-app browser did not expose a completed download event for the toolbar download action. Final files were therefore written by running the same `buildExportHtml` function in a local DOM harness against the saved draft, with only font/layout waits stubbed (those had been checked in the real browser preview). Those resulting files were subsequently loaded and tested in the browser. Normal browser download delivery was not independently verified.

No website files were edited and nothing was published. Very dense slide content necessarily becomes small when the entire composition is fitted to a phone; the repair preserves its geometry rather than rearranging authored objects into a different page layout.
