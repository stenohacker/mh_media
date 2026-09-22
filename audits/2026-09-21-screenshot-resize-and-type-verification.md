# Screenshot resizing and readable slide type — September 21, 2026

Active source: `tutorial-demo-builder-v2.html`. Embedded project-state remains byte-for-byte identical to the pre-resize backup. The named-project JSON files were backed up, not edited. No website files or hosted assets changed.

## Image resizing

Found two stretch paths: side handles changed only one dimension of a cropped image, and browser-framed screenshots used object-fit:fill without applying their saved crop window.

Images, GIFs, and shapes now scale proportionally from every handle outside crop mode. Crop mode can change the frame dimensions while keeping the source image's size/proportions fixed. Browser-framed images use contain when uncropped and the same saved crop geometry as ordinary images when cropped. Original source files and saved image URLs are retained.

Browser fixture: `qa-screenshot-resize.html`; test harness: `audits/screenshot-resize.browser.js`.

- 225 browser checks passed: eight handles, normal/cropped image/GIF/shape objects, 0/30-degree rotations, crop-mode image dimensions, browser-frame crop rendering, and nonmatching uncropped browser frame proportions.
- A real pointer drag on a cropped screenshot's right-side handle changed its frame from 34 × 35.47383867 to 37.63466265 × 39.26605739 (same proportional scale).
- Rendered screenshot dimensions changed from 764.972 × 409.375 to 846.758 × 453.172 pixels. Both preserve the original 1506 × 806 ratio within subpixel rounding.
- An actual tutorial HTML built with the production exporter rendered the same 846.758 × 453.172 screenshot after Start.
- Existing scaling-interaction and draft-integrity checks pass.

## Slide text

Reviewed the builder typography rules and website `styles/site-system.css` / `site-lib/learn-index.css`. Hanken Grotesk remains the shared family. Normal slide text is explicitly 400. Inline bold, saved heavier bold runs, and legacy bold text annotations now use 600. Typography sizes, line spacing, and authored font choices remain intact.

A separate mismatch was corrected: contents-preview-text previously forced regular text to weight 700; it now uses 400, with the bold variant at 600.

Browser fixture: `qa-readable-type.html`.

- Computed and visually inspected regular Hanken Grotesk at weight 400 and 28px, bold at 600.
- Mixed regular/bold text retains 400/600 within one line.
- Saved 800-weight italic mauve text renders at 600 while retaining italics and its color.
- Clicking the actual Bold toolbar button applies 600; clicking again restores 400 and preserves the words.
- An actual generated tutorial export retains the same 400/600 weights after Start.
- Existing browser fixture assertions were updated to expect the intentionally lighter bold weight.
- Draft-integrity, PDF-download, published-export-contract checks pass.

## PDF report clarified

Rendered `/Users/tamchap/Downloads/tutorial-title-reading-guide-2.pdf` and confirmed the reported frames-only result. Its matching `tutorial-title (49).html` lacks the finished-PDF payload and predates the already-verified PDF repair. The repair verification remains documented in `audits/2026-09-21-export-pdf-download-verification.md`; its actual Safari download included all artwork. Existing downloaded HTML does not update itself.

The user's active browser tab has not been refreshed by this task. Wait for Saved, refresh the builder, then export a fresh HTML file to load these fixes.

Backups:
- `backups/2026-09-21-before-screenshot-resize-protection/`
- `backups/2026-09-21-before-lighter-slide-bold/`
