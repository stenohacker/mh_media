# Updated function map — renamed artwork, September 13, 2026

This is the agreed planning map. For subsequent implementation and verification status, see [the implementation audit](toolbar-fonts-implementation-audit.md). Supersedes earlier button positions. Uses the current files directly from `images/builder-toolbar-buttons`.

## Confirmed behavior

- New regular and scrolling slides each receive the same default background automatically, without opening an image picker. Replacement/removal belongs to each slide type’s background menu. The forthcoming image and its zoom/placement are deferred.
- Preserve three scrolling toolbar rows and the supplied ordering. Combined controls open popups.
- Every color selector uses the supplied ten-swatch circular palette plus custom-color control. Exact palette values must come from the supplied artwork or approved values, not approximated names.
- Keep four text creation choices. Cmd/Ctrl+B, I, U must format selected words and survive save/reload and both HTML exports. Highlight and underline retain the selected range when a popup opens.

## File-to-function map

| File | Intended function / dependency |
|---|---|
| A1-tutorial-drafts-folder-files-select-dropdown.png | Open draft/asset folders; keep whole-project switching distinct from inserting a folder image. |
| A2-add-image-annotation.png | Insert movable image annotation; include an explicit GIF option if keeping GIF support. |
| A3-add-shape.png | Open shape artwork library. |
| A4-add-audio-annotation.png | Insert interactive audio annotation; separate from slide narration. |
| A5-add-video-annotation.png | Open video-title popup, then select popup video. |
| A6-add-interactive-link-opens-new-tab.png | Open link text/URL popup; exported link opens a new tab. |
| A7-add-magnify-dropdown-select-shape.png | Add magnifier using a shape dropdown. Its border color and width use A18; magnification remains separate. |
| A8-add-blur.png | Insert blur block. |
| A9-blur-strength-slider-dropdown-alider.png | Adjust selected blur strength. |
| A10-add-hotspot.png | Add hotspot and its content slot. |
| A11-slide-title-persistent annotation-note-requires-menu-popup-renaming-and-sync.png | Create/select persistent slide-title annotation and edit its title through a popup; synchronize the menu label. This is new behavior to wire explicitly, not the current independent intro-card title. |
| A12-callout.png | Add callout title/body annotation. |
| A13-add-cirlce-annotation-dropdown.png | Add circle with selected outline/fill style. |
| A14-add-square-annotation-dropdown.png | Add square with selected outline/fill style. |
| A15-add-line-annoation-dropdown.png | Add line with selected style. |
| A16-add-arrow-annotation-dropdown.png | Add arrow with selected style. |
| a17-line-thickeness-dropdown-slider-for-circle-square-arrow-line.png | Main stroke thickness for circles, squares, arrows, and lines. Independent from the outer outline width in A18. |
| A18-outlinestroke-thickness-and-color-slider-dropdown-arrowssquarecirclesquaremagifier.png | Outer outline color and thickness around the main stroke of circles, squares, arrows, and lines, allowing dual colors. For a magnifier, controls its border color and thickness. Separate saved properties and rendering are required; this is not a second editor for A17. |
| A19-corners.png | Adjust supported selected-object corners. |
| a20-add-shadow.png | Toggle supported selected-object shadow. |
| a21-shadow-size-slider-dropdown.png | Adjust shadow elevation/size. |
| A22-export-video-player.png | Export Video/Demo HTML player; this is not an MP4 export. |
| A23-export-html-player.png | Export interactive Tutorial HTML player. |
| A24-export-all-images-in-zip-file.png | Export slide PNGs in ZIP; current behavior is one image per slide. |
| Ab23-save-status-with-tutorial-name-shows-in-dropdown.png | Save status and tutorial-name dropdown. Filename prefix Ab23 has no unambiguous row/position; preserve until placement is specified. Keep project/draft identity distinct from tutorial title and expose saving errors. |
| B1-add-new-regular-slide-with-default-bkgrnd.png | Create regular slide immediately with shared default background; no forced picker. New asset and placement deferred. |
| B2-replace-slide-background.png | Replace regular slide background; include Remove Background. Do not add another slide. |
| B3-add-new-scrolling-slide-with-default-background.png | Create scrolling slide immediately with shared default background; no forced picker. New asset and placement deferred. |
| B4-replace-background-scrolling-slide.png | Replace scrolling slide background; include Remove Background. Keep scrolling format. |
| B5-time-override-for-5-second-default-slide-timing-for-only-video-player-exports.png | Override default timing for Video/Demo playback/export only. Include reset to automatic; current automatic timing can use narration duration. |
| B6-zoom-out-background.png | Zoom main background out. |
| B7-zoom-in-background.png | Zoom main background in. |
| B8-shift-background-left.png | Move background left. |
| B9-shift-background-up.png | Move background up. |
| B10-shift-background-down.png | Move background down. |
| B11-shift-background-right.png | Move background right. |
| B12-text-align-text-left.png | Left-align active text target, including hotspot/card/text where supported; preserve body-only override. |
| B13-text-align-text-center.png | Center active text within its frame; not object position. |
| B14-align-objects-left.png | Align selected objects left. |
| B15-align-objects-center.png | Center selected objects horizontally. |
| B16-align-objects-middle.png | Center selected objects vertically. |
| B17-align-objects-right.png | Align selected objects right. |
| B18-align-objects-top.png | Align selected objects top. |
| B19-align-objects-bottom.png | Align selected objects bottom. |
| B20-distribute-horizontally.png | Distribute at least three eligible objects horizontally. |
| B21-distribute-vertically.png | Distribute at least three eligible objects vertically. |
| B22-preview.png | Preview; provide both player modes if retained. |
| C1-delete.png | Delete primary selected object/hotspot using existing hotspot list cleanup. Does not currently delete every multiselected item. |
| c2-lock.png | Lock/unlock; existing lock also affects hotspot visibility persistence. |
| c3-bring-object-front.png | Bring selection to front. |
| c4-send-object-back.png | Send selection to back. |
| c5-group.png | Group/ungroup movement; distinct from hotspot association. |
| c6-clip.png | Clip selection in frame; preserve release/frame controls. |
| C7-crop-tool.png | Crop supported inserted image/GIF/shape. |
| c8-reset-crop.png | Reset crop. Filename specifies crop only; do not also reset corners without agreement. |
| c9-main-color-selector-dropdown.png | Main selected text/word color or object fill; preserve independent border color. |
| c10-highlight-color-selector-dropdown.png | Highlight explicitly selected words, square corners; include Remove Highlight. |
| c11--underline-color-selector-dropdown.png | Underline color for explicitly selected words, independent of text color. |
| c12-background-fill.png | Background fill picker. Confirm target: slide matte versus text/object backing; do not conflate with C9 object fill. |
| c13-object-transparency-slider-dropdown.png | Selected-object opacity; current implementation needs expansion beyond markup. |
| c14-add-text-annotation.png | Add regular text. |
| c15-add-handwriting-text-annotation.png | Add handwriting text. |
| c16-add-reversed-impact-text-annotation.png | Add reversed Impact Label text. |
| c17-add-impact-text-annotation.png | Add Impact Label text. |
| c18-size-size-slider-dropdown.png | Font-size slider for applicable text targets. |
| c19-fit-text.png | Fit text frame to its content. |
| c20-line-and-text-spacing-dropdown-sliders.png | One popup, two separate sliders: character spacing and line spacing. |
| c21-underline-thickness-and-spacing-sliders.png | One popup, two sliders: selected-word underline thickness and offset below text. |

## Unresolved filename/behavior details

- A7 is now present: `A7-add-magnify-dropdown-select-shape.png`. Shape selection belongs here; magnifier border color and thickness belong in A18. No separate magnifier thickness button is needed.
- Confirmed: A17 is main stroke thickness. A18 is a distinct outer outline with independent color and width, for dual-color strokes. Preserve circle/square interior fill independently too. A18 must provide an outline-off/zero-width state. This requires additional rendering and export support; it is not implemented yet.
- `Ab23-save-status-with-tutorial-name-shows-in-dropdown.png` needs a row/position. No separate tutorial-name or draft-rename artwork remains; these commands can be dropdown entries.
- C12 background fill needs a precise target. A slide background color and a text backing/highlight are independent properties.
- Scrolling viewport width and GIF insertion still need a menu home if retained. They do not require extra standalone buttons.

## Font and formatting export requirements

| Font/feature | Current source finding | Required outcome |
|---|---|---|
| Hanken Grotesk normal/bold | Local normal variable-weight font exists; export references local-root and website URLs | Preserve actual font and weight in portable exports |
| Hanken Grotesk italic | Local italic variable-weight font exists; export references URLs | Preserve italic face and selected-word styling |
| Impact Label | Embedded font fallback already present | Preserve embedded font and avoid overriding its family |
| Impact Label Reversed | Embedded font fallback already present | Preserve reversed face and avoid overriding its family |
| Handwriting: Shadows Into Light Two | Loaded from Google Fonts; no local copy in builder fonts folder | Include dependable font data in export, not rely solely on external stylesheet |
| Word bold/italic/underline | Current safeWordHtml strips these formats | Add persisted word formatting, keyboard actions, and matching renderers |
| PNG ZIP | Raster output, not an editable-font container | Wait for required fonts before rendering; preserve appearance |

Validation must cover mixed selected words, untouched adjacent words, all four text styles, save/reopen, both HTML player exports, and PNG rendering. Font fallback must not be mistaken for a successful test. None of these new guarantees are marked complete yet.
