# Three-card controls — September 21, 2026

Updated the active `tutorial-demo-builder-v2.html` and `scripts/tutorial-reading-export.js`. Nothing was published. The active named-project URL is unchanged.

## Changes

- Restored the callout's yellow left strip, white surface, black outline, and shadow; restored the hotspot's colored frame around an inset white title; retained the title card's inset black header.
- Removed the cards' redundant formatting rows. Formatting is available through the main toolbar, with explicit Header text and Body text targets.
- Added independent title/body font, size, character spacing, line spacing, and alignment. Existing rich text remains supported, including bold, italic, underline, highlight, and current/selected-line numbered or pipe lists.
- Preserved the common card scale: scaling the whole card scales both fields together and keeps their relative sizes. Ordinary frame resizing does not change either field's font size.
- Added title-only mode for all three, preserving the hidden body and its formatting; hotspots remain collapsed in the players. Added title-container up/down controls.
- Added hotspot move handles on both sides; retained both annotation side handles. Connected card shadow toggle/size and fitting controls.
- Carried independent formatting through copy/paste, thumbnails, interactive exports, and the reading guide. Versioned the reading-guide script load to prevent stale cached behavior.

## Verification

The isolated Chrome fixture passed **107 of 107 checks**. It exercises all three card types, formatting through the toolbar, first-line list behavior and caret restoration, immediate typing, independent fields, copying without shared mutable settings, shadow rendering, title-only persistence, shared scaling measured at 1.5x, ordinary resize, side-handle presence, fitting, saved-state normalization, and generated demo/tutorial players. Reading-guide checks verify independent fonts/sizes and title-only content.

Native Chrome interactions additionally confirmed first-line numbering followed by typing, moving a callout with its left-side handle, and shrinking the whole card through its resize handle after pressing K. Both title and body shrank together.

These 12 regression suites passed after the final source changes:

- `three-card-treatment.test.mjs`
- `plain-text-list-toolbar.test.mjs`
- `resize-format-preservation.test.mjs`
- `scaling-interactions.test.mjs`
- `combined-text-controls.test.mjs`
- `copy-paste-properties.test.mjs`
- `draft-integrity.test.mjs`
- `published-export-contract.test.mjs`
- `highlight-color-routing.test.mjs`
- `hotspot-visibility-rules.test.mjs`
- `tutorial-output-checks.test.mjs`
- `tutorial-end-print.test.mjs`

## Preservation and reproduction

The embedded `project-state` block is byte-for-byte unchanged. The named project files were not replaced with the test fixture. The saved draft changed during the session; its latest state was preserved separately before the final browser reload.

The original named-project tab was reloaded successfully after showing a saved status. Its existing testing text and rich formatting remain visible, with the restored designs, new toolbar targets, and side handles. Both project JSON files are byte-for-byte unchanged by that final reload.

Backups: `backups/2026-09-21-before-three-card-controls/`. The `before-browser-reload/` subfolder preserves the later saved project state. Intermediate QA HTML copies are archived in `qa-iterations/`.

Rebuild the isolated fixture with `python3 audits/build-three-card-fixture.py`, open `http://127.0.0.1:8765/qa-three-card-verified.html`, and select **Run card verification**. It uses a separate browser autosave URL, with no named-project parameter.

Reviewable runtime diff: `audits/2026-09-21-three-card-controls.patch`.

The historical `tutorial-builder-work` builders are already absent from this checkout. This change did not recreate them, change the website, or rewrite existing published exports. Newly generated outputs receive the repaired runtime.
