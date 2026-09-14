# Add Link popup implemented

Changed only tutorial-demo-builder-v2.html, following the current-builder-only scope. Backup: backups/before-link-text-popup-20260912-184712/tutorial-demo-builder-v2.html.

Add Link now opens a native modal with Link text and Link URL. Submit creates a selected link annotation with entered text and active-hotspot association. Cancel/Escape dismiss without adding an object. The permanent toolbar URL input is removed; three toolbar rows remain.

New text links appear in builder, shared HTML player renderer and contents thumbnails. Existing links without linkText retain their icon rendering. Normalization preserves the new field, which is included in saved state, duplicates and exports. Temporary dialog markup is removed from downloadable document clones.

Validation rejects blank text, malformed URLs, unsupported protocols and insertion if the slide changed.

Checks passed: JavaScript parse; embedded project-state byte equality with backup; extracted-function tests for creation/association/selection, JSON-normalization round trip, builder/player escaping and old icon links; simulated form tests for validation, submit and cancellation; source assertions for thumbnail/export wiring and three-row toolbar. These are synthetic function/DOM-double tests, not actual browser interaction.

Browser visual verification and actual save/reopen/downloaded-export tests remain unperformed because the earlier local-file browser access was blocked by URL policy. No policy workaround was attempted. No project data was edited or website published.

Earlier control/function inventory files describe the pre-change source snapshot recorded in their manifest. This note supersedes their Add Link entry.
