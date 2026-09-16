# URL-only link image — September 14, 2026

Updated the active `tutorial-demo-builder-v2.html` so **Add link** opens a dialog containing only **Link URL**. A valid submission adds the user's new `images/tutorial-annotations/link-annotation.png` as a movable image annotation with the entered destination. Cancel and rejected URLs do not add an annotation. Existing text-link rendering is retained for saved content.

The new image is 561 × 542 pixels. Its initial annotation frame uses the matching aspect ratio. The exported player wraps the image in a hyperlink that opens in a new tab with `noopener noreferrer`.

The new image was unavailable at its hosted URL during testing. Exports now embed this small link icon once as data in the standalone HTML and use that embedded image in both player modes. The builder continues to read the local source image, so the exported copy captures the current artwork. No deployment is needed for this icon.

Browser verification used an isolated copy of the actual builder runtime:
- Add Link dialog contained one URL input and Cancel/Add Link buttons.
- Unsupported URL rejected without adding content.
- Valid URL created one image annotation; local image loaded at 561 × 542.
- Cancel left the annotation count unchanged; reload preserved it.
- Tutorial export preview loaded the embedded icon and retained the full destination including query parameters and fragment. Clicking it opened that exact URL in a new tab.
- Video/Demo export preview also loaded the embedded icon and retained its destination.
- No browser JavaScript errors after the completed repair. Builder JavaScript parsed.

Backup: `backups/before-link-image-dialog-20260914-012749/`, including the builder and project database. Embedded project-state was preserved; the user's active draft was not modified or reloaded during testing. Only the requested current V2 builder was edited; nothing was published.
