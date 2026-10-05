# Annotation libraries

Installed in `tutorial-demo-builder-v2.html` on October 3, 2026.

- **Annotations:** 126 entries (including the steno highlight editor): 110 original icons, a native SVG steno keyboard, and an artistic steno keyboard PNG, plus three stick-figure PNGs and nine caped task signs plus a blank sign, with alphabetized thumbnails.
- **ShapesV1:** 158 older artwork files and thumbnails.
- **ShapesV2:** 79 later artwork files and thumbnails.
- **Interactive:** VHS video, new chain link and scrolling-page vectors. These open the existing setup dialogs and retain player behavior.
- **Interactive/legacy:** preserved original functional artwork, including audio play image and pause/stop GIF. Current audio uses the October 3 replacement files in the main tutorial-annotations folder.

`catalog.json` records the source-to-library mapping. Original images/tutorial-annotations folders have not been removed; existing drafts may reference them. Annotations are native scalable SVG except the artistic steno keyboard and the stick-figure/task-sign illustrations, which are raster PNGs. Older collections retain their original PNG format.

HTML and editable-copy exports embed the library images actually used in the tutorial. PNG/PDF export snapshots also embed these assets. The library folders are still needed locally for browsing and inserting new artwork in the builder. Nothing has been published.

### October 3 audio replacements
New play-audio-annotation.png and animated pause-audio-annotation.gif are installed at the original images/tutorial-annotations paths. Current copies also live in annotation-libraries/interactive; legacy backups remain unchanged. V2 uses a stable audio artwork revision to avoid old browser caches. The icon package includes these supplied raster originals in interactive-audio/.

The five current functional graphics are also directly in `../tutorial-annotations/`; see its `INTERACTIVE-ARTWORK-README.md` for exact filenames and runtime mapping.

### Steno highlight annotation
Choose **Steno keyboard — highlight keys** from Annotations. Type an outline, choose a stroke if it contains `/`, then **Place on slide**. Select the placed keyboard and use **Edit steno keys** to change it. The editor is embedded in the builder/editable copies; player exports contain only the finished SVG artwork, without the highlighter tool. Existing blank/artistic keyboard annotations remain available.
