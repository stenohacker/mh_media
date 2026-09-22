# Builder V2: requested fixes and verification

This is the verification record for the requested fixes, not the subsequent broad integrity audit.

## Scope and safety

- Patched `tutorial-demo-builder-v2.html` in place. The embedded `project-state` remains byte-for-byte identical to the pre-change backup.
- Kept the existing browser/disk autosave workflow, active builder filename, and project URL. No deployment, project duplication, or manual-save workflow was introduced.
- Browser tests used separate `qa-builder-*.html` filenames. These cannot enter the named-project API path, which requires the exact `tutorial-demo-builder-v2.html` basename. The active user draft was not reloaded for testing.
- Preserved the user's deleted older builder files and unrelated project-history changes.
- Backups: `backups/2026-09-21-before-scaling-shortcuts/`, including the baseline builder/project store and the pre-line-label milestone.

## Implemented behavior

- Normal handles change the container/geometry only. K enters uniform scaling; Escape leaves it. Standalone text, callout, title/intro card, and hotspot popup retain authored typography during ordinary resizing. K scales their contents proportionally.
- All eight handles are supported for the hotspot popup, with saved width, height, position, and content scale.
- Text editing preserves rich formatting, explicit numbered-list starts, blank lines, inline fonts, and text case through editing, redraw, autosave/reload, and tutorial export.
- T/W insert `text`, focus it, and select the placeholder for replacement. Font-toolbar actions format highlighted words.
- N adds a callout. Shift+N opens New Shapes; Shift+O opens Original Shapes. The two artwork collections remain separate. All 158 original-art filenames have matching thumbnails and full-size files under the corrected directories.
- Other tool keys: H hotspot, M magnifier, B blur, S shadow toggle, L line, A arrow, C circle, Q square.
- `[`/`]` move one layer; Ctrl+`[`/`]` move all the way back/front. Ctrl or Cmd+Z undo; Ctrl or Cmd+Shift+Z redo.
- Circle/square insertion uses physical scene proportions. Ordinary resizing can change their shape; K preserves proportions.
- Lines/arrows have larger grips; endpoint drags preserve the opposite endpoint, including rotated paths. Bend grips follow the actual curve midpoint and stay clear of attached text.
- Attached line/arrow text starts centered and follows the line's tangent. A pink grip slides it along the path. The transparent and filled versions both use a real SVG gap. Filled labels default to white; both default to black text.
- Outside controls: S ↔ flips shadow; T ↔ turns text 180°; A ↔ moves the arrowhead to the opposite end without changing the text or curve. Text controls move above the object when there is insufficient room below.
- Label font, text color, and background use the main toolbar in label-editing context. These actions do not recolor the underlying line or slide. Regular and handwriting controls are also available beside the line.
- Copy Properties retains the destination's words/geometry and replaces its styling. For mixed text, the selected word supplies the style throughout the destination field. Card title/body roles are captured separately. Old font/color/emphasis/highlight/underline overrides are replaced, not left behind.

## Automated checks

All passed:

1. `scaling-interactions.test.mjs`: JS parse; eight uniform handles; ordinary resize; four layer commands; explicit numbering; rotated endpoint anchoring; curved label projection; transparent gap; arrowhead reversal; outline masking; editable-span protection.
2. `copy-paste-properties.test.mjs`: actual shortcut dispatcher for Ctrl/Cmd property copy/paste and undo/redo; text, drawn shapes, artwork, card and hotspot profiles; content/geometry retention.
3. `resize-format-preservation.test.mjs`
4. `three-card-treatment.test.mjs`
5. `draft-integrity.test.mjs`
6. `plain-text-list-toolbar.test.mjs`
7. `highlight-color-routing.test.mjs`
8. `published-export-contract.test.mjs`

Seven browser DOM regressions also passed: sanitizer stability, nested editor formatting repair, list-kind/start retention, word preservation, selected-word style copying, destination text/list/blank-line retention, and removal of old emphasis when copying plain text.

## Actual browser checks

- Ordinary vs K resizing on callout, title card, standalone text and hotspot popup; reload retained dimensions, content scale, and formatting.
- Original artwork loaded from `/images/tutorial-annotations/old-annotations-for-dropdown/`; dragging the artwork moved it. Resizing retained its natural aspect ratio (1.08898 rendered vs 1.08900 original) and tight visible-art selection bounds.
- Circle/square insertion produced equal physical width/height; K retained that equality.
- Extended and bent an arrow without moving the opposite endpoint. Label sliding, all three independent flip actions, font switching, selected-word color changes, filled/transparent backgrounds, normal resize, K scaling, and autosave reload passed.
- N, Shift+N, Shift+O, T/W ready-to-type focus, undo and redo passed.
- Copied shape properties without changing line/arrow family or label wording. Copied selected-word font, pink color, bold, italic, highlight and underline throughout differently styled target text; copying plain styling removed all old emphasis. Reload, undo and redo retained the expected results.
- The in-app browser intercepts Ctrl+Shift+V as native text paste. Property application was therefore exercised through fixture-only buttons calling the same production functions; the real keyboard dispatcher was separately executed in the automated tests. No fixture buttons were added to the production builder.
- Downloaded actual Tutorial HTML exports, not just builder screenshots. Initial website header was present; Start hid it. Text, labels, gaps and arrowhead direction survived export, with no editing controls.
- Desktop and 391×843 CSS-pixel mobile viewport checks passed: no horizontal document overflow, navigation visible, and hotspot popup/text scaled together. The repaired popup stayed within its mobile container.

## Boundaries

- The broad integrity audit is still to be done with Tam.
- Video-specific behavior and PNG export were not audited. New label editing controls were added to the existing PNG exclusion list so authoring buttons are not included in captures.
- Container-only resizing intentionally does not shrink the font to force text into an undersized box; authors must leave sufficient room for their text. Tutorial export no longer silently reduces authored typography.
- Reload the active builder only after its autosave status says saved, to load this updated runtime.
