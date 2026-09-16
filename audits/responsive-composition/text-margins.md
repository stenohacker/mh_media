# Text frame margin placement — 2026-09-14

The live V2 `fitStageObjectBounds` kept the entire text rectangle inside the slide vertically and inside the existing side workspace horizontally. Empty space in a tall/wide text frame therefore stopped visible text short of a margin.

Reproduced with one 60%-wide, 40%-high centered text box: dragging its center toward y=95 stopped at y=80. No font-size or content issue was involved.

Changed text-only placement so its frame may straddle the page boundary. The center retains the existing authoring limits (x=-12.5 to 112.5; y=0 to the page's height). Width, height, rotation, font size, text, and selection handles are unchanged. Other annotation types retain their existing frame constraints. The older demo/centered/video-page builders already use center-based placement without this V2 frame-fit restriction; they needed no changes for this repair.

Updated the live V2 runtime plus the five previously repaired local/website players so margin positions survive loading and exporting. Every affected project-state block was preserved byte-for-byte; no project database writes.

## Verification

Browser, using an isolated fixture:
- Before: bottom drag stopped at y=80.
- After: bottom y=95.036, top y=4.980, left x=4.987, right x=94.929.
- All drags retained w=60%, h=40%, the text, and rendered font size 22.3107px (28px design size).
- Right-arrow nudge reached x=95.429 and survived reload.
- Generated tutorial and demo exports retained four margin labels and complete controls at desktop 1910x1075 and actual CSS mobile viewport 375x667.
- Text-fit factors stayed 1.0000; no extra font shrinking was required.
- Five patched players loaded with visible controls. Existing off-canvas annotations in Appearance remained included; offscreen cloned text belongs to the magnifier's internal scene only.
- Temporary viewport override reset and test tabs/files removed.

Automated checks passed:
- text-margins.test.mjs: four margins, large frame dimensions, font/content preservation, save/reload, complete composition bounds, unchanged non-text constraints, both export serializers.
- bounds.test.mjs, text-controls.test.mjs, ordinary-slides.test.mjs, slide-navigation-frame.test.mjs.
- Website release checklist: 340 checks passed, plus links/media/architecture.

Backup and file hashes: `../../backups/before-text-margins-20260914/manifest.json`.
