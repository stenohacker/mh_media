# Website and standalone export weight match — September 21, 2026

Reference: website/styles/site-system.css (3px standard rules, 4px heavy frames, 400 body, 700 page headings); refined controls in website/reporter-tools.html and website/site-lib/learn-index.css (600 controls/card headings). The website handoff documents this styling ownership. No website files were edited or published.

An embedded tutorial-site-weights style block now supplies the matching weights to the active V2 builder, tutorial previews, demo previews, and generated standalone HTML. Standard inner-canvas/navigation rules use 3px; the existing 4px outer frame preserves the 1500px canvas geometry. Navigation/Start/Finish/demo controls and card headings use 600; completion headings use 700 and explanatory copy 400. Authored annotation stroke settings, text sizes, colors, object coordinates, locks, embedded fonts, and project-state were preserved.

Verified in isolated browser copies of the active draft: tutorial Start and Menu, menu headings/cards, demo headings and playback controls; identical frame and canvas dimensions before/after. Real buildExportHtml runs for BOTH demo and tutorial returned embedded matching CSS and fonts, no external stylesheet links, and unchanged retained slides. One accidental blank slide was excluded by the existing export rule.

The old canonical V1/v3 builders are deleted/absent; the active runtime is tutorial-demo-builder-v2.html. Existing downloaded exports receive the change when exported again.

Backup: backups/2026-09-21-before-website-export-weights/.
