#!/bin/zsh

set -u
set -o pipefail

REPOSITORY_FOLDER="$(cd "$(dirname "$0")" && pwd)"
EXPECTED_REMOTE="https://github.com/stenohacker/mh_media.git"
PRODUCTION_BRANCH="main"
NETLIFY_SITE_ID="e184f053-520e-4647-8870-bc7f6589d3dc"
NETLIFY_SITE_API="https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID"
LIVE_WEBSITE="https://iridescent-wisp-57bcb1.netlify.app"
PUBLISH_LOCK_DIRECTORY="$REPOSITORY_FOLDER/.git/mh-media-publish.lock"
PUBLISH_LOG="$REPOSITORY_FOLDER/.git/MEDIA_PUBLISH_LAST_RUN.log"

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

refresh_shapes_catalog() {
  local catalog_path="$REPOSITORY_FOLDER/shapes.csv"
  local temporary_catalog="$REPOSITORY_FOLDER/.git/shapes.csv.publishing"

  if ! ruby -rcsv -ruri -e '
    repository, output_path, live_website = ARGV
    annotation_root = File.join(repository, "images/tutorial-annotations")
    extensions = %w[.gif .jpeg .jpg .png .svg .webp]
    fixed_root_files = %w[
      link-interactive.png
      pause-audio-annotation.gif
      play-audio-annotation.png
      play-video-annotation.png
    ]

    entries = Dir.glob(File.join(annotation_root, "**", "*"), File::FNM_DOTMATCH).each_with_object([]) do |absolute_path, catalog_entries|
      next unless File.file?(absolute_path)

      relative_path = absolute_path.delete_prefix("#{annotation_root}/")
      path_parts = relative_path.split("/")
      filename = path_parts.last
      next if filename.start_with?(".")
      next unless extensions.include?(File.extname(filename).downcase)
      next if path_parts.first == "builder-toolbar"
      group = if path_parts.length == 1 && fixed_root_files.include?(filename)
        "BUILT-IN CONTROLS"
      elsif path_parts.length == 1 && filename.match?(/\Ah-[^.]+\.(?:gif|jpe?g|png|svg|webp)\z/i)
        "HOTSPOTS"
      elsif path_parts.length > 1
        path_parts[0...-1].join(" / ")
      else
        "OTHER"
      end
      name = File.basename(filename, File.extname(filename)).upcase
      encoded_path = ["images", "tutorial-annotations", *path_parts]
        .map { |part| URI.encode_www_form_component(part).gsub("+", "%20") }
        .join("/")
      catalog_entries << [group.upcase, name, "#{live_website}/#{encoded_path}"]
    end

    entries.sort_by! { |group, name, url| [group.downcase, name.downcase, url.downcase] }
    CSV.open(output_path, "wb", row_sep: "\n") do |csv|
      csv << %w[group name url]
      entries.each { |entry| csv << entry }
    end
  ' "$REPOSITORY_FOLDER" "$temporary_catalog" "$LIVE_WEBSITE"; then
    rm -f "$temporary_catalog"
    return 1
  fi

  if cmp -s "$temporary_catalog" "$catalog_path"; then
    rm -f "$temporary_catalog"
    echo "Shapes catalog is already current."
  else
    mv "$temporary_catalog" "$catalog_path"
    echo "Updated shapes.csv from the published annotation folders."
  fi
}

cleanup_publish_lock() {
  rm -f "$PUBLISH_LOCK_DIRECTORY/pid" 2>/dev/null || true
  rmdir "$PUBLISH_LOCK_DIRECTORY" 2>/dev/null || true
}

acquire_publish_lock() {
  local previous_pid=""

  if mkdir "$PUBLISH_LOCK_DIRECTORY" 2>/dev/null; then
    echo "$$" > "$PUBLISH_LOCK_DIRECTORY/pid"
    return 0
  fi

  previous_pid="$(cat "$PUBLISH_LOCK_DIRECTORY/pid" 2>/dev/null || true)"
  if [[ "$previous_pid" == <-> ]] && kill -0 "$previous_pid" 2>/dev/null; then
    return 1
  fi

  rm -f "$PUBLISH_LOCK_DIRECTORY/pid" 2>/dev/null || true
  rmdir "$PUBLISH_LOCK_DIRECTORY" 2>/dev/null || true
  if mkdir "$PUBLISH_LOCK_DIRECTORY" 2>/dev/null; then
    echo "$$" > "$PUBLISH_LOCK_DIRECTORY/pid"
    return 0
  fi
  return 1
}

netlify_deploy_field() {
  ruby -rjson -e 'data = JSON.parse(STDIN.read); print(data.dig("published_deploy", ARGV.fetch(0)).to_s)' "$1"
}

cd "$REPOSITORY_FOLDER" || exit 1

exec > >(tee "$PUBLISH_LOG") 2>&1

if ! acquire_publish_lock; then
  stop_with_message "A media publication is already running. Use its open Terminal window; do not start a second copy."
fi
trap cleanup_publish_lock EXIT INT TERM

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
echo "Updating the Shapes catalog..."
if ! refresh_shapes_catalog; then
  stop_with_message "The Shapes catalog could not be updated. Nothing was committed or pushed."
fi

echo
echo "Website changes eligible for publication:"
git status --short -- . \
  ':(exclude)tutorial-builder-work' \
  ':(exclude)tutorial-builder-work/**' \
  ':(exclude)archive' \
  ':(exclude)archive/**'

echo
echo "Builder drafts kept local and excluded from publication:"
git status --short -- tutorial-builder-work || true

echo
echo "Checking the publishable website files..."
if ! git diff --check -- . ':(exclude)tutorial-builder-work' ':(exclude)tutorial-builder-work/**'; then
  stop_with_message "A publishable website file failed the Git safety check. Nothing was committed or pushed."
fi

LARGE_FILES="$(find . -path './.git' -prune -o -path './.netlify' -prune -o -path './archive' -prune -o -path './tutorial-builder-work' -prune -o -type f -size +95M -print)"
if [[ -n "$LARGE_FILES" ]]; then
  echo
  echo "These files are too large for a normal GitHub push:"
  echo "$LARGE_FILES"
  stop_with_message "Move or reduce those files before publishing. Nothing was pushed."
fi

COMMIT_MESSAGE="Publish Magic Hashtags media $(date '+%Y-%m-%d %H:%M')"

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

if ! git restore --staged -- tutorial-builder-work 2>/dev/null; then
  stop_with_message "Git could not remove builder work from the publication list. Nothing was pushed."
fi

if ! git add -A -- . \
  ':(exclude)tutorial-builder-work' \
  ':(exclude)tutorial-builder-work/**'; then
  stop_with_message "Git could not stage the media changes. Nothing was committed or pushed."
fi

BUILDER_FILES_STAGED="$(git diff --cached --name-only -- tutorial-builder-work)"
if [[ -n "$BUILDER_FILES_STAGED" ]]; then
  echo
  echo "$BUILDER_FILES_STAGED"
  stop_with_message "Safety stop: tutorial-builder-work was found in the publication list. Nothing was committed or pushed."
fi

PUBLISH_PROBE_PATH="$(git diff --cached --name-only --diff-filter=AM | while IFS= read -r path; do
  case "$path" in
    images/*|tutorials/*|gifs/*|video/*|audio/*)
      print -r -- "$path"
      break
      ;;
  esac
done)"

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

PUBLISHED_COMMIT="$(git rev-parse HEAD)"
echo
echo "GitHub accepted commit $PUBLISHED_COMMIT."
echo "Waiting for Netlify to publish that exact commit..."

NETLIFY_READY="false"
for attempt in {1..60}; do
  DEPLOY_JSON="$(curl --silent --show-error --fail --header 'Cache-Control: no-cache' "$NETLIFY_SITE_API?check=$(date +%s)" 2>/dev/null || true)"
  if [[ -n "$DEPLOY_JSON" ]]; then
    DEPLOY_COMMIT="$(print -r -- "$DEPLOY_JSON" | netlify_deploy_field commit_ref 2>/dev/null || true)"
    DEPLOY_STATE="$(print -r -- "$DEPLOY_JSON" | netlify_deploy_field state 2>/dev/null || true)"
    if [[ "$DEPLOY_COMMIT" == "$PUBLISHED_COMMIT" && "$DEPLOY_STATE" == "ready" ]]; then
      NETLIFY_READY="true"
      break
    fi
    if [[ "$DEPLOY_COMMIT" == "$PUBLISHED_COMMIT" && "$DEPLOY_STATE" == "error" ]]; then
      stop_with_message "Netlify received the GitHub commit but reported a failed production deploy. The last-run log records where publication stopped."
    fi
  fi
  echo "Netlify is still publishing... ($attempt/60)"
  sleep 5
done

if [[ "$NETLIFY_READY" != "true" ]]; then
  stop_with_message "GitHub was updated, but Netlify did not confirm the matching production deploy within five minutes. The commit is safe; check the deploy dashboard."
fi

if [[ -n "$PUBLISH_PROBE_PATH" ]]; then
  ENCODED_PROBE_PATH="$(ruby -ruri -e 'puts ARGV.fetch(0).split("/").map { |part| URI.encode_www_form_component(part).gsub("+", "%20") }.join("/")' "$PUBLISH_PROBE_PATH")"
  if ! curl --silent --show-error --fail --head "$LIVE_WEBSITE/$ENCODED_PROBE_PATH" >/dev/null; then
    stop_with_message "Netlify reports the deploy ready, but the published media verification URL did not load: $LIVE_WEBSITE/$ENCODED_PROBE_PATH"
  fi
  echo "Verified live media: $LIVE_WEBSITE/$ENCODED_PROBE_PATH"
fi

echo
echo "SUCCESS: GitHub and Netlify both confirmed the media publication."
echo "$LIVE_WEBSITE"
echo "Last-run log: $PUBLISH_LOG"
pause_before_closing
