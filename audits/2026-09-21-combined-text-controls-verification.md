# Combined text and underline controls — September 21, 2026

Changed the active `tutorial-demo-builder-v2.html` runtime in place. The embedded project state is byte-for-byte unchanged from the pre-change backup in `backups/2026-09-21-before-combined-text-controls/`. No named project data was edited, no active user draft was reloaded, and nothing was deployed.

## Changes

- Existing Text Size button now opens **Text size and spacing**: font size, character spacing, and line spacing. Removed the separate Text Spacing toolbar button. Existing per-annotation slider availability and separate Fit Text Frame action are preserved.
- Existing Underline Color button now opens **Underline**: color palette/custom color, thickness, offset, straight-to-hand-drawn slider, and toggle underline. Removed the separate underline-settings toolbar button.
- Hand-drawn amount is stored with the formatted words. Zero produces a straight stroke; 100 produces the strongest curve. Missing values retain the previous gentle underline appearance (equivalent to 30). Rendering is deterministic and includes room for the stroke, without clipping.
- Opening Underline reads the selected word's saved settings. Dragging a slider keeps the selected words targeted. Reopening, rich-text normalization, Copy Properties, and standalone HTML export retain the amount.
- Fixed a related issue discovered during testing: applying underline/font formatting could lose an existing word highlight. Underline and highlight now render as separate background layers so both remain visible.
- Dropdown positioning uses its actual height so the taller combined menu stays within the viewport.

## Verification

All nine regression scripts passed: combined-text-controls, scaling-interactions, copy-paste-properties, resize-format-preservation, three-card-treatment, draft-integrity, plain-text-list-toolbar, highlight-color-routing, and published-export-contract.

Background browser testing used an isolated fixture, not the user's project:

- All three typography sliders updated the selected text object; values 29, 0.5, and 1.25 remained after autosave and reload.
- Selected only “Pink” in “Pink plain words.” Tested straight (0), maximum hand-drawn (100), and actual pointer dragging to 45. The selection remained “Pink,” other words stayed untouched, and the existing highlight/font/emphasis survived.
- Underline thickness 3.5, offset 4.5, color #b23386, and amount 100 survived autosave/reload; reopening the menu showed the saved values.
- Ten browser DOM regression checks passed, including repeated sanitization, zero-value preservation, selected-word Copy Properties, numbering, blank lines, and formatting repair.
- Exported an actual standalone Tutorial HTML file and opened it separately. The saved typography values and hand-drawn underline/highlight rendered on the tutorial slide. Artifact: `audits/combined-text-controls-tutorial-export.html` (test-only export).
- Visually inspected the combined underline menu and exported text. No browser console errors in the builder test tab.

Autosave workflow remains automatic. This is focused verification for these controls, not completion of the broader builder-integrity audit. No video/PNG-specific testing was added.

## Follow-up: character spacing on arrow and line labels

Added `lineLabelLetterSpacing` (default 0; range -2 to 12 in 0.5 increments). Selecting attached arrow/line text enables Character spacing in the existing Text size and spacing dropdown. The label uses scene-relative spacing, and the existing measured SVG gap updates after its width changes. This property survives normalization/autosave/export and is included in Copy Properties. Existing labels retain their original spacing.

Verified regular arrow text with transparent background and handwriting line text with white background. Arrow spacing 2 increased label width from 162 to 184 and expanded its gap without changing the other line. Line spacing 1 increased width from 121 to 131; an actual slider drag set it to 5.5. Both labels retained their words and independent spacing after autosave/reload. Opened and visually checked an actual standalone Tutorial export with both settings and correctly sized gaps (`audits/line-label-spacing-tutorial-export.html`). All nine regression scripts and ten browser DOM checks passed; no builder console errors. Embedded user project state was unchanged against `backups/2026-09-21-before-line-label-spacing/`. No active user draft was reloaded and nothing was published.
