# Toolbar and export source audit — September 12, 2026

Status: source audit and isolated JavaScript checks completed; browser interaction and exported-file visual verification NOT completed. No builder, project state, or published website was changed. This is not final release sign-off.

The launcher opens `tutorial-demo-builder-v2.html` on port 8765. This is the primary audited toolbar. The older handoff names three canonical files under `tutorial-builder-work`; those were compared for shared-feature presence and export implementations. Both Appearance Pages working files were also syntax/state checked. Existing exported tutorials were not exhaustively opened or tested.

## Confirmed findings

1. **Plain Filled squares/circles cannot be recolored correctly using Selected object color.** `applySelectedObjectColor` writes `fillColor` for all markup names containing `fill`. But `markupSvg` draws `square-fill` and `circle-fill` with `markupColor`. Isolated execution of the actual functions confirmed that choosing red leaves the SVG tied to the unchanged black property. The separate fill picker also writes the unused property for these two styles. Source: primary file lines 7876 and 8837.

2. **Bordered filled shapes have no dedicated outline-color input in the active toolbar.** Both Selected object color and the separate fill picker write their fill. The `markupColor` input remains in `renderLegacyToolbar`, but the active `renderToolbar` does not emit it. Thus a selected Filled + Solid Border or Filled + Dashed Border shape cannot independently change its outline using these visible color controls. Changing the implementation must preserve distinct fill and stroke values. Source: lines 8126, 8293, 8380, 8381.

3. **Selected object color does not mean the same property on every item.** Text: text color. Cover block: fill. Unfilled line/arrow/circle/square: stroke. Filled markup: fill, with the defect above. Intro/callout: title and body text together. Image/GIF/library shape/video/audio/link/clip frame/blur: a two-pixel outline around the object frame, rather than recoloring the artwork. Magnifier: outline. Hotspot: disabled. A photo or PNG shape is not internally recolored by this function. Source: `appearanceStyle`, `selectedObjectColor`, `applySelectedObjectColor`, lines 7859–7886; CSS lines 3321–3327.

4. **Color applies only to the primary selected object.** The function calls `selectedObject()`, not `selectedObjects()`. Group/multiple selection does not receive a batch color operation. This is a behavior to make explicit, not an assumption about the desired design.

5. **Thumbnails do not fully reproduce new appearance properties.** Contents previews draw plain escaped text rather than the saved word-color HTML. Their card title/body styles also do not consume `--appearance-text`; image thumbnail markup lacks the stage `.object-frame` used for the new border. Stage appearance is therefore not a reliable match to contents thumbnails. Source: `renderContentsPreviewAnnotation`, lines 9129–9173; appearance CSS lines 3321–3327. This is established from separate renderer paths; no visual comparison was possible.

6. **Shared features have diverged across builder files.** The primary combo file contains `applySelectedObjectColor` and `selectedCornerAnnotation`; all three older canonical builders lack them. Shared word-color controls exist in the canonical builders. This means edits to one builder do not automatically fix the others or pre-existing standalone exports.

7. **The three older canonical builders still have placeholder PNG export functions.** Their PNG buttons report that export is not checked off; they do not produce the primary builder's ZIP output. Demo line 8320; centered line 7616; video-page line 8150.

## Current controls and consolidation candidates

| Existing control | Actual target / purpose | Assessment |
|---|---|---|
| Selected words text color | Highlighted characters in an editable text field | Can live in one contextual color panel, but preserve word selection and inline formatting |
| Selected words highlight / clear highlight | Background behind highlighted characters | Distinct property from foreground text color |
| Fill color beside markup menus | `fillColor`; also next-markup default | Overlaps selected color for bordered fills; plain-fill bug above |
| Selected object color | Type-dependent property, primary selection only | Suitable starting point for a contextual appearance panel |
| Text color near text creation buttons | Text annotation color; also used when adding text | Overlaps selected-object color for text; preserve or deliberately redesign creation defaults |
| Cover color | Selected solid cover block; also read when adding one | Overlaps selected-object color for covers |
| Background color | Current slide media matte | Keep explicit as a slide property; selection must not silently redirect it |
| Round corners more / less | Images, GIFs, library shapes, and square markup | Same supported objects as corner preset/slider; consolidate |
| Corner preset + slider | Image corners or square SVG radii | One group can offer presets and precise adjustment; square conversion is 0–50 UI to 0–43 internal |
| Magnifier shape | Square, rounded, circle lens viewport | May be placed in contextual appearance UI, but uses separate geometry from image/square corners |
| Object left/center/right/top/middle/bottom | Changes object position | Keep separate from text alignment |
| Hotspot text left/center | Hotspot text alignment | Could share contextual text-alignment buttons with text/cards |
| Text/intro/callout left/center | Alignment inside selected text/card | Does not move the object |
| Intro Body left | Body-only override, allowing centered title with left body | Preserve this independent capability |
| Markup weight +/− | Markup stroke width | Separate property; does not set photo/frame border width |
| Markup transparency +/− | Markup opacity, minimum 10% opacity | Distinct from a transparent fill or invisible magnifier outline |
| Shadow toggle / elevation | Selected object shadow; helper currently accepts any object | Do not infer support solely from the image-oriented tooltip; visually verify each type |
| Magnifier Outline | Lens outline on/off | Independent of fill and shadow |
| Background image / Replace slide image / Replace scrolling slide image | All dispatch `replace-slide-image`; scrolling button adds a slide-kind guard | Actual repeated action, candidate for a contextual Replace main media button |

Object alignment has another important distinction: a single selected object is centered on the slide; multiple selected objects are centered relative to their collective bounding box. A multi-selection is not moved as a group to the slide center.

## Export coverage and remaining checks

- **Video / Demo HTML and Tutorial HTML:** `buildExportHtml` clones project state and runtime, switches body to player, removes authoring selection, and changes page mode/navigation. Both inherit the markup rendering defect. Neither depends on keeping the builder file after export. Hosted media and font URLs remain external dependencies.
- **Preview:** uses the same `buildExportHtml` function. Good architectural reuse, but not proof the downloaded file renders correctly in its destination.
- **Editable copy:** embeds state and keeps authoring behavior. Preserve its URL/autosave relationship when repairing files.
- **Primary PNG ZIP:** separate html2canvas capture path, one image per slide. It initializes each slide to intro/no active hotspot or the first hotspot; it does not export every interactive hotspot state. Confirm whether that is the desired output contract.
- **PNG concerns needing real exported-file inspection:** shadows/filter effects, blur, rounded clipping, word formatting, video frames, external images, tall scroll slides, and residual authoring UI. `inlinePngExportImages` is defined but never called. Its image/video fallback cannot be credited as protection in the active export path. Capture stays in builder mode and removes a specific list of handles rather than switching to the HTML player renderer.
- **Older canonical PNG buttons:** placeholders, as noted above.
- **Existing standalone exports:** repairs in builders do not update previously exported HTML automatically. Identify the actual deliverables to regenerate after fixes.

## Verification performed

Parsed executable inline JavaScript and embedded project JSON in six files: combo V2; canonical demo, centered, and video-page builders; `tutorial-builder-work/appearance-pages-demo.html`; `tutorials/ap-demo/appearance-pages-demo.html`. All passed parsing.

Executed the primary file's extracted color and SVG functions on `square-fill`, `circle-fill`, `square-fill-solid`, and `circle-fill-dashed`. Both plain-fill mismatches reproduced; bordered variants kept separate fill/stroke values and selected color changed only fill. These are function-level checks, not full DOM or browser tests.

The browser rejected opening the local file under its URL security policy. No alternate browser or URL workaround was attempted. Therefore toolbar artwork, real picker interactions, focus retention, drag/selection, export downloads, and final destination playback remain unverified.

## Proposed behavior for discussion, not implemented

Use one **Color** entry point that names the selected object and exposes only relevant properties: Text, Fill, Line/Border, and Highlight. Preserve separate fill and border choices when an item has both. For images, call the property Border color so it does not promise photo recoloring. Show a clear disabled state for unsupported targets and distinguish highlighted words from object selection.

Use one **Corners** group for supported items, while preserving the magnifier's actual shape choices. Share contextual **Text alignment** across text/cards/hotspots, retaining the Intro body-only override. Keep **Position on slide** and **Slide background** explicitly distinct.

Decisions needed before implementing consolidation: which independent title/body colors are wanted; whether colors apply to one or all selected items; whether color choices should also set defaults for newly created objects; and whether every hotspot state needs a PNG. These are user behavior decisions, not facts an audit can infer.
