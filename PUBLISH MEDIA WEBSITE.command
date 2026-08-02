#!/bin/zsh

set -u

REPOSITORY_FOLDER="$(cd "$(dirname "$0")" && pwd)"
EXPECTED_REMOTE="https://github.com/stenohacker/mh_media.git"
PRODUCTION_BRANCH="main"
NETLIFY_SITE_ID="e184f053-520e-4647-8870-bc7f6589d3dc"
NETLIFY_DASHBOARD="https://app.netlify.com/projects/iridescent-wisp-57bcb1/deploys"
LIVE_WEBSITE="https://iridescent-wisp-57bcb1.netlify.app"

pause_before_closing() {
  echo
  echo "Press Return to close this window."
  read
}

stop_with_message() {
  echo
  echo "$1"
  pause_before_closing
  exit 1
}

remove_tracked_repository_junk() {
  local tracked_path

  while IFS= read -r -d '' tracked_path; do
    case "$tracked_path" in
      .DS_Store|*/.DS_Store|archive/*|node_modules/*)
        git rm --cached --ignore-unmatch -- "$tracked_path" >/dev/null || return 1
        ;;
    esac
  done < <(git ls-files -z)
}

cd "$REPOSITORY_FOLDER" || exit 1

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  stop_with_message "This folder is not the Magic Hashtags media repository. Nothing was pushed."
fi

ACTUAL_REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [[ "$ACTUAL_REMOTE" != "$EXPECTED_REMOTE" ]]; then
  stop_with_message "The GitHub destination does not match the approved media repository. Nothing was pushed."
fi

if [[ ! -f ".netlify/state.json" ]] || ! grep -q "$NETLIFY_SITE_ID" ".netlify/state.json"; then
  stop_with_message "This folder is not linked to the approved media Netlify site. Nothing was pushed."
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$PRODUCTION_BRANCH" ]]; then
  stop_with_message "The media repository must be on main before publishing. Nothing was pushed."
fi

if [[ -z "$(git config --get user.name)" || -z "$(git config --get user.email)" ]]; then
  stop_with_message "This repository has no Git author identity, so it cannot create a publication commit. Ask Codex to restore the repository identity; nothing was staged or pushed."
fi

echo "MAGIC HASHTAGS MEDIA — PRODUCTION PUBLISH"
echo "Live media site: $LIVE_WEBSITE"
echo "GitHub: $EXPECTED_REMOTE"
echo
echo "Pending media changes:"
git status --short

echo
echo "Running the protected Tutorial Builder and media wiring audit..."
if ! ruby scripts/audit-tutorial-builder-v3.rb; then
  stop_with_message "The media safety check failed. Nothing was committed or pushed."
fi

LARGE_FILES="$(find . -path './.git' -prune -o -path './.netlify' -prune -o -path './archive' -prune -o -type f -size +95M -print)"
if [[ -n "$LARGE_FILES" ]]; then
  echo
  echo "These files are too large for a normal GitHub push:"
  echo "$LARGE_FILES"
  stop_with_message "Move or reduce those files before publishing. Nothing was pushed."
fi

echo
echo "This will publish ALL current media changes except .DS_Store and archive folders."
echo "It will update GitHub main, which triggers the production media site."
echo
read "COMMIT_MESSAGE?Describe this publication, then press Return: "
if [[ -z "${COMMIT_MESSAGE// }" ]]; then
  COMMIT_MESSAGE="Publish Magic Hashtags media $(date '+%Y-%m-%d %H:%M')"
fi

echo
read "CONFIRMATION?Type PUBLISH MEDIA exactly to continue: "
if [[ "$CONFIRMATION" != "PUBLISH MEDIA" ]]; then
  echo "Publication cancelled. Nothing was committed or pushed."
  pause_before_closing
  exit 0
fi

echo
echo "Checking GitHub before publishing..."
if ! git fetch origin "$PRODUCTION_BRANCH"; then
  stop_with_message "GitHub could not be reached. Nothing was committed or pushed."
fi

if ! git merge-base --is-ancestor "origin/$PRODUCTION_BRANCH" HEAD; then
  stop_with_message "GitHub main has changes that are not in this folder. Ask Codex to reconcile the branch before publishing."
fi

if ! remove_tracked_repository_junk; then
  stop_with_message "Git could not remove repository-only junk. Nothing was pushed."
fi

git add -A

if ! git diff --cached --quiet; then
  echo
  echo "Files being committed:"
  git diff --cached --stat
  if ! git commit -m "$COMMIT_MESSAGE"; then
    stop_with_message "Git could not create the media commit. Nothing was pushed."
  fi
else
  echo "There are no new media file changes to commit. Checking for an unpublished commit."
fi

if ! git push origin "$PRODUCTION_BRANCH"; then
  stop_with_message "GitHub rejected the push. The local commit is safe; ask Codex to inspect the branch."
fi

echo
echo "GitHub accepted the media publication. Netlify should now update the public media site."
echo "$LIVE_WEBSITE"
open "$NETLIFY_DASHBOARD"
pause_before_closing
