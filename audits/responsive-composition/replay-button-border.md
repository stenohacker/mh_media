# Replay button border repair — September 14, 2026

The apparently clipped right edge was an older, more specific `.demo-restart-button` rule setting `border-right: 0`. Browser computed styles confirmed 0px at the right with approximately 3px on the other three sides; the button itself was inside the viewport.

Updated the final replay-button override in tutorial-demo-builder-v2.html and exports/2026-09-14/appearance-pages-demo.html to restore all four 3px black borders and consistent 7px padding. Embedded project-state JSON was preserved exactly. No project database edits.

Browser checks: standalone player and the real export embedded at 358px, 768px, and 1440px all have four equal borders and a 44px button fully within each viewport. Full-page screenshot confirms a complete replay box. Restart then Pause works at 358px. Temporary wrapper removed.

Backup: backups/before-replay-border-20260914-014558/
