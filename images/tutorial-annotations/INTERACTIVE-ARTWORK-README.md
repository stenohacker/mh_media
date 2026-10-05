# Current functional tutorial artwork

These are the current copies used by Tutorial Demo Builder V2:

| Function | Current file | Existing PNG path |
|---|---|---|
| Audio play | play-audio-annotation.png | same |
| Audio pause | pause-audio-annotation.gif (animated) | — |
| Video popup | play-video-annotation.svg | play-video-annotation.png |
| Link opens new tab | link-annotation.svg | link-annotation.png |
| Scrolling popup | scrolling-annotation.svg | scrolling-annotation.png |

Video, link and scrolling SVGs are embedded in the builder and its new exports, and are byte-for-byte copies of the SVG files here. Their fallback URLs point to these same SVG files. PNG compatibility copies also contain the new artwork. Audio keeps its original hosted paths and a fixed revision query to refresh browser caches. Existing functions are unchanged.

`interactive-artwork.json` records the filenames, setup actions and hashes. Publish this main folder with the media site. Refresh the existing builder after updating it. Previously exported HTML files are independent copies and are not silently rewritten.

Organized library copies remain in `../annotation-libraries/interactive/`. Its `legacy/` subfolder retains the old artwork. Loose images in the parent images folder are left in place for future use; these functional controls do not depend on those loose copies.
