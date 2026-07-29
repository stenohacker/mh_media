# Tutorial Builder V3 — Hosted Media Wiring Audit

Audit date: 2026-07-28
Remediation and release-QA pass: 2026-07-28

## Release-QA update (supersedes the initial code findings below)

The local builder/media repository now passes
`ruby scripts/audit-tutorial-builder-v3.rb`.

Fixes completed in this pass:

- Builder and exported player now use the same public tutorial-annotation
  URLs. The local builder no longer substitutes local copies that can hide a
  broken public asset.
- `shapes.csv` is a standard two-column UTF-8 CSV with 54 unique names, 54
  unique hosted URLs, encoded spaces, and an embedded builder backup list that
  matches it exactly.
- `netlify.toml` now supplies CORS and cross-origin headers for `/shapes.csv`
  in addition to media folders.
- Tutorial media URL fields now seed from an editable tutorial media folder,
  independently of the website Learn-section slug.
- Broken main image, audio, and video links now fail visibly in the builder
  and exported player.
- Draft storage ignores query strings, migrates the old query-specific key,
  saves immediately when the page is hidden or closed, and removes both keys
  on a confirmed reset.
- The v3 source and v3 handoff checklist are no longer hidden by `.gitignore`;
  working tutorial drafts remain ignored.
- All 19 shared PNGs over 2048px were reduced to a 2048px maximum dimension
  while preserving transparency and filenames.
- Hotspot styling is now owned by the numbered slot instead of by movable step
  content. Live dragging can no longer reapply a stale color after deletion or
  renumbering.
- Hotspot Up/Down now has a code-level regression guard: it may assign only the
  adjacent `title` and `body`. It cannot reorder hotspot objects or alter IDs,
  marker numbers, PNGs, colors, geometry, stacking, locks, or grouping.
- A repeatable local release audit was added at
  `scripts/audit-tutorial-builder-v3.rb`.

Browser regression checks passed for:

- 54 shape choices and hosted-only shape URLs
- visible missing-shape and missing-hotspot fallbacks
- hosted main-image success and failure
- tutorial-folder URL seeding and manual media-folder override
- normal hosted image and GIF annotations
- nested `/tutorials/tutorial-name/file.mp3` audio playback without path
  rewriting
- direct hosted video playback and modal controls
- all eight native SVG markup variants, with no markup image dependency
- autosave across reload and query-string changes
- standalone player export with hosted URLs preserved
- all nine exact hotspot PNG/color pairs in the approved order, plus slots
  10–12 repeating pink, orange, and green
- hotspot Up/Down in both the row and toolbar: only heading/body content moved;
  the adjacent slot IDs, numbers, positions, sizes, z-order, colors, and PNG
  filenames remained identical
- hotspot deletion and color reindexing, including save/reload and standalone
  player export

The media site itself is **not release-ready until its pending repository
contents are deployed**. The live manifest check still returns 14 missing
public files:

- `caution.png`
- `pointer-lines.gif`
- `pointer-no-lines.png`
- `play-audio-annotation.png`
- `pause-audio-annotation.gif`
- all nine `h-*.png` hotspot images

The local copies all exist. The yellow square seen for Caution is the correct
visible missing-image fallback; it will be replaced by the intended caution
art as soon as `caution.png` is deployed to its exact public URL.

Netlify confirms that the current production deploy was published on
2026-07-25 at 06:54 UTC from the CLI. It processed five header rules; the local
repository now has six, including the new `/shapes.csv` rule. Local `main` is
also six commits ahead of `origin/main`, and the three newest shape files are
still untracked. This explains why local and production results differ.

Files reviewed:

- `tutorial-builder-work/tutorial-builder-v3.html`
- `tutorial-builder-work/appearance-pages.html`
- `images/tutorial-annotations/`
- `shapes.csv`
- `netlify.toml`
- the live media site at `https://iridescent-wisp-57bcb1.netlify.app`
- the local and live Magic Hashtags website tutorial routes

Scope: hosted-link wiring only. Folder organization is not treated as a
requirement. After the request changed to an audit-only task, neither builder
nor the saved Appearance Pages draft was opened, reset, or edited.

## Bottom line

The builder is fundamentally URL-driven.

- It has no file picker, upload control, directory picker, `FileReader`, or
  embedded media-attachment system.
- Main images, image annotations, GIFs, audio, videos, and external links are
  saved as URL strings.
- Exported tutorial HTML preserves those URLs and requests the media from the
  host when the player opens.
- Imgur direct image/GIF links and direct media-site URLs are valid inputs.
- Shared shape, hotspot, audio-control, video-control, and link-control art is
  also referenced by URL in the exported player.

The biggest current problem is not the overall URL architecture. It is that the
local builder can display local copies of shared annotation art while the
exported player requests the public copies, and several of those public copies
currently return 404. This makes a local preview look correct even when the
export will be missing art.

There are also several extremely large PNG dimensions that are credible Safari
decode/memory failures even when their URL returns 200.

## Hosted-link path through the builder

| Builder item | How it is rendered | Hosted links supported? | Important condition |
|---|---|---:|---|
| Main image | `<img src="URL">` | Yes | Use a direct image URL, not an Imgur page URL. |
| Main GIF | `<img src="URL">` | Yes | A direct `.gif` URL animates normally. |
| Main video slide | `<video src="URL">` | Yes | The URL must return a browser-playable video file. |
| Image annotation | `<img src="URL">` | Yes | The URL must return image bytes directly. |
| GIF annotation | `<img src="URL">` | Yes | The URL must return GIF/image bytes directly. |
| Video annotation | `<video>` or YouTube `<iframe>` | Yes | Direct video files and recognized YouTube URLs are supported. |
| Audio annotation | JavaScript `Audio` object | Yes | The host must allow cross-origin audio and return a supported audio type. |
| External link | `<a target="_blank">` in export | Yes | Any valid destination URL is accepted. |
| Shape dropdown art | `<img>` | Yes | Export uses the public media-site annotation URL. |
| Hotspot art | `<img>` plus CSS fallback | Yes | Export uses the public media-site annotation URL. |
| Text annotations | Native HTML text | Not applicable | Victor Mono is loaded from Google Fonts. |
| Markups | Inline SVG | Not applicable | No hosted image is required. |

### URL preservation

- The builder does not download normal hosted media and attach it to the
  project.
- Export does not convert normal hosted media to base64.
- A hosted URL therefore has to remain valid for the exported tutorial to keep
  working.
- Image and GIF annotation URLs are preserved as entered.
- Video and link URLs are preserved as entered.
- Audio has one legacy rewrite: a URL shaped exactly like
  `/tutorials/file.mp3` is changed to `/audio/file.mp3`. URLs with any other
  path, including an additional path segment, are preserved.

### Direct URL requirements

Use:

- `https://i.imgur.com/FILE.png`
- `https://i.imgur.com/FILE.gif`
- `https://your-media-host.example/path/video.mp4`
- `https://your-media-host.example/path/audio.mp3`

Avoid:

- `https://imgur.com/POST_ID` page URLs
- share pages that return HTML instead of the image/video/audio bytes
- URLs that require a login or temporary signed token
- URLs that block hotlinking

The builder currently has no preflight validator for image, GIF, or main-media
URLs. A bad URL is accepted and saved; failure appears later as missing media.
Audio and popup video have better playback-error messages.

## Shared tutorial-annotation wiring

Public root:

`https://iridescent-wisp-57bcb1.netlify.app/images/tutorial-annotations/`

Local root used by a local builder preview:

`../images/tutorial-annotations/`

This split is important:

- A local builder opened from `file:`, `localhost`, or `127.0.0.1` uses local
  shared annotation art for preview.
- The exported player uses the public media-site URLs.
- Therefore “I can see it in the builder” does not prove “the exported player
  can fetch it.”
- Normal user-supplied main-media and annotation URLs do not get this local
  substitution; they remain hosted URLs.

### Live shared-asset results

The complete local inventory was checked against the live media site.

#### Shape dropdown

- 54 shape entries exist locally.
- 50 of the 54 corresponding public URLs return 200.
- These four public shape URLs are missing:
  - `play-audio-annotation.png` (used by the “audio annotation” shape)
  - `caution.png`
  - `pointer-lines.gif`
  - `pointer-no-lines.png`
- The retired `audio-annotation.png` URL also returns 404. The current builder
  normalizes that old name to `play-audio-annotation.png`, but that replacement
  file still needs to be live.

All 54 local shape entries were placed and decoded successfully in the isolated
V3 Chromium audit. That confirms the local files and dropdown mappings work.
It does not change the public 404 results above.

#### Hotspots

- All nine local hotspot PNGs exist and decoded successfully.
- All nine public `h-*.png` URLs currently return 404:
  - `h-pink.png`
  - `h-orange.png`
  - `h-green.png`
  - `h-yellow.png`
  - `h-purple.png`
  - `h-mauve.png`
  - `h-mint.png`
  - `h-light-pink.png`
  - `h-coral.png`
- The player has a CSS circle fallback, so a marker can still appear when its
  PNG is absent. The intended artwork still is not being served.
- The isolated builder test confirmed that nine added hotspots cycle through
  all nine local designs.
- The isolated builder test also confirmed the visibility rule: nine unlocked
  hotspots produced one visible active marker; locking one and activating
  another produced one active marker plus one always-visible locked marker.

#### Interactive control art

| Public asset | Live result |
|---|---:|
| `play-audio-annotation.png` | 404 |
| `pause-audio-annotation.gif` | 404 |
| `play-video-annotation.png` | 200 |
| `link-interactive.png` | 200 |
| `mhnavlogo.png` | 200 |

The audio file itself and the audio-control artwork are separate URLs. Audio can
play while its play/pause picture is missing.

### Shape catalog synchronization

`shapes.csv` is fetched from the media site, but the live response does not
currently send `Access-Control-Allow-Origin`. A builder running locally or on
the Magic Hashtags website therefore cannot reliably read the live CSV
cross-origin and falls back to the shape list embedded inside the HTML.

Consequences:

- Updating only `shapes.csv` does not guarantee the local builder dropdown
  updates.
- The live CSV still contains the retired `audio-annotation.png` URL.
- The live CSV does not contain `caution`, `pointer lines`, or `pointer no
  lines`.
- The embedded fallback list and the CSV can drift apart.

## Safari risk: oversized annotation PNGs

Several annotation PNGs are compressed to a manageable file size but decode to
enormous pixel buffers. This matters more than the file size. A 14,000 × 14,000
transparent PNG can require hundreds of megabytes of decoded memory.

These local assets exceed 25 million pixels:

| Asset | Pixel dimensions | Approx. pixels |
|---|---:|---:|
| `asterisk.png` | 14,225 × 14,395 | 204.8 million |
| `upload.png` | 15,172 × 12,752 | 193.5 million |
| `computer.png` | 12,588 × 11,016 | 138.7 million |
| `textboxchat.png` | 20,000 × 4,832 | 96.6 million |
| `link-interactive.png` | 10,152 × 9,192 | 93.3 million |
| `plus.png` | 9,180 × 8,156 | 74.9 million |
| `tripple arrow.png` | 14,800 × 4,864 | 72.0 million |
| `stenokeys.png` | 14,468 × 4,876 | 70.5 million |
| `paperclip.png` | 5,472 × 7,868 | 43.1 million |
| `hashtag.png` | 6,728 × 6,284 | 42.3 million |
| `bubble  .png` | 7,032 × 5,960 | 41.9 million |
| `pin.png` | 6,408 × 6,064 | 38.9 million |

This is a likely explanation for assets that return 200 and work in Chrome but
occasionally do not appear in Safari. These are tiny on-screen annotations and
do not need source dimensions this large. A later cleanup should create
web-sized transparent copies while keeping the visual design unchanged.

## Host and CORS behavior

The media repository's `netlify.toml` configures:

- `Access-Control-Allow-Origin: *`
- `Cross-Origin-Resource-Policy: cross-origin`

for `/images/*`, `/tutorials/*`, `/gifs/*`, `/video/*`, and `/audio/*`.

That is the correct general wiring for the media site.

Important distinctions:

- Normal `<img>` display usually works cross-origin without CORS.
- Audio is explicitly created with `crossOrigin = "anonymous"`, so the audio
  host must return an appropriate CORS header.
- Direct video playback needs a browser-supported codec and benefits from
  byte-range support.
- Imgur can display direct images/GIFs, but its CORS behavior may prevent a
  future canvas/PNG export even when ordinary display works.
- The builder's PNG Slides feature is not implemented, so canvas-export CORS is
  not an active feature yet.
- `/shapes.csv` is not covered by the current CORS rules.

## Live media site versus local media files

The media site is reachable, but its deployed contents do not match the local
media repository.

Observed examples:

- Older shared shape files return 200.
- Older legacy media paths return 200.
- The current local Appearance Pages media URLs sampled under the current local
  path return 404.
- The nine hotspot files, two audio-control files, and three new shapes return
  404.

Repository state at audit time:

- `mh_media/main` is six commits ahead of `origin/main`.
- `caution.png`, `pointer-lines.gif`, and `pointer-no-lines.png` are untracked.
- Several current Appearance Pages media files are also untracked.
- The live deployment therefore cannot be assumed to match either local `HEAD`
  or GitHub `origin/main`.

Pushing the Magic Hashtags website does not publish the separate media site.
They are different repositories and different Netlify sites.

## Exported player wiring

The export is a standalone HTML player in the sense that all player code and
tutorial state are in one HTML file. It is not an offline media package.

At runtime it still requests:

- the tutorial's hosted images, GIFs, audio, and video
- shared tutorial-annotation artwork from the media site
- the Magic Hashtags logo from the media site
- Victor Mono and Shadows Into Light Two from Google Fonts
- YouTube embeds, when used

The export starts on the cover and retains the hosted URLs saved in the project.
It does not copy media into the website repository.

## Draft safety finding

This is separate from hosted-media wiring, but it is the largest project-safety
risk.

- Both builder HTML files on disk currently contain the same blank embedded
  starter state: 2 slides, 0 hotspots, and 0 annotations.
- The two builder source files are byte-for-byte identical.
- The working Appearance Pages tutorial is therefore in browser `localStorage`,
  keyed to the exact builder URL.
- The storage key includes the full file/page URL (including a query string)
  and is browser-specific.
- Renaming or moving the builder, opening it under a different URL, adding a
  query string, switching browsers, clearing site data, or resetting the
  builder can make the saved draft appear missing.
- Undo history is memory-only and disappears on reload.
- Export HTML contains a copy of the tutorial state, but there is no supported
  Import/Open Project function to load that export back into the builder.
- `tutorial-builder-work/` is ignored by Git, so the builder files themselves
  are not protected by normal repository history.

Do not reset or clear browser data before making an exported backup of the
Appearance Pages tutorial from the exact Chrome URL where it currently lives.

## Website publishing boundary

The current V3 export computes a future tutorial URL and downloads one HTML
file. Publishing that file and adding it to a website index/catalog remain
manual steps.

At audit time:

- the local new Learn-section folders and catalog files are untracked in the
  website repository
- the website `main` branch matches `origin/main`, but the large local working
  tree is not represented by that pushed commit
- the currently live old Appearance Pages route works
- the newer local Sidekicks routes tested on the live site return 404

This does not stop the builder from using hosted media URLs. It means “website
pushed” and “current local tutorial/index work is live” are not equivalent.

## What is working

- The core builder/player media model is hosted URLs, not attachments.
- There are no file-upload controls.
- Main images can use direct Imgur or media-site URLs.
- Image and GIF annotations use ordinary hosted image URLs.
- Direct hosted video and supported YouTube URLs are wired into the video
  annotation player.
- Hosted audio is wired into the audio player.
- Shared annotations use a single public media-site root in exports.
- Native markups require no hosted assets.
- Local Chromium decoded every one of the 54 local shape assets.
- Local Chromium decoded all nine local hotspot designs.
- Active-only and locked-always-visible hotspot behavior passed the isolated
  test.
- Video and link annotation control art is live.
- Media-site image/tutorial CORS headers are configured.
- Both builders currently have identical code.

## What is broken or fragile

### Priority 0 — protect before doing more work

1. The Appearance Pages draft exists in browser storage, not in the HTML file.
   Export a backup from its exact working Chrome page before resets, URL
   changes, browser cleanup, or more structural edits.
2. The public media site is behind the local annotation/media inventory.
   Local success currently hides public 404s.
3. The media and website repositories have different deployment state. A push
   of one does not update the other.

### Priority 1 — hosted-media reliability

4. Publish the nine hotspot files, both audio-control files, and the three new
   shape files to the exact public URLs used by the player.
5. Publish a corrected `shapes.csv`, and either add CORS for `/shapes.csv` or
   deliberately remove the remote fetch and treat the embedded list as the
   source of truth.
6. Resize the oversized transparent PNG annotation assets. Their decoded
   dimensions are a substantial Safari risk.
7. Add a pre-export hosted-media check that reports every URL returning 404 or
   a non-media content type. This would prevent the local-preview/public-export
   mismatch from being discovered after publishing.

### Priority 2 — workflow hardening

8. Add a supported project backup/import format, or at minimum a Download
   Project JSON function, so the working draft is not dependent on one browser
   storage key.
9. Put the builder source files somewhere tracked/backed up instead of relying
   only on the Git-ignored `tutorial-builder-work/` folder.
10. Add visible failure states for main images and main GIF/video media; these
    can currently fail with little or no explanation.
11. Add an optional “test public annotation assets” mode when the builder is
    using local annotation previews.
12. Keep “audio annotation” and “play video annotation” in the Shapes dropdown
    conceptually separate from the functional Audio and Video URL rows. A shape
    selected from the dropdown is static artwork; it does not gain audio or
    video behavior.

## Suggested order for tomorrow

1. Open the exact existing Appearance Pages builder URL in the same Chrome
   profile and export an HTML backup. Do not reset it.
2. Make a second copy of that exported HTML outside the repository.
3. Reconcile and publish the media site, then run a URL manifest check across
   all shared annotation assets.
4. Verify the public play/pause audio art and all nine public hotspot images.
5. Resize the oversized annotation PNGs before doing Safari acceptance testing.
6. Export a small test tutorial containing one of every annotation type.
7. Test that exported file in Chrome and Safari, first from disk and then from
   its hosted website URL.
8. Only after the media/player test passes, address website route/catalog
   publishing.

## Not inspected to protect current work

- The saved Appearance Pages `localStorage` draft was not opened or reset.
- Its individual stored media URLs therefore were not enumerated.
- Safari was not remotely controlled during this audit; Safari risk is based on
  live HTTP results, code inspection, and the unusually large decoded image
  dimensions.
