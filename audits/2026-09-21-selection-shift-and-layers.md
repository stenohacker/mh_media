# Selection, scaling, Shift drag, and layer shortcuts

Updated only the active V2 builder. The former three V1 builder files no longer exist. Website and published exports are unchanged.

- Shift-drag constrains line/arrow translation to horizontal or vertical; Shift-click still toggles selection. Shift endpoint drag straightens the path on the nearest horizontal/vertical axis while keeping the opposite endpoint fixed.
- A shared four-corner selection frame uniformly scales unlocked selected/grouped objects, including positions, dimensions, and text content scale. Locked objects are excluded. Undo/redo and save preserve the transform.
- Left-drag a rectangle from empty stage space or a locked screenshot to select enclosed unlocked objects. Shift adds to the selection. The rectangle never scrolls the page or moves objects.
- Escape saves active text, clears focus/selection, closes the active selection rectangle, and removes editing guides.
- All four layer actions are available in the dropdown beside the existing front/back buttons. Plain brackets now also work in annotation editors; Control+brackets send to back/front. Unrelated title/URL/metadata fields keep ordinary brackets.
- New lines/arrows/circles/squares retain the requested explicit strokeWidth 2; all eight solid/dotted creation checks passed. Existing authored weights remain unchanged.

Validation: 194 browser-harness assertions passed against the patched runtime, including all four shared corners, grouped and separate selections, canvas bounds and page scroll stability, locked objects, selection add/remove, Escape while editing, layer menu commands, actual CSS stacking order, all shortcuts while editing, and undo/redo. Real mouse drags confirmed shared scaling and rectangle selection. Real keyboard input confirmed Escape, [, ], Control+[, Control+] with annotation text preserved. Separate geometry tests cover rotated endpoints and mixed image/text/arrow groups across wide and tall stages.

Backups: backups/2026-09-21-before-selection-and-shift-drag (active HTML and on-disk project store plus its backup). Embedded project-state was verified byte-identical. Project data was not edited by this patch. Isolated browser fixture and detailed patch scripts are in the Codex workspace work/shift-line-drag folder.

Post-install validation: all seven audit scripts passed — draft-integrity, scaling-interactions, curved-arrow-text, builder-viewport-fit, published-export-contract, shift-path-drag, and group-selection-geometry. The actual working Chrome page was still being actively edited when the update was installed; its source URL and saved projects were retained.
