# Purple tutorial page and edge placement — September 21, 2026

Latest reference: `/Users/tamchap/Downloads/Group 41624.png`.

The user clarified that the opened tutorial should look like a page belonging to the website without displaying its site header. The purple surround fills the page, with a small top and bottom inset around a centered white frame containing both the slide and navigation. Builder canvas dimensions continue to mirror the tutorial at the same viewport.

## Implementation

- Matched the existing `images/tutorial-annotations/slide-backgrounds/purple-background.png` treatment and website purple `#91a8ed` from `website/styles/site-system.css`.
- The opened page uses a continuous CSS gradient, so the decorative surround stays sharp at any display size. No source image was resampled or replaced.
- Purple inset above and below the white frame; navigation remains inside the frame. Uniform scaling retains saved canvas aspect and all authored object proportions.
- Image placement now measures transparent margins plus contain-fit letterboxing relative to the placed frame. Previously the raw image's alpha bounds were incorrectly treated as bounds of the entire placed box. Selection resolves those bounds before the first drag.
- Active HTML patched in place; embedded project-state unchanged. Saved draft data was not edited. User changes made during the session are preserved separately in the before-refresh backup.

Backup: `backups/2026-09-21-before-purple-surround-and-edge-placement/`.
Diff: `audits/2026-09-21-purple-surround-and-edge-placement.patch`.

## Passed verification

- 69 actual-browser framing checks at 1440×800, 1024×768, 390×844, and 812×375. Covers opening/closing, Menu, uniform scale, matching builder/export geometry and title/callout text, and containment of navigation and overlay.
- 107 card-control checks, including separate title/body typography, shared scaling, lists, title-only, fit text/frame, side handles, tutorial/demo exports, and reading output.
- 14 browser geometry checks for transparent artwork in wide/short and narrow/tall placed image boxes: visible artwork reaches all four canvas boundaries without changing source or dimensions.
- Seven Node regression suites covering frame, draft integrity, resizing, scaling, card rendering, separate output modes, and export generation.
- Visually inspected actual generated tutorial in the QA iframe: purple surround fills the page, white frame has purple above and below, and bottom controls remain visible.

## Final interaction and active-draft verification

After the user unlocked the Mac, the isolated fixture passed all 14 geometry checks again. Native mouse drags moved the same visible artwork to approximately 2 px from the top inner border and 5 px from the left inner border. Its displayed size stayed approximately 68 × 69 px; the image was not stretched. These drags occurred only in the isolated fixture.

The active V2 builder was refreshed at its original project URL. Its purple surround, separated toolbar, white frame, restored card treatments, and side move handles were visually inspected. The draft showed saved status at 6:50:25 PM. A fresh `before-final-refresh` backup was taken immediately before reloading; a strict comparison of `state.tutorial` before and after reload returned equal. All authored tutorial content was preserved; only project update metadata changed.

The active tab now has the verified runtime. Existing downloaded HTML files remain independent; exporting again is required to receive these changes.

Nothing published. Browser testing is Chrome only; Safari/Firefox have not been independently tested.

Verified source SHA-256: `3e893908531fb71c917eb9de4d3de15817a80b26fbb12d5ed9ec8f14b4a8d5d7`
