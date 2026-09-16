# Draft folders, popup pause, title and callout cards — September 14, 2026

The live V2 builder was patched in place. No project database or embedded project-state was replaced.

- Restored the original Drafts navigation directly as the top-left toolbar control. The redundant outer popover had buried the five folders inside another menu. D1–D5 still use tutorials/DRAFT-1 through DRAFT-5. Hover and keyboard focus expose the adjacent file list. New/copy/editable-draft commands remain under Tutorial name and save status.
- Popup video timeupdate events now preserve the play/pause SVG unless playback state changes. Replacing the SVG on every tick could remove the pointer target between mouse-down and mouse-up. Applied the same small repair to the current dated Slides and Demo exports and the local website Appearance player, preserving each embedded state exactly.
- New and previously unassigned callout headers receive a saved color from the website palette. The seven-color cycle avoids adjacent repetition, survives reload, and gives a newly duplicated callout a new color. Menu previews and both export modes use the saved color.
- Naming a slide through Slide title creates/reuses its title card. The title card has a black header and synchronizes its title with the slide/menu name. Existing legacy title labels retain their ID and geometry when converted. Header only sits with the bottom body controls and restores the same body, list and alignment settings when toggled off.

## Verification

Browser tests used isolated fixture URLs, without writing to the user's active project database:
- Drafts displayed D1–D5 directly. D1 listed 13 actual images; selecting image 4.png inserted and loaded it from the expected local Drafts path. D2–D5 were empty.
- Title creation, centered header/body, body-only left alignment, rename, Header only on/off, and saved title after reload passed. Both freshly generated Tutorial and Demo previews displayed the title and alternating header colors; Tutorial output had no authoring footer controls.
- Popup video paused at 4.193049 seconds in the builder and held that position, then resumed and replayed. A freshly generated Slides preview paused at 0.392262 seconds and held.
- Existing dated Slides export paused at 4.40622 seconds; Demo export paused at 0.059532 seconds. Both held across later reads. The local website standalone player loaded successfully (its attached seven-slide state contains no popup video annotations).
- cards-drafts-popup.test.mjs passed title creation/reuse/rename, body retention, legacy geometry, 14 palette assignments and persistence, duplicate color, direct folder toolbar, stable video controls, pause/resume/replay, and JavaScript parsing for all changed HTML files.
- ordinary-slides.test.mjs passed current saved-project geometry/background preservation.
- demo-pause.test.mjs passed intentional WATCH VIDEO audio-start behavior plus ordinary pause/resume.

Backups: before-title-callout-cards-20260914-015404 and before-drafts-popup-pause-20260914-020010.
New title/callout rendering is in the live builder and its future exports. Existing exported compositions were not regenerated. Refresh the builder to load its runtime repair; re-export after finishing the current draft.
