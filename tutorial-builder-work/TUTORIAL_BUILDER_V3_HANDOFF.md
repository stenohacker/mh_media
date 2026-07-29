# Tutorial Builder v3 — Working Handoff and Completion Checklist

Last updated: 2026-07-28

This file is the source of truth for finishing Tutorial Builder v3. Check an
item only after the behavior exists and has been tested. Do not add features
that are not listed here without confirming them with Tamara first.

## 1. Non-negotiable project rules

- [x] Build v3 as a new file; do not overwrite the current builder.
- [x] Preserve the current builder and the user's existing tutorial files.
- [x] Reuse proven behavior from the current builder where it matches this list.
- [x] Do not carry over extra controls merely because the current builder has them.
- [x] Ask before implementing anything whose meaning is unclear.
- [x] Treat the annotated builder images as the permission boundary for visible features.
- [x] A conventional or accessibility-oriented implementation detail is not permission to add a new visible control.
- [ ] Audit every visible v3 control against the annotated images before calling the layout complete.
- [ ] Put any necessary-but-unshown control on a user-approval list before retaining it.
- [x] Keep the Learn/index-card redesign out of this build.
- [x] Create `tutorial-builder-v3.html`.
- [x] Keep this checklist updated as implementation and testing progress.

## 2. Approved reference images

- [x] `Group 11605.png`: annotated-image slide layout.
- [x] `Group 11604.png`: video slide layout.
- [x] `Frame 2-1.png`: builder controls and overall arrangement.
- [x] `Group 11638.png`: toolbar symbols and permanent Contents navigation.
- [x] Contents modal screenshot: exact Contents behavior and visual direction.
- [x] Alignment in the annotated composites is conceptual; use clean alignment in v3.

## 3. File and autosave behavior

- [x] v3 opens and works as a single HTML builder file.
- [x] Duplicating/renaming the builder file creates an independent tutorial workspace.
- [x] Each duplicated builder autosaves without overwriting another builder's draft.
- [x] Do not add a visible Save Builder Copy button; browser autosave is the approved behavior.
- [x] Reset Builder requires confirmation and does not affect other builder files.
- [x] No existing tutorial or builder file is silently overwritten.

## 4. Simplified URL-only media model

Local media root:

`/Users/tamchap/Dev/mh_media/tutorials`

Public media root:

`https://iridescent-wisp-57bcb1.netlify.app/tutorials/`

Required structure:

```text
tutorials/
  tutorial-name/
    cover.png
    slide-image.png
    demonstration.mp4
    explanation.mp3
    animation.gif
```

- [x] Tutorial main images and GIFs may use direct Imgur URLs; the builder must preserve those URLs exactly.
- [x] Main videos and interactive audio/video may use the media website; the builder must preserve the exact path Tamara enters.
- [x] The visible media-root seed is only an editable convenience and never authorizes rewriting a pasted URL.
- [x] Local tutorial folders may organize copies of images without changing the hosted URL saved in the tutorial.
- [x] Do not automatically move or correct media paths between `/tutorials/`, `/audio/`, `/video/`, or any other folder.
- [x] One folder level below `tutorials`; no topic folder in the hosted media path.
- [x] Remove the tutorial-folder attachment/picker control.
- [x] Remove the individual file attachment/picker control.
- [x] Remove the folder-file selector.
- [x] The builder contains no `input[type="file"]`, directory picker, or attach action.
- [x] Main media and annotations are connected only through editable public URLs.
- [x] Main-media URL inputs visibly start with the editable public media root.
- [x] Image-annotation URL inputs visibly start with the editable public media root.
- [x] GIF-annotation URL inputs visibly start with the editable public media root.
- [x] Video-annotation URL inputs visibly start with the editable public media root.
- [x] Audio-annotation URL inputs visibly start with the editable public media root.
- [x] Directly pasted public URLs remain editable.
- [x] Hosted images preview in the builder.
- [x] Hosted GIFs animate in the builder.
- [x] Hosted audio plays in the builder.
- [x] Hosted video plays in the builder.
- [x] Media-site CORS and cross-origin headers exist for images, GIFs, audio, video, and tutorial assets.
- [x] Broken Imgur links can be replaced with a file in the tutorial's media folder without rebuilding unrelated slides.

## 5. Shared annotation assets

Source:

`/Users/tamchap/Dev/mh_media/shapes.csv`

- [x] `shapes.csv` contains human-readable shape names and hosted image URLs.
- [x] Shapes dropdown uses the CSV names as its visible labels.
- [x] Choosing a shape places the hosted shape image on the slide.
- [x] Shape URLs remain independent of the selected tutorial media folder.
- [x] Shared audio, video, and link annotation artwork lives under `/images/tutorial-annotations/`.
- [x] Deploy the nine new `h-*.png` hotspot images, `play-audio-annotation.png`, `pause-audio-annotation.gif`, and replacement `play-video-annotation.png` before relying on their public URLs.
- [x] Missing or broken shape URLs fail visibly without breaking the builder.
- [x] Markups remain separate from shape-image annotations.

## 6. Overall builder arrangement

- [x] Compact editing toolbar appears above the tutorial.
- [x] Tutorial title bar appears directly below the toolbar.
- [x] Main tutorial editing area follows the annotated layout.
- [x] Permanent reader navigation appears directly beneath the main slide/canvas.
- [x] Slide/media management controls appear below the tutorial.
- [x] Interactive-annotation URL controls appear below the tutorial.
- [x] Metadata and social-sharing controls are moved to the absolute bottom.
- [x] Builder controls are clearly separated from tutorial/player content.
- [x] Exported tutorial contains no builder-only controls.

## 7. Tutorial title and cover

- [x] Tutorial title is manually editable.
- [x] Tutorial title is displayed in the yellow title bar.
- [x] Cover/tutorial-introduction content remains supported.
- [x] Cover title/subtitle and description are manually editable.
- [x] Cover is represented as the first unnumbered item in Contents.
- [x] Cover behavior in export matches the builder preview.

## 8. Annotated-image slide

- [x] Left column is visible for an annotated-image slide.
- [x] Slide title is manually editable.
- [x] Slide description/body is manually editable.
- [x] Hotspot list appears below the title/description.
- [x] Hotspot list uses the hotspot's color.
- [x] Hotspots can be reordered with up/down controls.
- [x] Active hotspot detail/body is manually editable.
- [x] Long hotspot lists scroll without growing the whole tutorial.
- [x] Right side contains the large image/annotation canvas.
- [x] Main image can use contain, cover, or matched aspect behavior.
- [x] Match preserves the PNG's natural aspect ratio instead of stretching it with `object-fit: fill`.
- [x] The main PNG renders from the full-resolution source with automatic browser image rendering.
- [x] A 2458×1484 PNG was verified at the exact same rendered aspect ratio in Match mode.
- [x] Main image can be nudged left/right/up/down.
- [x] Main image can be zoomed in/out and reset.
- [x] Image canvas starts at a wider 5:3 aspect ratio instead of a tall, nearly square minimum.
- [x] Main image nudges use 1% steps; zoom uses 5% steps and can zoom out below the reset size.
- [x] Annotations can be selected, moved, and resized on the canvas.

## 9. Video slide

- [x] Video slide has no hotspot sidebar.
- [x] Video slide has no inactive/no-hotspots message.
- [x] Video media box is centered in the full-width slide canvas.
- [x] The Contents title for a video slide is edited in the lower “Slides and main media” area.
- [x] Annotations can be placed anywhere across the full video-slide canvas.
- [x] Video slide retains Back, Contents, and Next navigation.
- [x] Builder and exported behavior match.

## 10. Permanent tutorial navigation

- [x] Navigation is required on every slide type.
- [x] Back button remains at the left.
- [x] Dotted 3×3 Contents button remains centered.
- [x] Next button remains at the right.
- [x] Contents remains visible even for a one-slide tutorial.
- [x] Reliable inline SVG is used for the dotted symbol.
- [x] Back and Next have correct disabled behavior at the ends.
- [x] Navigation is present in the exported tutorial.

## 11. Contents modal

- [x] Opens in the same page over a dimmed background.
- [x] Yellow Contents header.
- [x] Visible text Close button.
- [x] Escape closes the modal.
- [ ] Clicking the backdrop closes the modal.
- [x] Cover card appears first without a number.
- [x] Other cards show their slide numbers and slide titles.
- [x] Current slide card is highlighted pale yellow.
- [x] Selecting a card jumps to that slide and closes the modal.
- [x] Grid adapts to additional slides and smaller screens.
- [x] Focus returns safely to the Contents button after closing.

## 12. Slide management

- [x] Add annotated-image slide.
- [x] Add video slide.
- [x] Duplicate the selected non-cover slide.
- [x] Delete the selected non-cover slide.
- [x] Move selected slide backward.
- [x] Move selected slide forward.
- [x] Slide order and Contents order stay synchronized.
- [x] Deleted slides are removed from Contents.
- [x] A meaningful current slide remains selected after deletion/reorder.

## 13. Hotspots

- [x] Add hotspot.
- [x] Select/activate hotspot.
- [x] Canvas shows only the active hotspot marker; locked markers remain visible for the whole slide in both builder and exported player.
- [x] Move hotspot up.
- [x] Move hotspot down.
- [x] Delete hotspot.
- [x] Hotspot title is manually editable.
- [x] Hotspot body/details are manually editable.
- [x] Slide title/body and hotspot title/body can be typed directly without leaving edit mode.
- [x] Clicking a previously created hotspot title reselects that hotspot for editing.
- [x] Clicking a hotspot marker or sidebar row activates it and expands its corresponding details.
- [x] Hotspot details expand directly beneath their own colored header as a one-at-a-time accordion.
- [x] Marker-to-header and header-to-marker activation work in both the builder and exported player.
- [x] Hotspot colors remain visually connected between sidebar and canvas.
- [x] Canvas hotspot markers are compact single numbered boxes filled with the matching sidebar color.
- [x] Hotspot markers have no oversized outer frame or separate white number box.
- [x] Hotspot markers use the reference image's hard black offset shadow.
- [x] Hotspot slots cycle once through pink, orange, green, yellow, purple, mauve, mint, light pink, and coral, then repeat.
- [x] Each numbered marker uses its matching `h-*.png` artwork, with the number centered on the colored circle rather than the artwork's lower shadow.
- [x] Each sidebar header uses the exact dominant color code from its matching hotspot artwork.
- [x] Hotspots lift and scale slightly on hover/focus, and the matching marker pops when its sidebar header is expanded, with reduced-motion support.
- [x] Newly placed hotspots start at a larger square-pixel size, and resized hotspot dimensions persist when the draft reloads.
- [x] Hotspot marker can be moved and resized.
- [x] Selected hotspot can be brought forward or sent backward.
- [x] Moving a hotspot up/down swaps only its title/body information with the adjacent numbered slot; marker numbers, positions, colors, sizes, and stacking stay fixed.
- [x] Hotspot marker numbers remain tied to slots 1–9 even when their front/back stacking changes.
- [x] Hotspots are optional on cover slides and remain unavailable on video slides.

## 14. Shape annotations

- [x] Shapes dropdown appears in the top editing toolbar.
- [x] Selecting a shape places it on the current slide.
- [x] Shape can be selected, moved, resized, reordered, locked, and deleted.
- [x] Every Shapes-dropdown asset receives the same visible drag handle for free rotation.
- [x] Selected shapes have an on-canvas horizontal flip control; the mirrored state saves, undoes, and renders in exported HTML.
- [x] Shape opacity can be adjusted.
- [x] Shape renders in exported HTML.

## 15. Markup annotations

- [x] Markups control is separate from Shapes.
- [x] Line, circle, square, and arrow each have their own compact dropdown.
- [x] Each markup dropdown offers Solid and Dotted.
- [x] The eight required variants exist: solid/dotted line, circle, square, and arrow.
- [x] Markups render as native SVG rather than image annotations.
- [x] Legacy `box` markup data normalizes to a native solid square.
- [x] Line and arrow use the v2 three-point bend behavior.
- [x] Circle and square stretch independently in width and height.
- [x] Markup thickness remains constant while the object stretches.
- [x] Arrowheads use the smaller v2-style marker size.
- [x] Markup can be selected, moved, resized, reordered, locked, and deleted.
- [x] Selected markups have top, right, bottom, and left midpoint handles for one-axis resizing, in addition to corner handles.
- [x] Markup opacity and the annotated width control work.
- [x] Markup renders in exported HTML.

## 16. Text annotations

- [x] Add text annotation.
- [x] Text content is directly editable.
- [x] Three approved visual styles are available.
- [x] A selected text annotation has a separate Move handle so editing text does not prevent dragging it.
- [x] Clicking an existing text annotation reselects it without interrupting direct editing.
- [x] Text can be selected, moved, resized, reordered, locked, and deleted.
- [ ] Text opacity works; color choices need confirmation before adding a visible color control.
- [x] Text renders consistently in export.

## 17. Image annotation

- [x] Behaves like a placed shape/image, not a popup.
- [x] Public image URL is editable.
- [x] Clicking Add places the image on the canvas.
- [x] Image can be selected, moved, resized, reordered, locked, and deleted.
- [x] Image opacity can be adjusted.
- [x] Image renders in exported HTML.

## 18. GIF annotation

- [x] Behaves like an image annotation.
- [x] Public GIF URL is editable.
- [x] Clicking Add places the GIF on the canvas.
- [x] GIF can be selected, moved, resized, reordered, locked, and deleted.
- [x] GIF remains animated in the builder and exported tutorial.

## 19. Video annotation

- [x] Placed annotation opens a popup modal in the same browser tab.
- [x] Placed annotation uses the shared replacement `play-video-annotation.png` artwork.
- [x] Clicking the artwork opens the video popup; no separate trigger control is added.
- [x] Modal has a visible Close/X control.
- [x] Escape closes the modal.
- [ ] Clicking the backdrop closes the modal.
- [x] Direct video files use a compact start/pause and draggable timeline strip below the picture, avoiding the native hover-dimming overlay.
- [x] YouTube watch, share, embed, live, and Shorts URLs render through the supported YouTube iframe player.
- [x] The modal automatically fits landscape, portrait, and vertical Shorts aspect ratios without a large empty black frame.
- [x] Opening a video annotation attempts playback immediately for both hosted files and YouTube embeds; controls remain available if the browser blocks autoplay.
- [x] Closing the modal stops playback.
- [x] Modal works in both builder preview and exported tutorial.
- [x] Video annotation URL is editable.
- [x] Video annotation trigger can be moved/resized/reordered/locked/deleted.

## 20. Audio annotation

- [x] Clicking the annotation plays audio without leaving the tutorial.
- [x] Audio has a start/pause toggle.
- [x] Audio uses `play-audio-annotation.png` while idle or paused, with no timeline visible.
- [x] Audio switches to the animated `pause-audio-annotation.gif` while playing.
- [x] Audio play/pause artwork and the video-modal trigger lift and scale slightly on hover/focus, matching the hotspot interaction.
- [x] A draggable audio timeline appears directly beneath the artwork only while audio is playing.
- [x] Dragging the timeline seeks backward or forward, including rewinding to the beginning.
- [x] The play/pause artwork control has no visible button box or added yellow spinner; the tape/cog artwork provides the animation.
- [x] Audio URL is editable.
- [x] Only intended audio continues playing when slides change.
- [x] Audio annotation works in both builder and exported tutorial.
- [x] Legacy root-audio URLs accidentally entered as `/tutorials/file.mp3` normalize to the deployed `/audio/file.mp3` path in drafts and future exports.
- [x] Audio playback failures identify network, decoding, and unsupported/direct-URL errors.

## 21. Link annotation

- [x] Uses the shared `link-interactive.png` artwork.
- [x] Opens its destination in a new tab.
- [x] Link URL is editable.
- [x] Link annotation can be moved/resized/reordered/locked/deleted.
- [x] Export includes `target="_blank"` and safe `rel` attributes.

## 22. Annotation editing controls

- [x] Bring to front.
- [x] Send backward.
- [x] Lock/unlock.
- [x] Delete.
- [x] Opacity control.
- [x] Resize handles.
- [x] Move/drag behavior.
- [x] Selected object is visually clear.
- [x] Locked object cannot be accidentally moved or resized.
- [x] Controls operate only on the selected object.

## 23. Symbols and icons

- [x] Do not depend on unusual Unicode glyphs or custom emoji.
- [x] Use inline SVG icons for toolbar controls and transport controls.
- [x] Every icon button has a text tooltip/title and accessible label.
- [x] Icons remain correct in exported HTML.
- [x] No missing-glyph boxes appear in the builder or export.

## 24. Metadata — bottom of builder

Use smart defaults: automatically fill a field while it remains untouched, but
never overwrite a user's manual edit.

- [x] Learning-section name/slug.
- [x] Internal tutorial title.
- [x] Tutorial slug controls the downloaded filename and the final folder in the automatic public URL.
- [x] Metadata explains the clean folder deployment pattern: `/learn/section/tutorial-slug/index.html`.
- [x] Status selector removed; V3 exports finished tutorial pages rather than planned/Coming Soon catalog entries.
- [x] Card title.
- [x] Card summary.
- [x] Modal description.
- [x] Display order.
- [x] Canonical public tutorial URL.
- [x] Social share title.
- [x] Social share description.
- [x] Social image URL.
- [x] Social image alt text.
- [x] Cover image is the social-image fallback.
- [x] Magic Hashtags logo is the final social-image fallback.
- [x] Media tutorial folder is independent of the website Learn section.
- [x] Metadata remains editable after autofill.
- [x] Manually overridden metadata is not overwritten by later title changes.

Canonical website:

`https://magichashtags.com`

## 25. HTML export

- [x] Export target is an individual tutorial page, not the Learn index page.
- [x] Export HTML begins on the first tutorial page/cover.
- [x] Export contains the complete tutorial player.
- [x] Export contains Back, Contents, and Next navigation.
- [x] Export contains functional image, GIF, audio, video, link, shape, markup, text, and hotspot annotations.
- [x] Export contains no builder toolbar, slide manager, URL inputs, resize handles, or metadata editor.
- [x] Export references hosted media with stable public URLs.
- [x] Export includes static title, description, canonical, Open Graph, and Twitter metadata.
- [x] Exported file can be placed directly in the chosen website tutorial folder.
- [x] Exported page includes the Magic Hashtags site header without listing the current/internal tutorial.
- [x] Header links are embedded in the exported player, so the tutorial remains readable without a shared navigation script.

## 26. PNG export

- [ ] PNG export produces one image per applicable slide.
- [ ] Exported PNG matches the visible tutorial canvas.
- [ ] Builder controls and selection handles are excluded.
- [ ] Hosted images are included when the host permits canvas export.
- [ ] Failure identifies which remote asset prevented export.

## 27. Responsive behavior

- [x] Builder remains usable on a practical laptop-sized viewport.
- [x] The complete top toolbar, including PNG Slides, fits at a 1280px desktop viewport.
- [x] Exported tutorial is polished at desktop width.
- [x] Exported tutorial is polished at tablet width.
- [x] Exported tutorial is polished at phone width.
- [x] No horizontal page scrolling in exported mode.
- [x] Tutorial title remains readable without clipping.
- [x] Annotated-image sidebar and canvas reflow cleanly on narrow screens.
- [x] Video slide uses the available width.
- [x] Back/Contents/Next remain reachable and properly ordered.
- [x] Contents modal fits the viewport and scrolls internally.
- [x] Video modal fits the viewport and scrolls internally if necessary.
- [x] Audio/video controls have touch-sized targets.

## 28. Accessibility and keyboard behavior

- [x] All controls have accessible names.
- [x] Visible keyboard focus is preserved.
- [x] Modal focus does not disappear behind the overlay.
- [x] Escape closes Contents and video modals.
- [x] Enter/Space activates buttons, tutorial cards, and video annotations.
- [x] Ctrl+Z and Command+Z undo the last builder change.
- [x] Delete/Backspace removes a selected annotation when focus is not in an editable field.
- [x] Keyboard deletion does not remove hotspots or slides; those retain their visible delete-button workflows.
- [x] Images have appropriate alt text or are intentionally decorative.
- [x] Color is not the only way the selected object is identified.
- [x] Reduced-motion preferences are respected; the player does not require animation.

## 29. Verification matrix

Builder:

- [x] Fresh open with no saved state.
- [x] Reload restores the correct duplicated builder draft.
- [x] Add/edit/reorder/delete each slide type.
- [x] Add/edit/move/resize/reorder/lock/delete every annotation type.
- [x] All eight native markup variants render without an `<img>`.
- [x] Line/arrow bend handles, independent markup stretch, and constant stroke width were browser-tested.
- [x] Text direct editing, reselection, and Move-handle dragging were browser-tested.
- [x] Hotspot direct editing, reselection, expansion, marker movement, and resizing were browser-tested.
- [x] Twelve-hotspot browser test confirmed the exact nine-art/color cycle and its pink/orange/green repeat at slots 10–12.
- [x] Up/Down browser test confirmed only adjacent title/body content moves; IDs, numbers, positions, sizes, z-order, colors, and PNG artwork stay with their slots.
- [x] Deleting a hotspot reindexes the remaining slot colors/artwork correctly and survives autosave/reload.
- [x] File/folder attachment controls are absent; six URL fields remain.
- [x] Full-resolution main PNG Match rendering preserves the source aspect ratio.
- [x] Preview all hosted media types.
- [x] Autosave builder and reopen its URL.
- [ ] Reset builder after confirmation.

Exported tutorial:

- [x] Desktop Chromium test.
- [x] Tablet-width Chromium test.
- [x] Narrow/mobile Chromium test.
- [x] Contents navigation test.
- [x] Video modal keyboard, focus, and playback test.
- [x] Audio playback test.
- [x] External-link export uses a native new-tab link with safe attributes.
- [x] Exported hotspots activate the matching row, stage marker, and details panel.
- [x] Exported audio and link artwork load at their natural dimensions.
- [x] Exported site header, desktop Learn dropdown, and absolute site links work without listing the tutorial itself.
- [x] Social metadata inspection.
- [x] No builder-only elements remain.
- [x] No console errors during the main reader workflow.

## 30. Explicitly deferred until after builder completion

- [x] Learn landing-page redesign.
- [x] Learning-section index-page redesign.
- [x] Reporter-Tools-style tutorial cards and modals.
- [x] Coming Soon card state on Learn pages.
- [x] Wide horizontal/Tetris-style automatic packing for the jump/index blocks at the top of a Learn-section page.
- [x] Hiding individual tutorial names from the site navigation.
- [x] Automatic website catalog generation during deployment.

These items are documented so they are not lost, but they are not part of the
Tutorial Builder v3 implementation.

## 31. Decisions still requiring confirmation

- [x] Audio Rewind returns to the beginning.
- [x] Confirmed `https://magichashtags.com` (plural) as the canonical website domain.
- [ ] Confirm whether the cover is always exported or may be omitted.
- [x] PNG Slides will include the cover.
- [ ] Confirm whether a video-slide PNG uses its first frame or a separate poster image.
- [ ] Confirm selected-video preview behavior: first click selects; clicking the selected video again previews it. No extra permanent button was added.
- [ ] Confirm the annotated trash button may delete whichever object is selected; no second unshown delete button was retained.
- [x] The video-slide Contents title is edited in the lower “Slides and main media” area.
- [ ] Confirm whether a visible text-color control is wanted; it is not shown in the annotated toolbar.
- [x] Per-copy browser autosave is sufficient; do not add a visible Save Builder Copy button.
- [x] Unrequested keyboard slide shortcuts were removed from the v3 scaffold.
- [ ] Confirm whether clicking a modal backdrop should close it; the stated requirement is Escape plus a visible Close/X control.
