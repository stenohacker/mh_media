# Appearance Pages website embed — September 14, 2026

Installed an exact copy of the user-provided Downloads/tutorial-title-demo (24).html at website/learn/Appearance/appearance-pages-demo.html. The existing Appearance Pages modalDemoUrl already points there, so no catalog or Reporter Tools page changes were required. Original download unchanged. Prior website demo backed up outside the publish root at website-archive/2026-09-14-before-appearance-embed-014728/.

The exact attachment contains seven timed slides totaling 35 seconds. Local website preview is running at http://127.0.0.1:8123/.

Browser verification:
- See More opens the Appearance Pages card with its existing poster and text.
- Play Demo expands a single iframe loading the newly installed export.
- Pause held 0:12 / 0:35 during other checks; Play resumed; Replay returned to 0:00.
- Closing the viewer removes the iframe and returns to the same still-open card.
- Desktop iframe width and scrollWidth were both 1418px.
- At a 358px website viewport the demo iframe width and scrollWidth were both 333px; both control buttons were entirely inside the iframe. Pause and closing back to the card passed.
- The phone check used a temporary same-origin wrapper around the actual Reporter Tools page; cross-origin wrapper interaction was unavailable through browser automation. Both wrappers were removed.
- No JavaScript errors in the tested desktop flow.
- ruby scripts/run_release_checklist.rb: PASS, 340 release readiness checks. Only standard warning to preview root-relative assets through a web server.

No publication or deployment. Website source outside the installed standalone demo was unchanged.
