# Text-box resize handles — September 14, 2026

Reproduced in an isolated copy of the live V2 builder: dragging the east handle
80 pixels increased the text frame from 215.135 to 295.138 pixels, but the handle
stayed at x≈949 because `syncSelectionControls` measured the letters, not the frame.

Text, title-card and callout selection controls now use the full editable frame.
All eight resize handles are anchored with percentages, so they follow the box
immediately as its width and height change. Existing text, font sizes and saved
object geometry were not rewritten. Image artwork selection behavior is retained.

Browser verification used real pointer drags for all eight handles, first outward
and then inward. Each axis resized as expected; handles stayed within 0.006 pixels
of their corresponding frame edges/corners. Text and font size stayed unchanged.
After reload, the saved size and all eight handle anchors were preserved.

`text-controls.test.mjs` passed, including formatting, saved text, frame sizes and
both export serializers. This is a builder-only selection-control fix; existing
player files do not display editing handles and were not modified.

Backup: `backups/before-text-resize-handles-20260914/`.
