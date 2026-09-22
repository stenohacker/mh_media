# Builder / tutorial framing verification — September 21, 2026

Active file: `tutorial-demo-builder-v2.html`. Patched in place, with embedded project-state preserved. No website files or image assets changed; nothing published.

Backup: `backups/2026-09-21-before-unified-tutorial-framing/`.

## Changes

- One design-size frame and one uniform display scale shared by the builder and Tutorial HTML export.
- White page, bordered lavender surround, inset white presentation frame, inner canvas border, and navigation inside the same inset frame.
- Same canvas width and scale at the same viewport; toolbar/header height does not affect that scale.
- Opening cover confined to the editable canvas. Header and cover disappear on Start; frame moves upward without resizing.
- Export no longer adds ordinary-paragraph spacing to the line-based card editor content.
- Frame dimensions initialize during rendering so control updates retain canvas height.
- Fit-frame measurements account for the outer display transform. Source assets and saved coordinates are preserved.

## Verification

- 69 browser checks passed in Chrome at 1440×800, 1024×768, 390×844, and 812×375: width/height parity, saved aspect ratio, complete opened frame, overlay bounds, stable opening size, header lifecycle, navigation bounds, Menu, and matching title/callout font and line metrics.
- Generated HTML inspected visually in an isolated preview, before and after Start. No site deployment or replacement of existing exports.
- Annotation-shapes toolbar menu opens within the viewport at the new scale.
- Seven Node regression suites passed: viewport contract, draft integrity, published export contract, resize/format preservation, scaling interactions, card treatment, and tutorial output checks.
- Saved project JSON and backup JSON remained byte-identical to the pre-change backup. Embedded builder project-state also remained byte-identical.
- Legacy title rich text is canonically equivalent when export captures `{html: value}` as `{lines: [value]}`; content preservation comparison accounts for that existing serialization migration.

## Subsequent verification

The 107-control browser rerun passed after canvas height was initialized immediately and the harness waited for completed layout before collapse/expand and fit-frame measurements. The 69 framing checks also passed again with the later full-page purple surround. See `2026-09-21-purple-surround-and-edge-placement.md` for the latest design and final refresh status.

Testing covers Chrome; Safari and Firefox have not been run.
