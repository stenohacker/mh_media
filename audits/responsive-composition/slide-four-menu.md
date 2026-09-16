# Slide 4 and menu repair — September 14, 2026

The reported example was reproduced from `Downloads/tutorial-title (28).html`.
Slide 4 had the supplied 0913 background but lacked `backgroundLayout`, so it
used a 1500×900 canvas while adjacent slides used 1500×776.227. The player also
fitted each slide's different annotation bounds separately and applied a scale
transition while loading. Together these changed the visible background size
when navigating.

The V2 builder now recognizes the supplied background on existing image slides,
including slides with annotations. A tutorial-wide union of composition bounds
reserves all authored off-canvas content and holds the viewport scale steady
across Next/Back. The loading fade no longer scales the page. Saved background
transforms and object coordinates remain unchanged; unrelated legacy screenshots
retain their original coordinate system.

The menu panel, slide buttons, numbered badges, close button and builder menu
actions now have no box shadow. This matches the explicit shadow-free styling
in the local website's `reporter-tools.html`.

Browser verification:

- Latest export: slides 3, 4 and 5 measured 1308.237×676.990 at the desktop viewport,
  including returning to slide 4 in both directions. Scale remained 0.8721582521.
- At a 375×667 viewport, slides 3 and 4 both measured 291.408×150.799, with navigation
  ending at y=352.052. The mobile menu stayed inside the viewport and all its panel,
  button and number shadows computed to `none`.
- Checked the new fixed export, earlier fixed tutorial, Appearance slides,
  Appearance demo and website demo. Tutorial menus/navigation and demo seek,
  replay/pause worked. Checked the builder menu using an isolated source copy.
- Passed navigation-frame regression, bounds, background workflow, ordinary
  slides, scroll navigation, and all 340 website release checks.

Updated the builder and existing local player runtime/CSS without replacing their
embedded project-state data. The repaired copy of the latest download is
`exports/2026-09-14/tutorial-title-28-slides-fixed.html`. The original download and
draft database were not edited. State hashes are recorded in
`slide-four-state-preservation.json`; backups are in
`backups/before-slide-four-menu-20260914/`. Nothing was published.
