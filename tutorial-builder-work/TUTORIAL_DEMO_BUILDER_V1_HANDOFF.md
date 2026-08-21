# Tutorial Demo Builder v1 — Handoff

Last updated: 2026-08-20

## Purpose and safety boundary

`tutorial-demo-builder-v1.html` is the separate builder for click-to-play,
video-like demos. It exports one standalone HTML page that can be published as
an unlisted page and embedded in the Reporter Tools modal.

Do not add this playback system to `tutorial-builder-v3.html`. The regular V3
builder remains the protected tutorial builder.

## Authoring behavior

- The global default slide duration and the current slide's timing controls are
  beside **Slides and main media**.
- Each slide advances by the global default, its own manual duration, or the end
  of its Slide Audio URL.
- Audio-timed slides wait 500 milliseconds after the audio ends before advancing,
  giving the narration a small breathing pause.
- If slide audio cannot load or play, the slide falls back to its timer.
- A brand-new slide starts centered at 100% zoom.
- A duplicated slide intentionally keeps the source slide's size, crop, zoom,
  and position.
- The old audio-annotation input is not present in this builder. Slide Audio is
  attached to the main slide instead.

## Exported demo behavior

- Export creates a standalone `*-demo.html` file with embedded CSS and JavaScript.
- The demo never starts by itself. The visitor must click **Play Demo**.
- Controls include Play/Pause, Restart, a draggable navigation slider, and
  elapsed/total time.
- Closing the Reporter Tools modal removes the iframe and stops playback.
- The exported page suppresses its own site header because the parent modal owns
  Close and Tutorial navigation.
- The export includes `noindex, nofollow`. This keeps it out of normal search
  indexing, but it is unlisted—not password-protected.

## Publishing and activating the iframe

1. Build the demo and export its HTML.
2. Add the exported HTML to the website and publish it.
3. Confirm the public URL opens and works on desktop and phone.
4. Put that URL in the matching tool's `modalDemoUrl` field in
   `/Users/tamchap/Dev/website/site-lib/reporter-tools.json`.
5. Publish the website. Until step 4, the catalog value stays blank and the
   current Reporter Tools modal is unchanged.

Allowed iframe origins are the current website origin and
`https://iridescent-wisp-57bcb1.netlify.app`.

## Regression checks

Run from `/Users/tamchap/Dev/mh_media`:

```sh
ruby scripts/audit-tutorial-demo-builder-v1.rb
ruby scripts/audit-tutorial-builder-v3.rb
```

The demo audit verifies click-to-play playback, slider/pause/restart wiring,
per-slide timing and audio, iframe cleanup and URL validation, phone sizing,
and that regular V3 image-transform and duplicate-slide behavior did not drift.
The main-folder `PUBLISH MEDIA WEBSITE.command` runs both audits automatically
before it permits a commit or push.
