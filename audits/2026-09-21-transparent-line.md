# Transparent lines for curved text — 2026-09-21

Added Make line transparent / Show line to the existing line and arrow text controls. The persisted lineTransparent setting applies only to path markup. SVG opacity hides the stroke, marker, and outline while retaining its geometry and dimensions; the separate curved text remains visible and editable. Existing width, color, outline, shadow, and curve settings are preserved for Show line. The setting is included in copied formatting and survives normalization/reopening and standalone export. The shared renderer also handles contents previews and reading captures.

Active source: tutorial-demo-builder-v2.html. The old V1 canonical files are absent; old QA/exports are not authoring tools. Embedded project-state was unchanged. Backed up the live file and latest saved drafts before installation. No website changes or publishing.

Browser checks in a separate fixture:
- Solid arrow with shadow/outline: transparency changed SVG opacity from 1 to 0 while label opacity stayed 1. Text, every curved-glyph transform, object bounds, and scroll position were unchanged.
- Show line restored opacity 1; toggling again restored transparency. Dragging the bend handle still updated the curve with visible text.
- Dotted line supported the same toggle.
- Reopening retained both transparent paths and their text.
- Actual tutorial and demo exports retained the boolean, text, and curve points. Opened the generated tutorial: both SVGs had opacity 0, both labels had opacity 1 and curved glyphs, with no editing controls in the player. Full tutorial export also generated its downloadable PDF successfully.
