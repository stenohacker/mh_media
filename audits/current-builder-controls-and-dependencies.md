# Current V2 builder: controls, effects, and dependencies

This describes the CURRENT builder, not the proposed toolbar. Source: [tutorial-demo-builder-v2.html](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html). Only this builder is in scope. No builder code, saved project, or website was changed.

**Verification:** complete JavaScript syntax-tree inventory; source tracing of controls and their handlers; ten isolated behavior checks. Browser interaction, the named draft's live state, save/reopen, and downloaded export appearance have NOT been verified. The earlier browser local-file request was blocked by browser URL policy; no workaround was attempted. This document is a source audit, not a final release certificate.

Read this practical inventory first. The [function reference](/Users/tamchap/Dev/mh_media/audits/current-builder-function-reference.md) lists every named function declaration, its direct dependencies and assignments. The [complete callable register](/Users/tamchap/Dev/mh_media/audits/current-builder-callables.md) also includes arrow functions and anonymous callbacks. The [action wiring register](/Users/tamchap/Dev/mh_media/audits/current-builder-action-wiring.md) gives the exact handler for every dispatched button action.

**Terms used below**

- **Primary selection:** the last/current selected object, identified by `selectedKind` and `selectedId`.
- **Multiple selection:** the separate selection list. Some controls operate on this list; others operate only on the primary selection.
- **Active hotspot:** the hotspot currently governing text and annotation visibility. It need not be the primary selected object.
- **Commit:** ordinarily updates smart defaults, records an undo step, schedules saving, shows a message, and redraws. Live sliders/text may instead update styles and schedule saving before a later commit.
- **Annotation:** text, markup, image/GIF/library artwork, cover, blur, magnifier, clip frame, video/audio/link object. Hotspots are stored separately.

## Current toolbar row 1

| Control | What it does / target | Dependencies and important side effects |
|---|---|---|
| Send to back | Sends the selected object(s) behind other objects on this slide | Reassigns the slide's layer numbers, preserving order within selected/unselected sets. Includes hotspots and annotations. Not just one layer backward. Does not filter locked selections. `moveSelectedZ` |
| Bring to front | Sends selected object(s) above the others | Same full-layer reorder, in the opposite direction. Changes what a magnifier can see because it samples lower layers. `moveSelectedZ` |
| Lock / unlock | Sets lock on all selected objects; mixed selection becomes all locked | Prevents dragging/nudging/alignment of locked objects. ALSO affects persistence of hotspot/associated-annotation visibility as the tutorial advances. It is not a universal ban on edits or deletion. `toggleSelectedLock` |
| Group / ungroup | Groups selected annotations to move together | Uses `objectGroupId`; requires a valid annotation group. Does not assign a hotspot association. Clicking a group member can select the group. `toggleSelectedObjectGroup` |
| Duplicate selected | Copies selected hotspots/annotations on this slide | Fresh IDs, +2.5 position offset, top layers, unlocked copies; remaps selected hotspot/group/clip references. Does not automatically include every dependent item. Rejects selection containing an intro card. `duplicateSelectedItems` |
| Align left | One unlocked item: left edge of slide. Several: shared leftmost edge | Uses stored object dimensions, then bounds handling. Ignores locked items. Does not align text inside a box. `arrangeSelected` |
| Align horizontal center | One unlocked item: slide center. Several: center of their collective bounds | Multiple items are aligned to one another, not moved as an intact group to the page center. `arrangeSelected` |
| Align vertical middle | One unlocked item: page middle. Several: midpoint of collective vertical bounds | Tall scrolling page uses its page height. `arrangeSelected` |
| Align right | One unlocked item: slide right edge. Several: collective rightmost edge | Changes positions only. `arrangeSelected` |
| Align top | One unlocked item: page top. Several: collective topmost edge | Changes positions only. `arrangeSelected` |
| Align bottom | One unlocked item: page bottom. Several: collective bottommost edge | Uses scrolling page height where relevant. `arrangeSelected` |
| Distribute horizontally | Spaces at least three unlocked objects using calculated edge gaps | Changes x coordinates; uses total widths and outer bounds. Can calculate negative gaps if objects do not fit. `arrangeSelected` |
| Distribute vertically | Spaces at least three unlocked objects using calculated edge gaps | Changes y coordinates; uses heights. `arrangeSelected` |
| Add hotspot | Appends a numbered hotspot with empty body | Disabled on video slides. Assigns slot color, placement/size, layer; activates/selects it and stops annotation audio. Scroll placement includes viewport offset. `addHotspot` |
| Delete selected item/hotspot | Deletes ONLY the primary selected item | Hotspot: closes list gap, renumbers, keeps remaining marker coordinates, clears references from associated objects, chooses intro/first hotspot. Clip frame: releases members and keeps them. Group member: clears remaining singleton group. Intro: activates first hotspot. No dedicated second hotspot delete is necessary. `deleteSelected` |
| Hotspot text left | Left-aligns selected hotspot text, with active-hotspot fallback in handler | Changes `textAlign`, activates/selects that hotspot; does not move marker. Toolbar availability depends on hotspot context. `setHotspotTextAlign` |
| Hotspot text center | Centers the hotspot text | Same target and side effects. `setHotspotTextAlign` |
| Shapes menu | Adds chosen library artwork as an image-based shape | Loads hosted CSV with built-in fallback. Adds annotation, links to active hotspot, probes image dimensions for initial sizing. Does not create editable vector fill/stroke artwork. `renderShapeNavigation`, `loadShapes`, `addImageAnnotation` |
| Draft images menu | Adds chosen image/GIF from DRAFT-1 through DRAFT-5 | Reads local HTTP directory listings; inserts a public media URL. This menu is an asset library, NOT the named-project selector. `loadDraftImages`, `addImageAnnotation` |
| Tutorial/video name | Edits overall tutorial title, uppercased | Affects cover title and may update untouched smart metadata defaults. Separate from saved draft name and individual slide title. `onInput`, `onChange`, `applySmartDefaults` |
| Current draft selector | Opens a different named project | Attempts disk save first; stops switching if save fails. Changes project URL. Does not replace slide media. `openProject` |
| Save status | Reports pending/saved/error state | Display only; follows browser/disk save paths, not a separate save command. Error messaging caveat below. |
| Preview Video / Demo | Builds current demo player in preview modal | Uses HTML export builder; syncs live edits and attempts disk save, but does not download. Modal also offers tutorial preview. `previewDemo`, `buildExportHtml` |
| Export Video / Demo HTML | Downloads compact demo/video player HTML | Embeds current state/runtime and resets player selection/start state; external assets remain external. `exportHtml('demo')` |
| Export Tutorial HTML | Downloads full tutorial HTML | Same shared export builder, tutorial page mode/navigation/metadata. `exportHtml('tutorial')` |
| Export PNG ZIP | Captures each slide to one PNG and packages ZIP | Different renderer from HTML; initializes intro/first-hotspot state, not every hotspot state. Temporarily changes current slide/selection. See export details. `exportPng` |
| More | Opens draft operations | Save Editable Backup, Rename Draft, Reset Draft. These differ from Export HTML and Delete selected object. |

## Current toolbar row 2

| Control | What it does / target | Dependencies and important side effects |
|---|---|---|
| Selected words text color | Applies foreground color to remembered selected text range | Supports slide title/body and annotation text/intro/callout fields. Does NOT support hotspot title/body or overall tutorial title. Saves rich-text spans. No whole-object fallback. `applyWordColor`, `wordColorTarget` |
| Selected words highlight | Applies background color to the remembered selected range | Includes whatever characters/spaces were selected; no word-edge trimming. Keeps separate foreground color. Same field limitations. `applyWordColor` |
| No highlight | Sets selected range's background to transparent | Uses same remembered range; not a whole-card background reset. `applyWordColor` |
| Line menu | Adds dotted or solid line | New markup object with control points and stroke settings, associated with active hotspot. Does not restyle an existing line. `addMarkup` |
| Circle menu | Adds dotted, solid, filled, filled+solid-border, or filled+dashed-border circle | Separate stroke and fill fields; plain-filled defect below. `addMarkup` |
| Square menu | Adds equivalent square/rectangle variants | Supports adjustable corner radii. `addMarkup` |
| Arrow menu | Adds dotted or solid arrow | Curve/endpoints and arrowhead are rendered as SVG; arrowhead color derives from stroke color. `addMarkup`, `markupSvg` |
| Markup fill color | Changes primary markup `fillColor` and next-markup fill default | Effective for bordered filled shapes. Plain-filled shapes render a different field; unfilled lines ignore this fill. |
| Selected object color | Changes a different property according to primary object's type | Text → textColor; cover → fillColor; markup containing “fill” → fillColor; other markup → markupColor; intro/callout → title AND body color; images/library artwork etc. → frame outline; magnifier → border. Disabled for hotspots. Does not batch recolor selection. |
| Transparent inside object-color panel | Makes magnifier outline transparent | Available only for magnifier; not universal object/fill transparency. `appearanceColor='transparent'` |
| Round corners more | Increases square markup radius, or image/GIF/library-shape corner radius | Square internal increment is 1 on 0–43 scale. Image increment is 1 on 0–50 scale. Shared slider converts these scales differently. `adjustSelectedMarkupCornerRadius` |
| Round corners less | Decreases the same property | Same targets; not magnifier or clip-frame shape. |
| More markup weight | Increases primary markup stroke width by 1, capped at 10 | Does not affect magnifier border; no visible stroke on borderless Filled shapes. `adjustSelectedMarkupWidth` |
| Less markup weight | Decreases stroke width by 1, minimum 1 | Same target. |
| Less transparent (delta −5) | Lowers markup transparency by 5 percentage points | Increases object opacity; 10–100% opacity range. Applies to markup only. Artwork filename says “more-transparent”; handler/title identify actual direction. |
| More transparent (delta +5) | Raises markup transparency by 5 percentage points | Decreases opacity; does not independently fade fill versus border. |
| Add regular text | Creates new regular text annotation | Does not change selected words' font style. Uses text picker color, default dimensions, active hotspot association. `addText` |
| Add italic text | Creates new italic text annotation | Same creation behavior. |
| Add underlined text | Creates a new wholly underlined text annotation | Current CSS fixes thickness/offset; no selected-word underline or separate underline color UI. |
| Add bold text | Creates new bold text annotation | Same creation behavior. |
| Add handwriting text | Creates new handwriting-style annotation | Separate font style. |
| Add Impact Label text | Creates label-font annotation | Font loading/embedded fallback matters to export. |
| Add reversed Impact Label text | Creates reversed-label-font annotation | Separate reversed font. |
| Text color | Changes primary text annotation foreground | Also read when adding text. Does not change intro, callout, or hotspot text. Overlaps object-color picker for text. |
| Fit text frame | Fits text/intro/callout frame to its content | Marks manual frame state; not a font-size operation. `fitSelectedTextFrame` |
| Decrease character spacing | Reduces text annotation letter spacing by 0.5 | Text annotations only; not cards/hotspots. Clamp −2 to 12. |
| Increase character spacing | Increases letter spacing by 0.5 | Same target/clamp. |
| Decrease line height | Reduces text annotation line-height by 0.1 | Not card/hotspot body spacing. |
| Increase line height | Increases text annotation line-height by 0.1 | Same target. |
| Add intro card | Adds intro if absent; otherwise selects existing intro | Only one per slide. Intro is a separate initial visibility state before hotspots. `addSlideIntro` |
| Add callout | Creates standalone callout title/body card | Associates with active hotspot. Separate from hotspot text panel. `addCallout` |
| Smaller text/card text | Reduces textFontSize by 2 | Text, intro, callout; not hotspot. Card title/body scale together. |
| Larger text/card text | Increases textFontSize by 2 | Same target. |
| Text/card left | Left-aligns primary text, intro, or callout | Intro alignment clears Body-left override so body follows title. Not hotspot alignment in current toolbar. |
| Text/card center | Centers same targets | Does not move the text box. |
| Add uploaded audio annotation | Inserts independently clickable audio object | Uses media-folder picker/public URL; distinct from slide narration and its timing. |
| Add magnifier | Creates movable 2× rounded magnifier | Clones lower-layer scene, omits other magnifiers and interaction UI. Layer order matters. `addMagnifierAnnotation`, `syncMagnifierScenes` |
| Magnifier shape | Sets square, rounded, or circular viewport | Circle also adjusts width/height ratio; does not use ordinary corner-radius property. |
| Clip | Creates/selects frame or adds selected annotations to an existing frame | Excludes hotspot, intro, magnifier membership; members remain individually editable. Frame has separate shape/release controls on canvas. `createOrSelectClipFrame` |

## Current toolbar row 3

| Control | What it does / target | Dependencies and important side effects |
|---|---|---|
| C BKGRND | Replaces COVER slide media via file picker | Targets cover even when another slide is current. Resets media positioning/scale through linking. No new slide. `replaceCoverBackground` |
| D COVER | Restores cover's default background and placement | Uses 195% scale, x −3, y 15, white matte; does not add slide. `applyDefaultCoverBackground` |
| Add default background | Inserts a NEW default-background image slide after current | Selects it; clears selection. Not “reset current background.” `applyDefaultBackground` |
| Add/replace background image | Replaces current slide's main image/GIF | SAME `replace-slide-image` action as ordinary and scrolling replacement buttons. |
| Background color | Changes current slide matte | Does not recolor main image or object fills. |
| Add cover block | Adds solid rectangular overlay | Uses cover-color picker; active-hotspot association. Different from the cover slide. |
| Cover color | Changes primary cover-block fill | Read for newly added cover blocks; overlaps selected object color. |
| Add blur | Creates blur overlay | Uses stored blur default; active-hotspot association. |
| Stronger blur | Increases blur by 1 up to 30 | If a blur is selected, edits it AND next-blur default. Otherwise changes next-blur default only. |
| Weaker blur | Decreases blur by 1 down to 1 | Same target/default behavior. |
| Add image slide | Inserts blank image slide then opens picker | Picker cancellation leaves newly inserted slide. `addSlide` |
| Add video slide | Inserts video slide then opens picker | Video slides have different playback and no new hotspot creation. |
| Add scrolling slide | Inserts scrolling slide then opens image picker | Separate viewport, page-height, fixed-header, and hotspot-in-view behavior. |
| Scroll viewport width | Changes visible scrolling viewport width | Scroll slides only in toolbar; does not resize image annotations. |
| Replace slide image | Replaces main image/GIF of current slide | Resets main-media position/scale/dimensions. Does not replace a selected overlay image. |
| Replace slide video | Replaces main media with video | Linking may change non-cover slide kind to video. |
| Replace scrolling slide image | Same image-replacement action | Enabled only for scroll slides. |
| Manual duration | Overrides slide playback duration | Blank → narration-based timing if audio exists, otherwise default. Recomputes timing mode; distinct from popup audio. |
| Zoom main media in | Increases main-media scale by 0.05 | Targets main background/media, not selected object or browser zoom. |
| Zoom main media out | Decreases main-media scale by 0.05 | Same target. |
| Move main media left | Decreases media x by 1 | Clamped; separate from object alignment/nudging. |
| Move main media right | Increases media x by 1 | Same target. |
| Move main media up | Decreases media y by 1 | Same target. |
| Move main media down | Increases media y by 1 | Same target. |
| Insert uploaded GIF | Adds overlay GIF, not new slide | Active-hotspot association; natural image sizing; hosted URL. |
| Insert uploaded image | Adds overlay image, not new slide | Same relationship. |
| Crop selected image/shape | Toggles crop editing for image/GIF/library shape | Converts/uses crop window; dragging pans source, handles alter crop; not main-media crop. |
| Shadow toggle | Toggles primary annotation shadow | Helper currently accepts any annotation, broader than tooltip. Magnifier's separate markup may not consume same filter; needs visual check. |
| Shadow elevation | Changes shadowHeight 0–40 and toggles shadow on when >0 | Live CSS update and save; not limited to images by underlying handler. |
| Outline | Toggles magnifier border on/off | Currently magnifier only; width fixed to 3 in appearance renderer. |
| Corner preset | Sets image/GIF/library-shape corners or square-markup rounding | Square/soft/rounded/circle values; square markup uses 0–43 internal scale converted from 0–50 UI. Label “Circle” does not guarantee a perfect circle for rectangular geometry. |
| Corner slider | Continuous rounding for same objects | Live update, save, then undo record on change. Doesn't set magnifier/clip-frame shape. |
| Reset image | Clears selected image/GIF/library-shape crop and corner settings | Does not clear shadow, color, rotation, size, or main-media positioning. |
| Insert link | Creates link annotation from URL field | Does not open destination immediately. URL field Enter also inserts it. |
| Link URL | Temporary next-link URL | Not an editor for selected existing link's URL. |
| Add popup video | Inserts video annotation from picker | Uses title field; not main video slide. |
| Popup video title | Temporary title for next inserted popup video | Not an editor for selected existing video's title. Cleared after successful picker insertion. |

## Controls outside the three toolbar rows

| Location / control | Action and dependencies |
|---|---|
| Hotspot title/body | Direct editing updates selected hotspot fields; custom title disables auto-title numbering. Plain text/list support. Rich word-color support is missing for these bindings. |
| Hotspot row up / down | Swaps title, body, autoTitle with adjacent slot; DOES NOT move marker IDs, geometry, color slots, groups, locks, or popup geometry. Selected/active hotspot becomes destination slot. Separate from deleting a hotspot. |
| Hotspot marker/title click | Selects or activates it; active hotspot controls visible associated annotations. Scroll mode has special expansion behavior. |
| Slide title/body | Edits slide fields, rich color/highlight supported; affects sidebar and preview/metadata depending on field. |
| Intro title/body and callout title/body | Edits respective annotation fields; rich spans stored separately from plain text; redraw synchronizes live edits first. |
| Overall cover title | Edits uppercased tutorial title; not included in word-color binding whitelist. |
| Pipe / Numbered on slide, hotspot, intro, callout bodies | Toggles current/selected mixed-body lines; preserves selection/caret using separate remembered line selection. Paragraph/list serialization determines export. |
| Intro Title only | Hides body but retains body data; changes visible card content. |
| Intro Body left | Toggles independent left-aligned body; turning off returns body to title alignment. Main intro alignment resets this override. |
| Object move/resize/rotate handles | Edit geometry; type-specific rules, locks, group movement, clip membership, crop state, and bounds influence results. Text requires move handle rather than ordinary text-body drag. |
| Arrow/line start/curve/end handles | Change saved SVG curve points; not whole-object movement. |
| Flip handle | Flips Shapes-menu image artwork horizontally; distinct from rotation. |
| Hotspot text-panel drag/resize | Saves popupX/Y/W/H for hotspot text box; does not move its marker. |
| Magnifier − / + on object | Changes magnification 1.25×–4×; separate from viewport size and main-media zoom. |
| Clip frame Straight / Rounded | Changes clip viewport shape; separate property from ordinary corner radius. |
| Clip frame Release | Removes frame, clears members' clipFrameId, selects released objects. Preserves member contents. |
| Crop-out / crop-in actions in source | Zoom source within crop where exposed; separate from main-media zoom. See action register for source locations/reachability. |
| Narration controls | Add/change slide audio; preview play/pause; remove narration; audio timing is recalculated. Independent of interactive audio annotations. |
| Frozen scroll header height | Changes scroll header region where rendered; separate from fixed browser URL/GPT name header. |
| Browser URL / GPT name fields | Edit cosmetic browser-header fields on slide; not actual navigation. |
| Back / Next reader controls | Move among intro/hotspot states and slides; different branch for timed demo playback. |
| Menu / contents | Opens slide thumbnails; clicking a card jumps slide. In demo, remembers playback state to resume after menu. |
| Page name / Save Name in contents | Edits individual non-cover slide title; blank restores default name. |
| Duplicate Page | Copies slide with new slide/hotspot/annotation/group IDs and remapped clip relationships. Cover excluded. |
| Move Earlier / Later | Reorders non-cover slides, preserving their content. Cannot move through cover position. |
| Delete Page | Confirms, removes whole non-cover slide and its contained objects, closes slide-list gap, keeps next editable slide current when possible. Distinct from Delete selected. |
| Preview mode buttons / close | Switch Demo versus Tutorial iframe preview; close restores toolbar focus. Same HTML builder as export. |
| Popup video controls | Play/pause, restart, timeline, close. Direct media and YouTube have different rendering/runtime paths. Close resets modal state. |
| Main video controls | Play/pause, timeline/time display; demo has sound gate/mute controls and special looping behavior. |
| Interactive audio object | Play/pause and seek use dedicated audio instance and timeline. Rewind handler exists but has no literal current button attribute. |
| Link annotation activation | Opens URL in new tab; in builder uses double-click path. |
| Project chooser New / Open / Copy / Delete | Operates entire named projects through local server API; Delete has confirmation. Different from slide/object actions. |
| Draft-name dialog Confirm / Cancel | Creates/duplicates/renames project depending on mode; Enter confirms, Escape cancels. |
| More: Save Editable Backup | Saves current draft then downloads editable HTML with embedded project state. Can still export backup if save unavailable. |
| More: Rename Draft | Renames project record; does not rename builder URL/file or tutorial title. |
| More: Reset Draft | Confirmation then resets current project/browser state to starter data; not a selected-object reset. |
| Connect Media Website Folder | Requests directory access and remembers handle in IndexedDB. Needed for file picker resolution/copying. |
| Select Existing Website File | Links a file inside connected root as main media via public URL. Does not copy, rename, or publish it. |
| Copy New File / drop zone | Copies a new file into tutorials/folder with safe unique name, links public URL; does not publish media. |
| Media tutorial folder | Changes default media destination/base URL and untouched URL seeds; does not move existing files. |
| Metadata and social sharing | Edits page type, learning section, group, card title/order/summary, modal description, primary action, related callout, social title/description/image/alt/public URL. Saved metadata feeds exports/links; does not itself publish or edit external website catalog. |
| Copy Share Link | Copies computed public URL; does not create/upload a page. |
| Site header navigation / tools / mobile menu | Opens links/toggles site menu in player modes. Store action displays coming-soon message. Not authoring controls. |

## Keyboard and selection behavior

| Input | Actual behavior |
|---|---|
| Shift-click object | Adds/toggles object in multiple selection; group expansion can affect selection. |
| Cmd/Ctrl+S | Saves browser state and queues disk save if applicable; message is not proof disk request finished. |
| Cmd/Ctrl+Z | Undo content/meta snapshot, up to 50 saved steps. No equivalent redo handler found. |
| Cmd/Ctrl+D | Duplicates selection when not typing. |
| Cmd+C / Cmd+V outside text fields | Copies/pastes objects through builder's in-memory clipboard; not portable external clipboard. Paste remaps IDs/groups and checks video/intro restrictions. |
| Cmd/Ctrl+Shift+C / V | Copies/pastes format properties of text or markup. Paste applies to matching annotation types. Not complete object appearance or rich-word formatting. |
| Ctrl+G / Ctrl+Shift+G | Group / ungroup annotations outside typing fields. |
| Ctrl+L / M / P / H / C | Object left / middle / vertical distribution / horizontal distribution / center. |
| Arrow keys / Shift+arrows | Nudge unlocked selected objects by 0.5 / 2 units when not typing. |
| Ctrl+minus/plus | Selected text size; Shift modifies line height; Alt modifies character spacing. |
| [ / ] | Send back/front; handler also intercepts these while typing inside a selected stage object. Potential conflict with entering literal brackets. |
| Delete / Backspace | Deletes primary selected annotation when not typing. Refuses hotspot deletion and says to use hotspot delete button—the existing shared toolbar button provides that path. |
| Enter in mixed body | Splits line preserving list type; empty list line becomes plain. |
| Enter / Escape in link field | Insert link / clear next-link entry. |
| Escape | Closes active dialog/preview/video/menu; embedded player can post close request to parent. |
| Tab in modal | Focus-wrap logic for visible interactive controls. Browser behavior untested. |
| Menu arrows/typeahead | Navigate shapes/draft asset menus; letter matching and Escape handled separately. |

## What the builder does behind the controls

| System | Functions and effects |
|---|---|
| Startup/modes | Reads builder/player flags and project URL; loads embedded, browser, or server state; normalizes; starts rendering and listeners. Player does not use builder autosave path. |
| Data normalization | Supplies defaults and clamps dimensions/colors/styles; normalizes slide kinds, hotspot slots, markup variants/points, annotation relationships, rich formatting and media. Loading itself can normalize older data. |
| Selection | Maintains primary selection, multiple selection, active hotspot, object groups, and clip membership separately. Different controls consume different selections. |
| Rendering | Rebuilds app HTML from state; syncs live editing first; independently renders stage, sidebar, thumbnails, preview and media controls. DOM rebuild affects focus and picker handling. |
| Geometry | Converts page percentages, scrolling height, cropping and rotation; bounds fitting; SVG arrowhead geometry is adjusted to actual rendered size. |
| Visibility | Intro state suppresses hotspots. Active hotspot and locks decide associated-object persistence. Scroll slides show markers and choose an in-view hotspot. Video slides bypass ordinary association visibility. |
| Grouping | objectGroupId = move-together grouping; hotspotGroupId = appearance tied to hotspot; clipFrameId = clipping membership. These are NOT interchangeable. |
| Text persistence | Plain text and rich span HTML are separate fields; saved formatting is used only when its text matches current plain text. Allowed rich styles currently only foreground/background color. |
| Save/undo | 180ms debounced browser save, serialized disk PUT requests, save status, content/meta undo snapshots, explicit editable backup. Selection/UI state handled differently from undo content. |
| File/media linkage | IndexedDB folder handles, permission checks, file-type validation, safe names, public URLs, directory listing and asset catalog loading. Main-media replacement resets its transform and can change slide kind. |
| Timed demo | Manual duration overrides narration/default timing. Narration end schedules advance delay; failures fall back to timer. Main video has separate playback/loop path. Pause/resume/seek/restart manage timers/audio and progress. |
| Tutorial navigation | Advances intro/hotspots/slides, opens contents, jumps slides, maintains focus and media state. Different from demo autoplay progression. |
| Video/audio | Direct video versus YouTube, modal sizing, timelines, narration preview versus interactive audio versus demo narration, sound priming/gating, load/error handlers. |
| Magnifier | Clones only scene layers below lens; strips interaction UI and other lenses, mutes cloned media. Appearance depends on stacking. |
| Scroll | Maintains viewport position per slide, frozen header, full image height and automatic hotspot expansion when sufficient marker area is in view. |
| Metadata | Computes public URL/default slug/card fields, head tags, canonical/social preview, primary/related links. Does not publish or update another repository. |
| HTML export | Clones current document and state, selects player mode, clears authoring selection, replaces embedded state, updates fonts/metadata, removes PNG runtime, downloads standalone HTML. |
| PNG export | Uses html2canvas on stage for each slide, extends scroll capture, packs images into stored ZIP with CRC/headers. Interactive states are reduced to one capture per slide. |
| Accessibility/feedback | Labels, focus restoration/trapping, keyboard menus, attention effects, reduced-motion paths and toast/status messages. Requires browser verification. |

## Findings that must constrain consolidation

1. **Shared Delete is appropriate, but only deletes the primary item.** Ten isolated checks include middle-hotspot removal: the list closes up and remaining hotspots renumber while coordinates stay unchanged. Associated annotations are kept and detached; that can make them visible outside their former hotspot state. Delete does not check lock state.
2. **Hotspot up/down moves content, not the entire hotspot object.** Future word formatting must move with title/body when support is added; the current swap explicitly moves only title/body/autoTitle.
3. **Lock changes visibility as well as movement.** Do not replace its handler with a generic geometry lock.
4. **Filled-shape recoloring mismatch:** plain Filled square/circle draws markupColor, whereas Selected object color writes fillColor. Bordered-filled variants use both fields but visible toolbar lacks their separate stroke-color input.
5. **Word-selection support is incomplete.** Hotspot fields and tutorial title are outside whitelist. Remembered word selection is not cleared merely because selection collapses or another object is clicked, so a stale target can remain eligible.
6. **Selected-word underline is not implemented.** Existing button creates wholly underlined text; rich-text sanitizer retains only color/background-color. New underline styling needs deliberate saved representation and export support.
7. **Magnifier border thickness is fixed.** Current markup-weight buttons affect markup only; shared thickness requires new wiring and saved border width.
8. **Blur strength has a creation-default side effect.** Without a selected blur it changes the next blur, unlike most selected-object controls. Preserve or deliberately change that behavior.
9. **Shape image coloring currently adds outlines.** Removing that capability is an agreed proposed change, not current behavior. Ordinary image corners/crop/shadow remain independent.
10. **Thumbnails have their own rendering path.** Rich word spans and some newer appearance styles are not faithfully reproduced there. Matching stage and HTML player alone is insufficient for thumbnail parity.
11. **Save status can overstate browser-backup availability.** Disk-save catch/status strings say a browser copy is available even if earlier localStorage writing failed. Source finding; failure scenario not browser-tested.
12. **Exports use different paths.** PNG does not run an exported player. Its image/video inlining helper is defined but has no call site in current runtime. Its cleanup does not automatically remove every builder-only control. Visual checks remain required.
13. **Asset-picker fallback mismatch:** when picker APIs are unavailable, annotation fallback calls `activateToolbarAnnotationUrl(type)`, but that function immediately returns unless type is link. The message promising image/audio/video URL entry does not match that fallback implementation.
14. **Some old controls are source-only.** Legacy toolbar and several handlers remain, but `render()` uses `renderToolbar`, not `renderLegacyToolbar`. Handler existence is not proof a current visible button exists.

## Export and persistence verification boundary

| Output/path | Source-confirmed behavior | Still needs real verification |
|---|---|---|
| Named draft save | Browser backup plus queued project API PUT | API success/failure, reload same named project, browser backup recovery |
| Editable HTML backup | Embeds current project data and builder runtime | Open at intended URL; verify rich text, groups, references and assets |
| Demo HTML | Shared export renderer, demo/player flags, external media/fonts | Open downloaded file, play/seek/audio/video/hotspots, inspect all appearance changes |
| Tutorial HTML | Shared renderer, tutorial navigation/site links and metadata | Open at intended destination; test reader navigation/links and all objects |
| PNG ZIP | One file per slide, full-scroll capture branch, ZIP packaging | Inspect every PNG; shadows/blur/clipping/video/media/font loading and unwanted authoring UI |
| Existing previously exported HTML | Independent runtime, unchanged by builder edits | Regenerate only intended deliverables after fixes |

**No exports were downloaded, no live draft was modified, and nothing was published during this audit.** The detailed callable/action registers are source evidence, not claims that every path has been exercised.

## Source-only / indirect controls

`renderLegacyToolbar`, `renderDeviceFrame`, `renderBrowserHeader`, `formatDemoTime`, and `inlinePngExportImages` have no other identifier occurrences in this snapshot beyond their declarations. Do not count their output/helper behavior as a currently reachable UI feature.

Some actions use dynamic markup and are reachable even without a literal action attribute: body Pipe/Numbered controls are an example. Other handlers, such as legacy hotspot-up/down and crop-in/out, require reachability checks before being advertised. The action register explicitly separates handler presence from button presence.

## Isolated checks performed

Ten checks executed extracted original functions against synthetic slide/object data. Browser rendering, commit/save callbacks and media services were replaced with test doubles; geometry bounds fitting used the original function. These validate the specific data operations, not the whole application.

1. Delete middle hotspot: gap closed, automatic title renumbered, remaining marker coordinates preserved.
2. Delete hotspot: custom title preserved, associated annotation retained and detached.
3. Delete multiple selection: only primary selected object removed.
4. Delete clip frame: member retained and released.
5. Hotspot move down: title/body swapped while marker ID/position remained in slot.
6. Single object center: x became slide center.
7. Multiple object center: x became center of selection bounds.
8. Locked object excluded from alignment.
9. Locked earlier associated annotation persisted when later hotspot became active.
10. Plain-filled-square color defect reproduced: fillColor changed but SVG still used markupColor.

All ten checks matched the current behavior, including the known defect. Their results are saved in [behavior-checks JSON](/Users/tamchap/Dev/mh_media/audits/current-builder-behavior-checks.json). A passing defect-reproduction check does NOT mean that feature is correct.
