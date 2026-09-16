# Demo playback repair — September 14, 2026

Scope: active V2 builder and the local appearance-pages-demo export. Embedded authoring state retained byte-for-byte. No project database writes were performed; the working draft database changed independently while the browser was being tested and was not overwritten. No website changes or publication.

The first video click intentionally restarts from zero with audio. Preserved that behavior following the user's clarification. Initial control must identify the start action instead of displaying Pause during muted autoplay. Later Pause stops video and invalidates outstanding slide playback work; Play resumes without resetting position. Timeline updates keep the same icon DOM until the button state changes.

Browser verification using the actual V2 runtime and a local 78-second video:
- Initial muted autoplay continues before the audio-start click.
- First start click resets playback near zero and sets muted=false.
- Pause held the video at exactly 5.743261 seconds across observations.
- Play resumed at 5.98554 seconds with muted=false.
- Replay returned to 0.234395 seconds while retaining audio.
- Final stop/cancellation implementation retested: paused=true, muted=false, 0.26102 seconds immediately after pause.
- Seven-slide saved draft paused at 26.9%, 0:09 / 0:35; stayed identical during other checks, then resumed to 27.2%.
- Updated existing five-slide export: Restart -> Pause -> Play control and stopped timeline verified.

Regression checks cover intentional audio start, no timeline-driven icon replacement, pause/resume position, pending playback cancellation, and pausing real video even when a stale state flag says it is stopped. Both production runtime copies parse. The original bug report was not reproduced on plain slide playback; observed main-video first-click behavior was intentional per the user.

Backup: backups/before-demo-pause-20260914-013748/

Final label: WATCH VIDEO, visibly rendered in the exported main-video player before the first audio-start click. The first control column stays 112px wide so changing to Pause does not move the timeline. Video is paused before seeking to zero and enabling audio. Final browser check: WATCH VIDEO -> Pause video -> Play video; muted=false, paused=true at 0.259813 seconds; no console errors. Desktop button text fits without overflow. A browser viewport override did not resize the hidden fixture and was reset, so no new mobile-browser claim is made. Website launch-button placement was queried; no explicit placement answer arrived, so the already-identified exported control was updated. Website source was only inspected and remains unchanged.
