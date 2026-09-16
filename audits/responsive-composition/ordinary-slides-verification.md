# Ordinary first page and background repair — September 14, 2026

Active file: `/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html`.

The first page is an ordinary slide. Old saved `cover` values normalize to `image`; no extra cover is inserted. New and empty ordinary slides get `0913background.png`. Existing custom backgrounds remain intact, and the old cover migration no longer resets the first background's position or scale. Page one supports the same rename, duplicate, reorder and delete operations; at least one page must remain.

B2 is now **Slide background**, with **Apply default background** and **Choose background image…**. Applying or replacing a background leaves annotations and hotspots intact. Drafts images remain separate annotations for manual positioning and resizing. The bottom media area now labels this distinction explicitly.

The local builder resolves its media-site URLs against the local media server, including Drafts screenshots. Saved URLs remain public URLs for exports. This avoids requiring an image to be published before it appears in the local builder. Background selection now returns after the initial folder connection instead of trying to open a second picker after that gesture was consumed.

Backup: `backups/before-cover-background-20260914-004958/`, including builder and project database. Embedded `project-state` remains byte-for-byte unchanged. No saved project was rewritten by the repair script. The user continued editing the new `TOOLS-APPEARANCE-PAGES-DEMO` draft during this work; its live tab was not reloaded.

Validation:
- `ordinary-slides.test.mjs`: JavaScript parsing, new/empty defaults, custom background preservation, real saved-draft IDs/order and annotation/hotspot geometry, independent background replacement, first-page duplication/movement/deletion, no automatic cover reinsertion, local Drafts image resolution.
- `bounds.test.mjs`: prior responsive composition behavior remains passing.
- Browser test before the final ordinary-page migration: default image loaded at 6806 × 3522; applying it replaced the current background without adding a page; Add Slide used the same image; the replacement command opened the native picker.
- The final isolated builder loaded in Chrome and exposed **Slide background** and **Choose background image**, plus the explanation that Drafts screenshots are separate objects.
- Final interactive verification is currently blocked by Chrome reporting another extension UI is open. The exact error originally reported by the user has not been reproduced, so the repair does not claim that every possible picker error has been resolved.

The two earlier exported sample repairs were not regenerated during this background-only follow-up. Future exports use the updated builder runtime. Nothing was published, and no current website files were changed.
