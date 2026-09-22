# Export layout progression

This is an observation log supplied by Tamara, not an implementation request or approval of the pictured styling. Do not treat a historical screenshot as the desired final state without her direction.

## Progression 1 — before the last fix

**User correction:** This progression concerns the builder framing versus the HTML export: the boxes, their dimensions, and overall size. It is not a hotspot issue. The initial hotspot-focused interpretation was incorrect and has been removed.

Source images, in chronological order:

1. `/Users/tamchap/Downloads/1 builder started out here.png`
2. `/Users/tamchap/Downloads/2 html export made this.png`

### User-confirmed desired behavior

The exported screenshot is AFTER the tutorial has opened. The header bar disappears at this point so the buttons can all be seen. This is intentional and must be preserved. Back, Menu, Next, and the upper-right close control are visible in the exported screenshot.

### Builder baseline

- The authoring toolbar spans the top of the screenshot.
- Below it, the builder's outer bordered frame is narrower than the toolbar and centered in the window, with substantial white space on either side.
- A separate inner black-bordered white slide area sits inside that outer frame, surrounded by a pale lavender area.
- A horizontal border separates the slide area from the bottom navigation box.

### Open HTML export

- The outer bordered player frame expands to nearly the full screenshot width and height.
- The inner white slide area also enlarges, with pale lavender space between it and the outer frame. The widths and proportions of these surrounding spaces differ visibly from the builder view.
- The bottom navigation occupies a separate full-width box within the outer player frame.
- Compare the outer frame, inner slide box, surrounding space, navigation box, and overall content scale as one layout. Do not reduce this progression to an individual card or hotspot.
- The header's disappearance after opening is desired, not a reported defect.

These are screenshot observations only. They do not establish a code-level cause, exact intended coordinates, or the desired outcome of later progression stages. No builder changes were made while recording progression 1.

## Progression 2 — what the framing was "fixed to"

Source images:

1. `/Users/tamchap/Downloads/builder now.png`
2. `/Users/tamchap/Downloads/html export now.png`

Tamara explicitly says this result is still wrong. Continue to assess the overall builder/export boxes and sizing, not hotspot behavior or card-design preferences.

### Visible framing mismatch

- The builder's outer frame is now wider than in progression 1, approximately aligned with its toolbar. Its inner slide has narrow side margins within that frame.
- In these supplied captures, the inner slide width is approximately the same between builder and export. The export's outer frame and navigation box nevertheless extend substantially farther sideways, creating much wider side gutters.
- Consequently, the export is not a proportional enlargement of the complete builder frame. The inner slide, outer frame, surrounding space, and navigation do not retain their visible proportions as one layout.
- The builder capture does not show the full slide at once: the upper card is partly out of view at the toolbar boundary. The screenshot alone does not establish whether scrolling, toolbar overlap, or a layout rule causes this.
- The export shows the complete inner slide frame, but visible text also differs: the callout's final "line spacing" line shown in the builder is absent, and fewer lines of the title card are visible. This is additional evidence that the authoring view is not a faithful preview of the exported result; do not assume a cause from the screenshots.

The desired disappearance of the header after the tutorial opens remains unchanged. No builder changes were made while recording or assessing progression 2.


## Approved target and subsequent clarification

References:

- `/Users/tamchap/Downloads/what builder NEEDS to look like.png`
- `/Users/tamchap/Downloads/what hmtl export NEEDS to look like.png`
- `/Users/tamchap/Downloads/what html export NEEDS to look like  when first opening tutorial.png`

Tamara authorized implementing these references. The handwritten outside-edge labels are reference annotations only. The page outside the presentation is white; the pale purple surround has a black border; a white bordered frame contains both the slide and the navigation. The inner editable area has its own black border and a narrow white inset. Purple side strips continue beside the navigation, ending at its bottom.

The builder and tutorial export must use identical canvas width and scale at the same browser viewport. The builder toolbar is above the frame and may push the builder navigation below the fold; do not shrink the canvas to accommodate the toolbar. Preserve saved object coordinates, canvas aspect, original image assets, and separate title/body typography while uniformly scaling their containing composition.

Before opening, the website header remains visible. Only the editable inner area receives the translucent purple cover. Navigation exists below and may be below the fold. Opening removes the header and cover, moves the same-sized composition upward, and reveals navigation. Do not resize the frame on Open. The pictured Open button was a sample, not a requested redesign.
