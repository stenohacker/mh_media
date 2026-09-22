# Magnifier corners and stable editing — September 21, 2026

Changed only the active `tutorial-demo-builder-v2.html` runtime/styles. Embedded project-state is unchanged. Saved draft files were backed up and not edited. Canonical legacy builders remain retired; nothing was published.

Magnifier: added a labeled 0–50% Corners slider alongside the existing − / magnification / + controls. Updates render live without rebuilding the page. Rounding is stored independently from zoom/size, preserves legacy shape defaults, and resets consistently when a square/rounded/circle preset is chosen. Normalization and objectStyle apply the saved radius in builder, preview, and generated exports.

Browser verification: slider limits 0 and 50, a custom 25% value, change in magnification from 2 to 2.25 without losing 25% radius, save/reload retaining 25%, and production tutorial HTML export showing computed 25% border radius.

Screen jump: reproduced against the pre-change code in an isolated copy of the user's current project. Each edit rebuilt an initially zero-height frame, briefly clamped document scroll from 119.40 to 53.73, and restarted hotspot attention animation. The fix fits the rebuilt frame synchronously before media layout and restores the pre-edit scroll position. Builder-only annotation animation/hover movement is disabled.

A second width-dependent regression was found during responsive verification: the temporary empty frame removed the scrollbar, making the width jump from 1887.99 to 1909.98 before settling. The final fix captures viewport dimensions before replacing the DOM and uses those dimensions for immediate frame fitting. Later resize observers still handle actual window changes.

Isolated before/after browser fixtures: `qa-magnifier-before.html`, `qa-magnifier-after.html`; harness: `audits/magnifier-stable-editing.browser.js`.

Before: 8 failures out of 38 checks. After: all 38 pass (six edits, immediate geometry and five subsequent painted-frame checks each, plus no builder marker animation/hopping). Additional narrow viewport verification exposed and then confirmed the scrollbar correction with all 38 checks passing. Temporary test viewport override was reset.

Draft-integrity and builder-viewport-fit suites pass. The embedded project JSON is byte-identical to its backup.

The user's actual Chrome builder was confirmed saved, backed up, and refreshed successfully to the final correction at 8:49:40 PM. The reopened project retained the two slides, screenshot, magnifier, hotspot guide instructions, and newly typed #guide text. Native browser interaction did not modify slide objects.

Backup: `backups/2026-09-21-before-magnifier-rounding-stable-editing/` (including snapshots before live refresh).
