# Random hotspot header colors — September 14, 2026

The current V2 builder assigns hotspot header backgrounds from a shuffled cycle of the current local website's accent colors in `website/styles/site-system.css`: yellow, teal, pink, cream, soft pink, purple and orange. Each cycle uses all seven before repeating, with no adjacent repeat at the cycle boundary. Header text is black.

Each hotspot stores its own `headerColor`. Existing hotspots receive this field when loaded; subsequent normalization, editing and exports preserve it. Marker artwork and its existing numbered-slot colors remain independent and unchanged. Standalone players include the palette values and CSS locally, without depending on the website's shared stylesheet.

Verification:
- Regression test checked three complete palette cycles, no adjacent repeats, stable reprocessing, new hotspot assignment, and unchanged marker colors and coordinates.
- Existing saved-draft geometry preservation checks passed.
- Browser: added seven hotspots and observed all seven distinct header backgrounds with black text. Reload preserved the complete ID/color mapping.
- Actual Tutorial and Video/Demo export previews preserved that same mapping. No browser JavaScript errors were reported.

Backup: `backups/before-hotspot-header-colors-20260914-013205/`. The active builder and project database were backed up before editing. The user's live draft was not altered or reloaded during the isolated browser test. No website files were edited and nothing was published.
