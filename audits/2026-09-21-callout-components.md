# Callout flashcard components — 2026-09-21

Added Make a note, Caution, and Troubleshooting checkboxes below a selected callout in `tutorial-demo-builder-v2.html`. A checkbox transforms the existing callout; checking the active style again restores its original formatting. Words, geometry, group membership, rotation, layer order, and subsequent text edits survive. Locked callouts are not transformed. Copying component formatting preserves the destination's original formatting for later restoration.

Reference: the three handmade cards visible in Tutorial Draft 3, saved project `project-20260922004824-c5b43b3d`. Those reference assemblies were not modified. Reproduced the white square flashcard, two-pixel outline, mint/yellow/black side strips, five slightly uneven faint rules, handwritten body, and reversed Impact title on matching colored tape with a small one-pixel shadow and slight tilt. The card itself has no shadow. Embedded the same make-note hand, caution triangle, and troubleshooting artwork visible in the samples.

The component renderer is shared by the builder, tutorial/demo players, reading-page rendering, and contents previews. Icons are embedded as data URLs; existing embedded fonts remain intact. Exported players contain no transformation controls. The active source's embedded project-state is unchanged byte-for-byte. No project store was edited. Source and current project stores were backed up in `backups/2026-09-21-before-callout-components/`.

Validation:
- Browser fixture: 70 assertions covering all variants, restoration, preservation, lock, rules, tape/card shadows, and embedded icons.
- Actual checkbox clicks switched all three styles. Once controls were visible, the screen scroll position and callout rectangle remained exactly unchanged. Text could be edited; Escape cleared focus and selection; reload retained text and component.
- Generated tutorial and demo standalone exports. With external image/font loads blocked, all component icons and all five embedded font faces loaded. Contents previews retained component styles and did not contain editable controls. Visually inspected generated flashcards, including the distinct tape shadow and flat card.
- Node checks passed: callout-components, draft-integrity, scaling-interactions, curved-arrow-text, builder-viewport-fit, published-export-contract, shift-path-drag, group-selection-geometry, resize-format-preservation, and copy-paste-properties. The copy-properties test harness now loads the component definitions and verifies restoration data on the destination.
- The three older V1 canonical filenames named in the handoff remain absent; only active V2 was changed. No website files or published exports were modified.

The user continued editing the live Chrome draft during validation. It was not reloaded automatically; refresh once after the current edit is saved to load the installed runtime.
