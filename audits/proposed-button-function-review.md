# Proposed button functions — September 13, 2026

This is a source-based review of the current V2 builder and the supplied artwork. Your A/B/C order is preserved; no toolbar changes have been made. “Proposed” means behavior still needs implementation, not that it already works. Browser interaction and exported playback have not been verified in this review.

## Text shortcuts

Yes, the intended design can retain only **Add Text, Add Handwriting, Add Reversed Impact, and Add Impact**, removing C12–C14. However, the current builder does not reliably support saved word-level bold/italic/underline shortcuts. Its `safeWordHtml` preserves color and background color but strips bold/italic/underline markup. Native browser formatting can therefore disappear after a rerender or reload. Keyboard handlers, saved formatting, and both HTML exports must be updated together before removing those buttons.

The shortcuts should format the selected words inside the active text editor. Cmd/Ctrl+U should toggle the agreed underline on those words, using C10/C22/C23. Picking its color or thickness must retain the original text selection. Highlight must likewise affect only selected characters, with square corners and no extra horizontal padding. These are requirements, not verified existing behavior.

## Row A — creation, files, preview and export

| Position | Button | What it controls / audit note |
|---|---|---|
| A1 | Tutorial drafts / folders | Needs distinction: the current draft-image folder browser inserts assets; the current project selector saves and switches complete tutorial drafts. Those are separate operations. A dropdown may contain both, with explicit labels. |
| A2 | Add image annotation | Inserts a movable image over the slide; does not replace its background. GIF annotation insertion currently has its own route. Include GIF explicitly here if removing that separate route. |
| A3 | Add shape | Opens the artwork shape library. Separate from the geometric circle/square/line/arrow controls. No color controls are needed on the menu artwork. |
| A4 | Add audio annotation | Inserts interactive audio. Separate from slide narration and its timing. |
| A5 | Add video annotation | Opens the title popup and then chooses popup video media. Separate from a main video slide. |
| A6 | Add interactive link | Opens the link text/URL popup and adds clickable text. Player links open a new tab. |
| A7 | Filename says Add Blur | Artwork depicts a magnifying glass. Confirm this is Add Magnifier; do not wire it from its filename. Magnifier shape and zoom controls must remain accessible. |
| A8 | Filename says Add Burl | Droplet artwork; likely intended blur, but awaiting confirmation. |
| A9 | Blur strength | Changes selected blur block strength. Disable when no applicable blur is selected. It does not control ordinary object transparency. |
| A10 | Add hotspot | Adds a hotspot marker and its associated content slot. Current builder disables hotspot creation on main video slides. |
| A11 | Slide title popup | Intended to rename the slide and its menu entry together. The slide title and intro-card title are currently separate fields; this must not silently merge them. Confirm whether intro-card creation also belongs here. |
| A12 | Callout | Artwork exists although this entry is absent from your pasted list. Adds a callout with title/body. |
| A13 | Circle dropdown | Adds circle markup with selectable solid/dotted outline and filled variants. Main color should govern fill; independent stroke color governs border. |
| A14 | Square dropdown | Same separation as circles. Corner rounding needs an accessible control too. |
| A15 | Line dropdown | Adds line markup with available styles. A17 controls its main stroke under the proposed split. |
| A16 | Arrow dropdown | Adds arrow markup with available styles. Clarify whether “arrow outline” means its existing stroke or a new separate outer edge. |
| A17 | Line thickness | Proposed width for lines/arrows. This is separate from A18 in your list; earlier discussion proposed sharing width. Confirm this new split before wiring. |
| A18 | Outline/stroke thickness | Proposed circle/square/magnifier border width. Current magnifier border is fixed-width and needs modification. Independent border color is missing from the list. |
| A19 | Object transparency | Current control supports markup, not every object type. Broad selected-object opacity requires adding consistent rendering/export support. Keep separate from blur strength and transparent fill. |
| A20 | Preview | Current toolbar previews Video/Demo. If both player modes are needed, offer Video/Demo and Tutorial choices in its popup. |
| A21 | Tutorial name | Edits tutorial title and export metadata. Separate from the draft filename/project name and individual slide titles. Current title entry normalizes to uppercase. |
| A22 | Rename draft | Renames the saved project/draft, not its tutorial title or slide title. |
| A23 | Export video player | Current operation exports a Video/Demo HTML player, not an MP4 video file. |
| A24 | Export HTML player | Exports the interactive Tutorial HTML player. |
| A25 | Export images ZIP | Exports slide PNGs in a ZIP. Current output is one image per slide, not every hotspot state or original uploaded asset. |
| A26 | Save status / filename | Shows current draft and saving/saved/error state. Dropdown can show details, but saving errors should remain visible when closed. Keep an explicit save route or existing Cmd/Ctrl+S. |

## Row B — slides, backgrounds and arrangement

| Position | Button | What it controls / audit note |
|---|---|---|
| B1 | New default-background slide | Adds a NEW regular image slide with the configured default background and placement. Does not replace the current slide. |
| B2 | New blank image-format slide | Intended to add a blank regular slide without a picker. Current Add Image Slide opens a picker immediately, so this requires a behavior change. |
| B3 | Add/replace regular background | Chooses media for the current regular slide. Does not create a slide. Current replacement resets main-media placement/scale. |
| B4 | New scrolling slide | Adds a NEW scrolling-format slide. To match the separate B5, it should allow creation without forcing image selection; current creation opens a picker. |
| B5 | Add/replace scrolling background | Chooses the tall image for the current scrolling slide. Disable on incompatible slide types. |
| B6 | Slide duration override | Sets manual demo timing. Blank currently uses audio length or five seconds; main-video timing is a separate consideration. Include Clear/Automatic in the popup. |
| B7 | Background zoom out | Decreases main slide media scale, not selected annotation size or editor zoom. |
| B8 | Background zoom in | Increases main slide media scale. |
| B9 | Background left | Moves main slide media left. |
| B10 | Background up | Moves main slide media up. |
| B11 | Background down | Moves main slide media down. |
| B12 | Background right | Moves main slide media right. |
| B13 | Text left | Should route to the active text target: text annotation, card, or hotspot. Current hotspot and annotation alignment use separate handlers. Preserve the intro-card body-only override. |
| B14 | Text center | Same target routing, centers text inside its box. Does not move the box. |
| B15 | Objects left | Aligns eligible unlocked selected objects to the left. One object uses slide bounds; several use selection bounds. |
| B16 | Objects center | Horizontal object centering; distinct from text centering. |
| B17 | Objects middle | Vertical object centering. |
| B18 | Objects right | Aligns object right edges. |
| B19 | Objects top | Aligns object top edges. |
| B20 | Objects bottom | Aligns object bottom edges. |
| B21 | Distribution — confirm direction | Filename says horizontal; artwork shows stacked horizontal bars. Distribution needs at least three eligible unlocked objects. |
| B22 | Distribution — confirm direction | Filename also says horizontal; artwork shows side-by-side vertical bars. Keep both directions; confirm which position should invoke each. |

## Row C — selection, colors and text

| Position | Button | What it controls / audit note |
|---|---|---|
| C1 | Delete | Shared toolbar action handles selected hotspot or annotation. Hotspot deletion closes the list gap and renumbers later slots without moving remaining marker positions. Associated annotations are retained and detached. Current action deletes only the primary selected item, not all multiselection, and does not check lock. Keyboard Delete currently refuses hotspot deletion. |
| C2 | Lock/unlock | Toggles selected items. Lock is also tied to visibility persistence across hotspot steps; it is not merely a movement lock. Current deletion is not blocked by it. |
| C3 | Bring front | Moves selection to the front, not just one layer forward. Layer order also affects what a magnifier can see beneath it. |
| C4 | Send back | Moves selection to the back, not just one layer backward. |
| C5 | Group/ungroup | Groups eligible objects to move together. Separate from hotspot association and clipping. Use the same button to ungroup. |
| C6 | Clip | Places eligible selected content in a movable clip frame. Keep frame shape and release controls on the frame or in this popup. |
| C7 | Crop | Crops selected inserted image/GIF/shape. Current tool does not crop slide background or all annotation types. Include reset crop/corners access if removing the old Reset button. |
| C8 | Main color | Proposed selected-word text color or selected object's primary fill. Circle/square fill should use the same picker. Existing plain-filled markup has an inconsistent fill-color path that must be corrected. Stroke color must remain independently selectable. Image artwork should not be recolored by this action. |
| C9 | Highlight color | Selected words only. Popup should also offer Remove Highlight. It must not recolor the entire text box or apply to unselected words. |
| C10 | Underline color | Independent from text and highlight colors. Applies to the selected word underline. Include remove/toggle via shortcut and/or popup. Current saved word formatting does not support this yet. |
| C11 | Add regular text | Creates a new regular text annotation. |
| C12 | Add italic text | Can be removed after reliable selected-word keyboard formatting is implemented and verified through save/reload/export. Current button creates a new italic object; it does not format a word selection. |
| C13 | Add bold text | Same condition as C12. |
| C14 | Add underlined text | Same condition as C12; replacement shortcut must use the agreed selected-word underline behavior. |
| C15 | Add handwriting text | Creates a handwriting-style text annotation; keep. |
| C16 | Add reversed Impact text | Creates reversed Impact Label text; keep. Check whether its contrasting backing needs a separate color setting rather than assuming text color covers both. |
| C17 | Add Impact text | Creates Impact Label text; keep. |
| C18 | Text size | Treat as font size, not geometric object size. Current support covers text and intro/callout cards; hotspot and link text are not supported by that same control. Extending scope requires explicit wiring. |
| C19 | Fit text | Fits the selected text frame to content. Distinct from changing font size or centering. |
| C20 | Character spacing | Changes spacing between letters. Current handler covers text annotations, not every text-bearing element. |
| C21 | Line spacing | Changes text line height. Current handler covers text annotations. |
| C22 | Underline thickness | Proposed selected-word underline width. Independent from A17/A18 because a word can have an underline without an object border. Needs implementation and export persistence. |
| C23 | Underline offset | Proposed distance below selected words. Needs implementation and export persistence. |
| C24 | Shadow on/off | Current targets: inserted image/GIF/shape and geometric markup. It is not a universal text/card shadow button. |
| C25 | Shadow size | Current slider controls shadow elevation, not independent blur/spread/color. Preserve that meaning or explicitly define the changed effect. |

## Missing functions or decisions — no extra standalone buttons assumed

1. **Independent stroke/border color.** C8 fill plus A18 width is insufficient for a filled square with a differently colored border. Put a Border Color picker inside A18's popup if desired. Lines/arrows use stroke as their main visible color; define their relationship with C8 consistently.
2. **Corner rounding.** Existing image/GIF/shape/square rounding is absent. It can live in C7 or a relevant shape popup; removing the old controls without relocating it loses functionality.
3. **Magnifier settings.** Preserve shape, zoom, outline on/off, border color, and border width. These can be in A7's popup and on-object controls. Magnifier zoom is separate from B7/B8 background zoom.
4. **Background/matte color.** No proposed control clearly changes empty slide/background color independently of selected-object fill. It can live under B3/B5, provided the target is explicit.
5. **Intro-card creation.** A11 says slide title; this does not inherently replace Add Intro Card. Decide whether its popup also adds/selects an intro card.
6. **GIF insertion.** Keep through A2 with an explicit GIF route if the separate button disappears.
7. **Main video slides and replacing their media.** A5 popup video is different. If main video slides are still needed, preserve these commands in a slide/media popup.
8. **Scrolling viewport width.** Existing setting is missing; it can be part of B4/B5's popup.
9. **Solid cover blocks.** Existing cover-block insertion differs from a cover slide. A filled square may replace it only after its masking, selection, layer, and export behavior are checked.
10. **Dedicated cover-background commands.** Existing commands target the cover even while another slide is active. Decide whether that convenience is obsolete; B3 affects the current slide.
11. **Draft management.** Keep needed save/switch/new/copy/import actions reachable in A1/A22/A26 rather than accidentally removing them with the old More menu.
12. **Duplicate and undo.** Can remain keyboard actions; they do not require standalone buttons. Do not conflate Undo with deleting a selected object.

Controls that may need independent colors are **fill versus border, text versus highlight versus underline, background matte versus objects, and potentially reversed text backing versus glyphs**. Shadow color would be another independent color only if you want it adjustable; the current shadow control does not provide that feature.

## Confirmed artwork-path problem

The current `numberedToolbarArt()` still references `images/tutorial-annotations/builder-toolbar/new-toolbar/`, which does not exist locally. The current corner selector references `images/builder-toolbar-buttons/corners.png`, which is also absent. The new A/B/C artwork is present, but is not wired into the builder. This is a confirmed local asset-path issue; runtime loading has not been browser-tested. Wiring the agreed toolbar should address these references.

## Scope and next step

This review identifies functional requirements and gaps; it is not a claim that the proposed toolbar has been implemented or every export has passed testing. First resolve the ambiguous labels and the intentionally retired functions. Then implement in your existing order, retaining three scrolling rows and placing sliders/text fields inside popups. Existing source-level function inventories remain available in this audit folder for deeper dependencies.
