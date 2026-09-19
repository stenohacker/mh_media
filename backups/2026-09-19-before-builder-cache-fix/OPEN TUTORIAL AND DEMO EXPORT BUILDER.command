#!/bin/zsh

set -u
set -o pipefail
setopt NO_BG_NICE

BUILDER_FOLDER="$(cd "$(dirname "$0")" && pwd)"
BUILDER_FILE="tutorial-demo-builder-v2.html"
SERVER_FILE="tutorial-demo-builder-server.rb"
BUILDER_PORT="8765"
BUILDER_URL="http://127.0.0.1:${BUILDER_PORT}/${BUILDER_FILE}"
HEALTH_URL="http://127.0.0.1:${BUILDER_PORT}/__tutorial_builder/health"
SERVER_LOG="/tmp/magic-hashtags-tutorial-builder-${BUILDER_PORT}.log"
SERVER_PID_FILE="/tmp/magic-hashtags-tutorial-builder-${BUILDER_PORT}.pid"

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

builder_is_ready() {
  local health=""

  health="$(curl --silent --show-error --fail --max-time 1 "$HEALTH_URL" 2>/dev/null)" || return 1
  [[ "$health" == *'"service":"magic-hashtags-tutorial-builder"'* ]] \
    && [[ "$health" == *'"version":4'* ]]
}

stop_previous_builder_server() {
  local recorded_pid=""
  local port_pids=""
  local candidate=""
  local owns_port="false"

  [[ -f "$SERVER_PID_FILE" ]] || return 1
  recorded_pid="$(< "$SERVER_PID_FILE")"
  [[ "$recorded_pid" == <-> ]] || return 1
  port_pids="$(/usr/sbin/lsof -nP -iTCP:"$BUILDER_PORT" -sTCP:LISTEN -t 2>/dev/null)"
  for candidate in ${(f)port_pids}; do
    [[ "$candidate" == "$recorded_pid" ]] && owns_port="true"
  done
  [[ "$owns_port" == "true" ]] || return 1

  # Only replace the exact process recorded by this launcher and confirmed as
  # the listener on this builder's port. Never stop an unrelated application.
  /bin/kill "$recorded_pid" 2>/dev/null || return 1
  for attempt in {1..30}; do
    /bin/kill -0 "$recorded_pid" 2>/dev/null || return 0
    sleep 0.1
  done
  return 1
}

open_builder() {
  if [[ "${MAGIC_HASHTAGS_BUILDER_SKIP_OPEN:-0}" == "1" ]]; then
    return 0
  fi
  if [[ -d "/Applications/Google Chrome.app" ]]; then
    /usr/bin/open -a "Google Chrome" "$BUILDER_URL"
  else
    /usr/bin/open "$BUILDER_URL"
  fi
}

if [[ ! -f "$BUILDER_FOLDER/$BUILDER_FILE" ]]; then
  stop_with_message "The Tutorial + Demo Export Builder file is missing from the mh_media folder. Nothing was opened."
fi
if [[ ! -f "$BUILDER_FOLDER/$SERVER_FILE" ]]; then
  stop_with_message "The Demo Builder V2 connection file is missing from the mh_media folder. Nothing was opened."
fi

if builder_is_ready; then
  echo "The local builder connection is already running."
  echo "Opening the Tutorial + Demo Combo Builder..."
  open_builder
  exit 0
fi

if /usr/sbin/lsof -nP -iTCP:"$BUILDER_PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Updating the private local builder connection..."
  stop_previous_builder_server \
    || stop_with_message "Port $BUILDER_PORT is being used by another app. No unrelated process was stopped."
fi

echo "Starting the private local builder connection..."
SERVER_PID="$(
  /usr/bin/ruby -e '
    log_path, folder, port = ARGV
    log = File.open(log_path, "a")
    pid = Process.spawn(
      "/usr/bin/ruby", File.join(folder, "tutorial-demo-builder-server.rb"), folder, port,
      in: "/dev/null", out: log, err: log, pgroup: true
    )
    log.close
    Process.detach(pid)
    print pid
  ' "$SERVER_LOG" "$BUILDER_FOLDER" "$BUILDER_PORT"
)"
if [[ "$SERVER_PID" != <-> ]]; then
  stop_with_message "The local builder connection could not start a server process. Nothing was opened."
fi
print -r -- "$SERVER_PID" > "$SERVER_PID_FILE"

for attempt in {1..30}; do
  if builder_is_ready; then
    echo "Opening the Tutorial + Demo Combo Builder in Chrome..."
    open_builder
    exit 0
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    break
  fi
  sleep 0.1
done

stop_with_message "The local builder connection did not start. The diagnostic log is $SERVER_LOG"
