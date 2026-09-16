# Text, scrolling and player fixes — 2026-09-14

Authoritative source: `../../tutorial-demo-builder-v2.html`. Backups are in
`../../backups/before-text-controls-player-fit-20260914/`.

## Changes

- Text formatting previously retained a selection from a different field. Clicking a title after editing a body could recolor the body instead. Caret/field tracking now follows the field being edited. Selected words, a whole field, and a selected text box support underline color, bold and highlight; rich formatting survives save and export.
- Underlines retain adjustable color, thickness and offset with a shallow curve. New regular text starts at 28 design pixels; handwriting/Impact starts at 32. New title cards use a 40-pixel header and 28-pixel body; new callouts use 36/28. Existing saved font sizes remain intact. Hanken heading weight 700 and body weight 400 follow `/Users/tamchap/Dev/font-comparison/index.html` and the local website's typography hierarchy. Design sizes scale with the slide canvas.
- Smaller selection outlines and 1% minimum object dimensions allow tighter placement. Blur frames have no border, outline or shadow; blur strength remains adjustable.
- Scroll backgrounds and tall scrolling images are distinct fields. Narrow recovery handles the existing tall Drafts image mistakenly saved as a background. The original image is preserved, the default background is restored, and scrolling happens inside its screen. Background replacement remains independent of the scrolling image.
- Next and Back visit scroll-slide hotspots and reveal their locations. The down arrow becomes an up arrow at the bottom; clicking it returns to the top.
- Player sizing reserves the navigation controls and measures the loaded fixed header. The tutorial has 8 pixels of clearance below that header and fits the available viewport height.

## Verification

- Real browser: custom underline color, title/body targeting, title 700/body 400, new title and callout sizes without initial overflow.
- Real browser: blur strength changed from 12 to 13; deselected blur had 0-pixel borders, no outlines and no shadow.
- Real browser: recovered the actual 2280×14896 scrolling image; background remained fixed. Next/Back revealed three test hotspots. Bottom arrow changed to “Scroll to top” and returned scroll position to zero.
- Real browser: complete tutorial frame and navigation fit at 1910×1075, 1200×720, 900×400 and 375×667. The website demo embed's controls fit within 1910×1075; Pause held at 0:14 / 0:35.
- Passing checks: `text-controls.test.mjs`, `scroll-navigation.test.mjs`, `ordinary-slides.test.mjs`, `cards-drafts-popup.test.mjs`, `demo-pause.test.mjs`, and `reporter-embed-pause.test.mjs`.
- Local website release checklist passed all 340 checks, including local references and media.

## Updated existing players

The runtime and main CSS were synchronized to the dated Appearance demo/slides exports, the website's Appearance demo, and `tutorial-title-slides-fixed.html`. Each embedded `project-state` script was preserved byte for byte; hashes are recorded in `text-scroll-state-preservation.json`. Downloads originals were not overwritten. No website was published and no project database was edited by a script.

The live Chrome builder could not be refreshed automatically because an extension panel interrupted browser control. The saved builder file contains the fixes; the existing browser page needs one refresh after that panel is closed.
