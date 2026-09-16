# Retired cream palette and title-card editing controls — 2026-09-14

## Cause and repair

The live V2 palette still included `#fff7c8`, despite the existing legacy color migration mapping it to `#e1e2e7`. Header normalization and automatic assignment bypassed that migration. The shared website `--color-off-white` token also retained cream.

- Replaced the palette entry and shared website token with existing page gray `#e1e2e7`; removed the nearby cream copying-status background.
- Migrated saved callout/hotspot headers before validating/assigning colors, preserving explicit colors as gray instead of randomly choosing a replacement.
- Applied the same migration to saved text/highlight/underline styles (including browser-serialized RGB), outlines, and appearance colors.
- Retired cream literals in the older local authoring tools and standalone tutorial copies. Archived backups and saved project JSON retain original data; live V2 migrates colors when loading.
- Bumped shared stylesheet consumers to `20260914-palette-1`.

In a copy of the latest saved project, slide 4's title card had z=4 and was covered by transparent text boxes at higher layers. All four footer controls and both Move handles failed hit testing before the change. Selecting text/title/callout annotations now raises the editing view within an isolated builder stage. The saved z value is unchanged; player mode keeps the authored stacking order.

The title card already contained body-left, pipe, numbered, and Header only actions; the overlap made them inaccessible. Header remains black. No content replacement or geometry reset was needed.

## Verification

Real browser interaction in an isolated project copy:
- Both side Move handles and all four title-card buttons pass elementFromPoint hit testing.
- Left handle moved the card 30 px left and 10 px up; right handle moved it back. Saved z stayed 4.
- Header only hid the body and restored existing styled content.
- Centered title plus left body override worked.
- Pipe and numbered buttons changed the body line, retained inline highlights/underline, and survived reload.
- Original saved cream callout became gray and stayed gray on reload.
- Visual check confirmed black title header, both Move handles, footer controls, and gray callout.

Website/browser checks:
- Reporter Tools loaded stylesheet `site-system.css?v=20260914-palette-1`; computed off-white token is `#e1e2e7`.
- Appearance demo opened in its viewer and played with Pause/timeline/replay controls.
- Four dated standalone exports loaded in player mode; no rendered cream backgrounds.
- Older demo/centered/video-page/v3 authoring tools and two older Appearance copies loaded without cream stylesheet or rendered backgrounds.

Automated checks passed:
- hotspot-header-colors.test.mjs: palette cycles, stable assignments, cream-to-gray migration including RGB text styles.
- cards-drafts-popup.test.mjs: card features, saved content, title-only restoration, normalized legacy colors, rich-text colors, Drafts, and video controls.
- text-controls.test.mjs: underline, bold, highlight across eight text fields and both serializers.
- Website `ruby scripts/run_release_checklist.rb`: all local links/media/architecture checks and 340 release checks passed.
- Every changed HTML project-state block was preserved byte-for-byte. No project database writes.

Backups and change hashes: `../../backups/before-card-palette-20260914/manifest.json`.
