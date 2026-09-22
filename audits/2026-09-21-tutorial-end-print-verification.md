# Tutorial completion and printing — September 21, 2026

> Historical verification of the native PRINT revision, not the current working file. During the final recheck, the concurrent task **tutorial fixes suggestions at end** replaced PRINT with DOWNLOAD PDF following the user's newer request there (“maybe make it export pdf instead. not a true print.”). Work in this task stopped to avoid overwriting that change. The tests below passed before that replacement; the native-print-specific test and embedded-print assertion no longer match the new PDF implementation and require reconciliation in the task owning that implementation.

## Changes

- In the tutorial completion popup, replaced “Back to [topic]” with “MAIN MENU,” preserving the existing destination URL.
- Added PRINT beside RESTART and MAIN MENU. Printing uses the complete reading-guide layout: image left, numbered expanded hotspot cards right, with continuation pages.
- After the native print dialog closes, the popup offers RESTART and MAIN MENU only. Cancel follows the same return flow. Restart returns to the beginning; finishing again offers PRINT again.
- Added duplicate-click protection, cancellation during preparation, failed-preparation retry, and an afterprint/media-query lifecycle. Browsers returning without afterprint restore the choices while retaining the printable frame for an asynchronous dialog.
- Tutorial HTML embeds the reading-layout script, so printing does not depend on the builder file or a local external JavaScript path. Demo HTML does not gain this dependency.
- Print-only CSS uses landscape Letter pages, retains colors, hides controls outside the printable content, and keeps the completion popup out of the printout. PNG/PDF screen-render layout is unchanged.

## Verification

- All 12 regression suites pass, including the new `tutorial-end-print.test.mjs`. It checks labels, destination preservation, full-guide snapshot printing, duplicate-click prevention, afterprint/media-query cleanup, asynchronous-return fallback, cancellation before preparation completes, errors/retry, page-break rules, and embedded project-state preservation.
- Exported an actual standalone tutorial through the builder UI and parsed its scripts. Its print-layout runtime is inline, not an external script URL.
- In an isolated Chrome tab: Start → final page → Finish showed RESTART, MAIN MENU, PRINT. PRINT opened Chrome's native print preview with eight pages for the three-slide long-content fixture. Visually inspected the final page layout and confirmed no completion popup or QA controls appeared in the printout.
- Canceled native print preview without printing any physical pages. Verified the popup then contained only RESTART and MAIN MENU, with focus on Restart. Restart returned to slide one with Back disabled and Next available.
- Chrome logs showed only an unrelated installed extension's `Automatic publicPath` error, not a tutorial runtime error.

Backup: `backups/2026-09-21-before-tutorial-end-print/`. The embedded project-state remains byte-for-byte unchanged. Named projects/history were not edited and the user's active builder was not reloaded. Only the temporary Chrome QA tab was closed. Legacy sibling builders remain absent; they were not recreated. Concurrent changes were preserved. Nothing was deployed.

Existing exported tutorials need to be exported again to receive the new controls. This focused verification does not complete the broader builder audit.

Lifecycle reference: [MDN afterprint event](https://developer.mozilla.org/en-US/docs/Web/API/Window/afterprint_event) — print preview closure is observable, but a webpage cannot confirm that paper physically printed.
