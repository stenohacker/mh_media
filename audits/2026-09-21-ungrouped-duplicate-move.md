# Ungrouped duplication and shared Move handles — 2026-09-21

User requests: Ctrl-D must duplicate a selection without grouping; multiple selected text annotations need side handles for moving together.

Reproduced in an isolated browser fixture before editing: Shift-clicking a callout body after selecting a square cleared both selections. Ctrl-D in a focused text annotation did nothing. The underlying duplicate function already handled multiple objects, but focus and shortcut dispatch blocked the interaction.

Changes:
- Shift-clicking an editable annotation prevents editor focus from replacing the existing selection. Additive object selection saves and releases the previous editor before rendering.
- Ctrl-D/Cmd-D works from annotation and hotspot text editors as well as the canvas. Text is captured before cloning; focus is released so redraw cannot reselect the original. Other text inputs retain their normal behavior.
- Duplicate objects remain selected without creating a permanent group. Preserve relative layer order independently of selection order; remap selected clipping-frame members once.
- Added labeled yellow Move handles to the left and right of the shared selection frame, alongside the existing four scale corners. Handles stay within the visible stage width and use the existing shared-delta drag code. Locked objects remain excluded from movement; spacing, text, sizing, and group membership remain unchanged.

Browser validation:
- Real Shift-clicks selected an ungrouped square, callout, and text together. Ctrl-D duplicated all three, with fresh IDs, correct relative stacking, and blank group IDs. Repeated native Ctrl-D kept the copied objects selected and kept window scroll unchanged.
- Actual mouse drag on the left Move handle moved all three copies by the same delta while originals stayed unchanged and page scroll stayed fixed.
- Actual Shift-clicks selected two independent text annotations. Actual right Move-handle drag moved both by the same delta, preserving their 38-point horizontal spacing and page scroll. Native Ctrl-D duplicated both; Ctrl-Z removed both copies. Duplication during active text editing preserved the latest typed text.
- JS parsed; duplication/selection and existing group-geometry regression checks passed. Installed regression checks are recorded by the task's tool results.

Patched only the active V2 builder; its embedded project-state remained byte-for-byte unchanged. No project stores, website files, or published exports were modified. The older V1 canonical filenames remain absent. Backups of the active HTML and current project stores are in `backups/2026-09-21-before-ungrouped-duplicate-move/`. The user's working browser was not refreshed during editing.
