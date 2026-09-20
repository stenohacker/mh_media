#!/bin/zsh

set -u

MEDIA_FOLDER="$(cd "$(dirname "$0")" && pwd)"
TEST_PAGE="$MEDIA_FOLDER/test-folder/test-1.html"
MEDIA_TEST_PORT="8124"

pause_before_closing() {
  echo
  echo "Press Return to close this window."
  read
}

if [[ ! -f "$TEST_PAGE" ]]; then
  echo "The media test page is missing:"
  echo "$TEST_PAGE"
  pause_before_closing
  exit 1
fi

server_matches_this_test() {
  local CHECK_URL="http://127.0.0.1:${MEDIA_TEST_PORT}/test-folder/test-1.html?health=$$-$(date +%s)"

  # Reuse the server only when it serves this exact mh_media test file.
  cmp -s "$TEST_PAGE" <(
    curl --silent --fail --max-time 2 "$CHECK_URL" 2>/dev/null
  )
}

open_test_page() {
  local TEST_URL="http://127.0.0.1:${MEDIA_TEST_PORT}/test-folder/test-1.html?preview=$$-$(date +%s)"

  if [[ "${MAGIC_HASHTAGS_MEDIA_TEST_SKIP_OPEN:-0}" != "1" ]]; then
    open "$TEST_URL"
  fi
}

if server_matches_this_test; then
  open_test_page
  echo "Your mh_media test page is open on port $MEDIA_TEST_PORT."
  exit 0
fi

if lsof -nP -iTCP:"$MEDIA_TEST_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $MEDIA_TEST_PORT is already used by a different local server."
  echo "Close that server, then double-click this file again."
  pause_before_closing
  exit 1
fi

cd "$MEDIA_FOLDER" || exit 1

echo "Starting the mh_media test server from:"
echo "$MEDIA_FOLDER"

if command -v ruby >/dev/null 2>&1; then
  ruby -run -e httpd . -p "$MEDIA_TEST_PORT" -b 127.0.0.1 &
elif command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$MEDIA_TEST_PORT" --bind 127.0.0.1 &
else
  echo "This Mac could not find Ruby or Python to start the local server."
  pause_before_closing
  exit 1
fi

MEDIA_TEST_SERVER_PID=$!

stop_media_test_server() {
  kill "$MEDIA_TEST_SERVER_PID" >/dev/null 2>&1
}

trap stop_media_test_server EXIT INT TERM

for ATTEMPT_NUMBER in {1..50}; do
  if server_matches_this_test; then
    open_test_page
    echo
    echo "Your media test page is open at:"
    echo "http://127.0.0.1:${MEDIA_TEST_PORT}/test-folder/test-1.html"
    echo
    echo "Keep this Terminal window open while you test the player."
    echo "Press Control+C here when you want to stop the local server."
    wait "$MEDIA_TEST_SERVER_PID"
    exit $?
  fi
  sleep 0.1
done

echo
echo "The local media test server did not start successfully."
pause_before_closing
exit 1
