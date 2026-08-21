#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"

ROOT = File.expand_path("..", __dir__)
WEBSITE = File.expand_path("../website", ROOT)
DEMO_BUILDER = File.join(ROOT, "tutorial-builder-work", "tutorial-demo-builder-v1.html")
REGULAR_BUILDER = File.join(ROOT, "tutorial-builder-work", "tutorial-builder-v3.html")
REPORTER_TOOLS = File.join(WEBSITE, "reporter-tools.html")
SHOWCASE = File.join(WEBSITE, "site-lib", "reporter-tools-showcase.js")
CATALOG = File.join(WEBSITE, "site-lib", "reporter-tools.json")

errors = []
check = lambda do |condition, message|
  errors << message unless condition
end

[DEMO_BUILDER, REGULAR_BUILDER, REPORTER_TOOLS, SHOWCASE, CATALOG].each do |path|
  check.call(File.file?(path), "Missing required file: #{path}")
end

if errors.empty?
  demo = File.read(DEMO_BUILDER)
  regular = File.read(REGULAR_BUILDER)
  reporter_tools = File.read(REPORTER_TOOLS)
  showcase = File.read(SHOWCASE)
  catalog = JSON.parse(File.read(CATALOG))

  check.call(demo.include?("<title>Tutorial Demo Builder v1</title>"),
             "The copied builder is not visibly identified as Demo Builder v1.")
  check.call(demo.include?('const IS_DEMO_PLAYER = MODE === "player" && document.body.dataset.demoPlayer === "true";'),
             "Exported demo mode is not isolated from the regular player.")
  check.call(demo.include?('state.meta.demoDefaultDuration = clamp(') &&
             demo.include?('timing: ["default", "manual", "audio"]') &&
             demo.include?('audioUrl: String(slide?.demo?.audioUrl || "")'),
             "Default/manual/audio timing is not normalized per slide.")
  check.call(demo.include?('id="demoTimingMode"') &&
             demo.include?('id="demoSlideDuration"') &&
             demo.include?('id="demoSlideAudioUrl"') &&
             demo.include?('id="demoDefaultDuration"'),
             "Slide timing or Slide Audio controls are missing from Slides and main media.")
  check.call(!demo.include?('${annotationInputRow("audio", "Audio", icon("audio"))}'),
             "The demo builder still exposes the old audio-annotation input.")

  check.call(demo.include?('data-action="demo-toggle"') &&
             demo.include?('data-action="demo-restart"') &&
             demo.include?('data-demo-seek type="range"') &&
             demo.include?('function pauseDemoPlayback()') &&
             demo.include?('function commitDemoSeek(value)') &&
             demo.include?('function advanceDemoPlayback()'),
             "Click-to-play, Pause, Restart, seek, or auto-advance wiring is incomplete.")
  check.call(demo.include?('audio.onended = () =>') &&
             demo.include?('timing === "audio"') &&
             demo.include?('const DEMO_AUDIO_END_DELAY_MS = 500;') &&
             demo.include?('scheduleDemoTimer(DEMO_AUDIO_END_DELAY_MS);') &&
             demo.include?('scheduleDemoTimer(') &&
             demo.match?(/function scheduleDemoTimer\(milliseconds\).*?window\.clearTimeout\(demoTimer\)/m),
             "Slide audio cannot control delayed advancement or fall back to a timer.")
  check.call(!demo.match?(/<audio\b[^>]*\bautoplay\b/i) &&
             !demo.include?('.autoplay = true'),
             "The demo can start audio without the required Play click.")
  check.call(demo.include?('exportBody.dataset.demoPlayer = "true"') &&
             demo.include?('"name", "robots", "noindex, nofollow"') &&
             demo.include?('renderSiteHeader() : ""') &&
             demo.include?('!IS_DEMO_PLAYER ? renderSiteHeader()'),
             "The exported hidden page is missing embed mode, noindex, or header suppression.")
  check.call(!demo.include?("applyExportSiteStyles") && !demo.include?("/styles/site-system.css"),
             "The demo export depends on the shared website stylesheet.")
  check.call(demo.include?("@media (max-width: 620px)") &&
             demo.include?(".demo-playback-controls") &&
             demo.include?("grid-template-columns: 1fr 1fr;"),
             "The embedded controls do not have a phone layout.")

  %w[nudgeMedia zoomMedia resetMedia].each do |name|
    pattern = /    function #{name}\([^)]*\) \{.*?\n    \}/m
    check.call(demo[pattern] == regular[pattern],
               "#{name} drifted from regular V3; demo work must not alter image transforms.")
  end
  duplicate_pattern = /    function duplicateSlide\(\) \{.*?(?=\n    function deleteSlide\(\))/m
  check.call(demo[duplicate_pattern] == regular[duplicate_pattern],
             "Duplicate-slide crop/zoom behavior drifted from regular V3.")
  check.call(!regular.include?("DEMO_DEFAULT_DURATION") &&
             !regular.include?("demoSlideAudioUrl") &&
             !regular.include?("IS_DEMO_PLAYER"),
             "Demo playback code leaked into the regular V3 builder.")

  check.call(showcase.include?("modalDemoUrl: tool.modalDemoUrl || \"\""),
             "Reporter Tools showcase does not carry modalDemoUrl.")
  check.call(reporter_tools.include?("tool.modalDemoUrl") &&
             reporter_tools.include?('document.createElement("iframe")') &&
             reporter_tools.include?('activeDemoFrame.src = "about:blank"') &&
             reporter_tools.include?('function safeModalDemoUrl(value)') &&
             reporter_tools.include?('const modalDemoUrl = safeModalDemoUrl(tool.modalDemoUrl)') &&
             reporter_tools.include?("event.source !== activeDemoFrame.contentWindow") &&
             reporter_tools.include?("allowedDemoOrigins.has(event.origin)"),
             "Reporter Tools iframe creation, cleanup, or message validation is incomplete.")
  check.call(reporter_tools.include?(".tool-card-modal-demo-frame") &&
             reporter_tools.include?("height: 72dvh;") &&
             reporter_tools.include?("@media (max-width: 767px)"),
             "Reporter Tools has no responsive iframe sizing.")

  appearance = catalog.fetch("items").find { |item| item["id"] == "appearance-pages" }
  check.call(appearance && appearance.key?("modalDemoUrl"),
             "Appearance Pages has no dormant modalDemoUrl catalog field.")
  active_demo_urls = catalog.fetch("items").each_with_object([]) do |item, values|
    value = item["modalDemoUrl"].to_s.strip
    values << [item["id"], value] unless value.empty?
  end
  check.call(active_demo_urls.empty?,
             "A modal demo was activated before its HTML was published: #{active_demo_urls.inspect}")
end

if errors.empty?
  puts "PASS: Tutorial Demo Builder v1 local integration audit"
  puts "  regular V3 demo-code leakage: 0"
  puts "  duplicate/zoom/nudge/reset drift: 0"
  puts "  active Reporter Tools demo URLs: 0"
  puts "  playback: click-to-play + pause + restart + seek"
  puts "  timing: default + manual + slide audio"
  puts "  embed: responsive + noindex + iframe cleanup"
  exit 0
end

warn "FAIL: Tutorial Demo Builder v1 local integration audit"
errors.each { |message| warn "  - #{message}" }
exit 1
