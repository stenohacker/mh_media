# Standalone logo, fonts, and tutorial title bar — 2026-09-21

Updated only the active V2 builder. Canonical V1 builders referenced in the older handoff are absent; QA fixtures and old exports were not treated as authoring tools.

- Embedded the exact bytes of images/new-logo-nav.png (Tamara's Steno Hacks / Tech Tips & AI Tools for Reporters) in site-header-logo-art. Both export types reuse the embedded image, without a logo fetch or old hosted fallback.
- Preserved all five embedded font faces byte for byte. Added a guard requiring the normal and true-italic variable Hanken Grotesk faces, Impact Label, Impact Label Reversed, and Shadows Into Light Two before export; missing font data stops export instead of producing a substituted-font file.
- Added a 68px white top bar inside the tutorial frame, matching the user's Group d.png reference. It has a centered title in embedded Impact Label Reversed and a 40px boxed X at the right, outside the authored composition. The builder title field edits tutorial.title; both title inputs stay synchronized. Demo chrome remains separate.
- Included the title row in frame fitting. No slide coordinates, cropped-image settings, locks, or authored project JSON changed.

Verification in isolated browser fixtures:
- Actual buildExportHtml for both tutorial and demo: five embedded font faces, zero external font links, exact new-logo bytes, retained slide data preserved.
- Missing-font fault case rejected by the export guard.
- Exported tutorial tested with CSP blocking external fonts/images and all connect requests: all five faces loaded (including Hanken 600 and italic), and logo decoded at 7523 x 3743.
- Typed Appearance Pages in the header: stage x/y/width/height and scroll position were identical before and after input.
- Export retained APPEARANCE PAGES; centered title's midpoint matched the bar midpoint; X remained within the header above the stage; bottom navigation fit inside the viewport.
- Clicking the moved X returned to the opening page with the embedded logo and Start control.

The website was not edited or published. Existing downloaded HTML needs to be exported again to receive these updates. Browser-only test changes stayed in an isolated fixture; the active project was preserved.

Post-install checks passed: draft-integrity.test.mjs, builder-viewport-fit.test.mjs, published-export-contract.test.mjs. Reloaded the saved active Chrome draft and visually verified the centered TUTORIAL TITLE input and top-right boxed X; latest arrow text and image locks remained present.
