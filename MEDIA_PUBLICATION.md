# Media publication

Double-click `PUBLISH MEDIA WEBSITE.command` only when ready to publish.
The launcher stages eligible media and publisher code, builds a separate public
folder, pushes the commit, waits for Netlify to publish that exact commit, then
checks both working public URLs and blocked internal URLs. Its Terminal summary
is short; `.git/MEDIA_PUBLISH_LAST_RUN.log` records the run.

## What goes online

- Media under `images/`, `gifs/`, `audio/`, `video/`, and `tutorials/`, plus fonts.
- All existing tutorial media, including the media inside `tutorials/DRAFT-1/`.
  A hosted media folder with DRAFT in its name is not a builder draft database.
- Public catalogs and browser runtime dependencies listed in `media-publication.json`.
- The two previously published standalone test players explicitly listed there.

New HTML pages require an explicit entry in `public_pages`; they must be player
exports, never builder-mode documents. New asset formats or top-level media
directories require a deliberate update to the policy.

## What stays local

Tutorial-builder directories and root builder apps, local servers, saved draft
databases, autosaves, timestamped history, backups, audits, temporary output,
working exports, and Finder shortcuts are not deployment assets. Repository
instructions and Ruby tooling are also absent from the public build.

`tutorials/` and tutorial-builder folders have different purposes. Do not exclude
`tutorials/` to protect the builder. Do not move or rename an active builder or
change its autosave URL as a publication repair.

The local server currently saves an additional recovery snapshot at most once
per minute during saves and retains 120 snapshots per builder type. This repair
does not change that save behavior. Git exclusions and the public build keep
those recovery files off the media site.

## Enforced boundary

Netlify's `netlify.toml` builds with `ruby scripts/build-media-site.rb` and publishes
only `.media-public/`. Never run a deployment with the workspace root as its
publish directory, including manual drag-and-drop or `--dir .` deployments.

The build reads tracked eligible files, rejects symbolic links and editable
builders, requires listed public files, checks size limits, and replaces the
generated output to remove stale files. Unknown workspace directories are excluded
by default. `.gitignore` alone is not the deployment boundary.

`media-publish-files.rb` removes tracked local-only files from Git while keeping
their disk copies. Retiring old accidentally tracked files does not delete local drafts. Routine
draft-history status listings are omitted from the publisher; enforcement remains active.

## Verification

```sh
ruby scripts/test-media-publication.rb
ruby scripts/media-publish-files.rb check
ruby scripts/build-media-site.rb
```

The build includes only tracked media. The publication launcher stages eligible
new media before building. To check the deployed site without publishing:

```sh
ruby scripts/verify-media-deploy.rb
```

The live check is expected to fail until this repair is actually published,
because the previous deployment still contains temporary output and internal
files. No publication was performed while preparing this repair.

## Hosted downloads

`downloads/` is for deliberately public PDF, TXT, CSV, RTF, DOCX, XLSX, PPTX, ZIP and JSON downloads. Put only files intended for viewers here. The publisher includes eligible tracked files and sends attachment and cross-origin headers. Publish newly added files before using their URLs in exported players. Builder drafts, hidden files, backup and audit folders remain excluded.
