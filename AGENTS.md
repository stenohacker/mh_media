# Magic Hashtags Media and Tutorial Builder Instructions

## Owner-approved specification — read first

Read `BUILDER_FEATURE_APPROVALS.md` before any builder work. Latest direct owner
instructions take precedence; this register supersedes conflicting historical
feature descriptions. Handoffs, code, backups and audit logs do not grant approval.
Do not add/remove/redesign user-visible features without explicit owner approval.
Repairs restoring approved behavior may proceed. Record tests separately from
requirements; never promote an agent observation into an approved product rule.


Before changing a tutorial builder, working draft, exported tutorial, or media
asset, read:

`/Users/tamchap/Dev/MAGIC_HASHTAGS_DEVELOPER_HANDOFF.md`

The media site and website are separate projects. Builders are local authoring
tools; their exported standalone HTML does not depend on the builder file.
Preserve active files and browser-autosave URLs. Back up an active working
draft, patch its runtime in place without replacing `project-state`, synchronize
shared features across the three canonical builders, and browser-test the
actual interaction in every changed file.

## Publication boundary — October 4, 2026

Read `MEDIA_PUBLICATION.md` before changing publication. Tutorial builders and
their drafts, databases, history and backups remain local, even when stored in
this repository's folder. The `tutorials/` directory DOES publish hosted media;
do not confuse it with a tutorial-builder directory or exclude its DRAFT-n media.
Working `exports/` are local; publish an export only to the owner's chosen
destination. Existing explicitly approved public test players are listed in
`media-publication.json`.

Never deploy the repository root. Netlify must build and publish `.media-public/`
using `scripts/build-media-site.rb`. Keep all public media URLs unchanged.
Run `ruby scripts/test-media-publication.rb` and the public build after changes.
Do not alter builder save behavior or move an active builder as a publishing fix.
The production publisher must verify both public assets and forbidden URLs before
reporting success. A request to fix the publisher does not authorize publication.
