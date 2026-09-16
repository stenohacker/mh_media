# Reporter Tools embedded main Pause control — September 14, 2026

Patched only `/Users/tamchap/Dev/website/learn/Appearance/appearance-pages-demo.html`. Its downloaded standalone runtime still replaced the main play/pause SVG on each 120 ms timeline update. The previous turn fixed the separate popup video control. This repair brings the main embed control up to the stable-icon routine already present in the live V2 builder.

Added `updateDemoToggleArt` from the current builder; routed both timed-slide and main-video progress updates through it. The button contents change only when play/pause state changes, preserving the pointer target while a click is in progress. No composition, project-state, autoplay, audio, website card, or shared CSS was changed.

Backup: `/Users/tamchap/Dev/website-archive/2026-09-14-before-embed-pause-020751/appearance-pages-demo.html`.

Verified through the actual open Appearance card at `http://127.0.0.1:8123/reporter-tools.html#tool=appearance`, using its real expanded iframe. Closed/reopened the viewer to fetch the repaired export through its existing fresh-launch URL. Pause held at 0:07 / 0:35 and 20.8% across a later read; Play resumed; after advancing into a scrolling slide, Pause held at 0:18 / 0:35 and 51.4%.

`reporter-embed-pause.test.mjs` reproduces the disappearing pointer target in the backed-up export and confirms it remains present through repeated timeline updates in both the repaired website export and current builder. Pause/resume button labels and continued progress updates pass.

`ruby scripts/run_release_checklist.rb`: PASS, 340 readiness checks, local links/media/architecture passed. No deployment performed.
