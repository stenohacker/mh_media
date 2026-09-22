# Exported tutorial PDF download repair — September 21, 2026

## Reported failure and reproduction

The user’s `Downloads/tutorial-title (48).html` showed Preparing PDF, then returned to its completion controls without a saved guide. Testing the same four-slide export reproduced a missing-image error for TEXT-BOX-SHORT. Older annotation URLs still pointed to images now located under `images/tutorial-annotations/removed annotations/`.

A first repair embedding lossless image assets allowed PDF creation, but native Safari testing exposed a second defect: its foreignObject canvas rendering omitted raster images/annotations. That intermediate approach was rejected after all four PDF pages were rendered and inspected.

## Final change

- The tutorial HTML exporter now builds the finished PDF once from the exported tutorial snapshot and includes that PDF inside the HTML.
- Download PDF decodes and downloads the existing PDF immediately, during the reader’s click. It does not rerender images in Safari.
- PDF preparation uses original image bytes, with a fallback to the existing archived annotation directory for retired artwork. Source draft URLs, source image dimensions, source files, and authoring state are not rewritten.
- Large image bundles are discarded from the finished HTML after its PDF is built. This four-slide test export is about 9.4 MB rather than the rejected 45.4 MB image-bundle version.
- Download results/errors remain visible in the completion dialog. Truly unavailable PDF artwork stops tutorial HTML export with a named error instead of shipping a broken download button.
- Demo HTML generation remains separate; its PDF generation is not enabled.

## Verification

- Actual HTML was generated through `buildExportHtml("tutorial")` in the Chromium-based in-app browser, using a copy of the user’s failing four-slide tutorial.
- The resulting PDF has four landscape Letter pages, 792 × 612 points, with lossless 3300 × 2550 page images.
- All four rendered pages were visually inspected. The previously missing numbered artwork, text-box artwork, screenshot images, arrows, callouts, and hotspot reading cards are present. The user’s test slide intentionally has overlapping authored objects; it was preserved.
- The final embedded PDF renders identically, pixel for pixel, to those four inspected pages.
- The real Download PDF button was clicked in Safari on the final local HTML. Safari’s download prompt was allowed. `/Users/tamchap/Downloads/tutorial-title-reading-guide-4.pdf` is byte-for-byte identical to the embedded, inspected PDF: 1,255,662 bytes, SHA-256 `76f11366cfb736f71f176ba09e88408a17b526a9bbeb91499c7668172c234d33`.
- `audits/pdf-download.test.mjs` passes: original-byte preservation, archived image fallback, asset deduplication, explicit missing-image errors, retry status, direct PDF download without rerender, and embedded draft preservation.
- `tutorial-output-checks`, `published-export-contract`, and `draft-integrity` suites pass. The published-contract helper was corrected to find the function body after default object parameters.
- The active HTML’s embedded `project-state` is byte-for-byte unchanged from the pre-repair backup. Saved project files were backed up and were never edited by the repair.

## Active state and limits

The active builder remains `/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html`. The local server was found stopped and restarted through its existing launcher without opening another builder tab. The user switched projects and continued editing during verification; the attempted main-tab refresh was interrupted by user activity. Do not claim the active browser tab has loaded the new runtime. The user was told to wait for Saved, refresh, and export a new HTML.

The final inspected test HTML is `audits/tutorial-pdf-download-fixed.html`; it contains the earlier four-slide snapshot, not subsequent user changes. Previously downloaded HTML files do not update automatically. No published site, retired builder, or source asset was changed. The previously reported inner-border/actual-cutoff mismatch is still separate and was not modified by this PDF repair.

Backup: `backups/2026-09-21-before-export-pdf-download-repair/`.

Verified builder SHA-256: `55ec34e45b958c2a7c2d1b3d1161fc87b421f175225fb368575a4f2e90296644`.
