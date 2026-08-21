#!/usr/bin/env ruby
# frozen_string_literal: true

require "csv"
require "uri"

ROOT = File.expand_path("..", __dir__)
BUILDER = File.join(ROOT, "tutorial-builder-work", "tutorial-builder-v3.html")
DEMO = File.join(ROOT, "tutorial-builder-work", "appearance-pages-demo.html")
CATALOG = File.join(ROOT, "shapes.csv")
ANNOTATIONS = File.join(ROOT, "images", "tutorial-annotations")
NETLIFY_CONFIG = File.join(ROOT, "netlify.toml")
PUBLIC_ROOT = "https://iridescent-wisp-57bcb1.netlify.app/images/tutorial-annotations/"
NAV_LOGO_URL = "https://iridescent-wisp-57bcb1.netlify.app/images/mhnavlogo.png"
MAX_PNG_DIMENSION = 2_048

errors = []
check = lambda do |condition, message|
  errors << message unless condition
end

catalog_rows = CSV.read(CATALOG, headers: true).map do |row|
  [row["name"].to_s.strip, row["url"].to_s.strip]
end

check.call(CSV.open(CATALOG, &:readline) == %w[name url],
           "shapes.csv must have exactly the name,url header.")
check.call(catalog_rows.length == 54,
           "Expected 54 shape rows; found #{catalog_rows.length}.")

names = catalog_rows.map { |name, _url| name.downcase }
urls = catalog_rows.map { |_name, url| url }
check.call(names.uniq.length == names.length, "Shape names are not unique.")
check.call(urls.uniq.length == urls.length, "Shape URLs are not unique.")

catalog_rows.each do |name, url|
  check.call(!name.empty?, "A shape has a blank name.")
  check.call(url.start_with?(PUBLIC_ROOT), "#{name.inspect} is not hosted under #{PUBLIC_ROOT}.")
  check.call(url == URI::DEFAULT_PARSER.escape(URI::DEFAULT_PARSER.unescape(url)),
             "#{name.inspect} contains an unencoded or unstable URL: #{url}")
  filename = URI::DEFAULT_PARSER.unescape(url.delete_prefix(PUBLIC_ROOT))
  check.call(File.file?(File.join(ANNOTATIONS, filename)),
             "#{name.inspect} points to missing local file #{filename.inspect}.")
end

required_shared = %w[
  h-pink.png
  h-orange.png
  h-green.png
  h-yellow.png
  h-purple.png
  h-mauve.png
  h-mint.png
  h-light-pink.png
  h-coral.png
  play-audio-annotation.png
  pause-audio-annotation.gif
  play-video-annotation.png
  link-interactive.png
]
required_shared.each do |filename|
  check.call(File.file?(File.join(ANNOTATIONS, filename)),
             "Required shared annotation asset is missing: #{filename}")
end

builder = File.read(BUILDER)
demo = File.read(DEMO)
check.call(
  builder.match?(/body\[data-mode="player"\]\s*\{[^}]*background:\s*#9ca3af;/m),
  "Exported tutorial pages no longer use the Reporter Tools gray background."
)
check.call(
  (builder.match?(/\.annotation-audio \.object-frame > img\s*\{[^}]*object-fit:\s*contain;/m) &&
    !builder.match?(/\.annotation-audio \.object-frame > img\s*\{[^}]*object-fit:\s*fill;/m)),
  "The audio cassette annotation is being stretched instead of preserving its proportions."
)
check.call(
  (builder.include?('position: fixed;') &&
    builder.match?(/body\[data-mode="player"\] \.reader-nav\s*\{[^}]*bottom:/m) &&
    builder.include?('padding: calc(92px + .5rem)') &&
    builder.include?('body[data-mode="player"] .tutorial-page-links { margin-top: 1mm; }')),
  "Exported tutorial navigation is no longer kept in view or the tutorial has drifted downward."
)
check.call(
  (builder.include?('<a class="site-nav__link" href="${sitePageUrl("reporter-tools.html")}">reporter tools</a>') &&
    builder.include?('action: "show-store-coming-soon"') &&
    builder.include?('data-action="${link.action}"') &&
    builder.include?('function showStoreComingSoon(link)') &&
    builder.include?('const OFFLINE_SITE_ROOT = "file:///Users/tamchap/Dev/website/"') &&
    builder.include?('const USING_OFFLINE_BUILDER = location.protocol === "file:"') &&
    builder.include?('const SITE_NAV_ROOT = new URL(') &&
    builder.include?('const sitePageUrl = (path = "")') &&
    builder.include?('sitePageUrl("learn/learn-index.html")') &&
    builder.include?('sitePageUrl("reporter-tools.html")') &&
    builder.include?('sitePageUrl("index.html#contact")') &&
    builder.include?('label: "customizer"') &&
    builder.include?('label: "store"') &&
    builder.include?(%(const SITE_HEADER_LOGO_URL = "#{NAV_LOGO_URL}")) &&
    builder.include?('cover?.media?.url || SITE_HEADER_LOGO_URL') &&
    !builder.include?('/images/logosmaller.png') &&
    !builder.include?('/styles/site-system.css') &&
    !builder.include?('applyExportSiteStyles')),
  "Exported tutorial pages no longer use the current main-site header and destinations."
)
check.call(File.file?(File.join(ROOT, "images", "mhnavlogo.png")),
           "The standalone navigation logo is missing locally.")
check.call(
  (builder.include?('function contentsNumberStyle(index)') &&
    builder.include?('background: var(--contents-number-color, var(--pink));') &&
    builder.include?('style="${contentsNumberStyle(index)}"')),
  "Contents slide numbers no longer rotate through the Magic Hashtags colors."
)
check.call(
  (demo.include?(%(const SITE_HEADER_LOGO_URL = "#{NAV_LOGO_URL}")) &&
    demo.include?('function contentsNumberStyle(index)') &&
    demo.include?('style="${contentsNumberStyle(index)}"') &&
    !demo.include?('/styles/site-system.css') &&
    !demo.include?('applyExportSiteStyles')),
  "appearance-pages-demo.html has drifted from the standalone header or Contents treatment."
)
expected_hotspot_styles = [
  ["pink", "#ff90e7", "h-pink.png"],
  ["orange", "#ffc900", "h-orange.png"],
  ["green", "#23a094", "h-green.png"],
  ["yellow", "#f1f332", "h-yellow.png"],
  ["purple", "#91a8ed", "h-purple.png"],
  ["mauve", "#b23386", "h-mauve.png"],
  ["mint", "#d3f3f0", "h-mint.png"],
  ["light pink", "#fbeaf9", "h-light-pink.png"],
  ["coral", "#ff7051", "h-coral.png"]
]
hotspot_style_block = builder[/const HOTSPOT_STYLES = \[(.*?)\n    \];/m, 1].to_s
hotspot_styles = hotspot_style_block.scan(
  /\{ name: "([^"]+)", color: "(#[0-9a-f]{6})", image: annotationAssetUrl\("([^"]+)"\) \}/
)
check.call(hotspot_styles == expected_hotspot_styles,
           "Hotspot artwork/color order has drifted from the approved nine-slot sequence.")

move_hotspot_block = builder[/function moveHotspot\(id, direction\) \{(.*?)\n    \}/m, 1].to_s
check.call(move_hotspot_block.include?("list[index].title = list[target].title") &&
           move_hotspot_block.include?("list[index].body = list[target].body") &&
           move_hotspot_block.include?("list[target].title = sourceTitle") &&
           move_hotspot_block.include?("list[target].body = sourceBody"),
           "Hotspot up/down no longer swaps exactly the adjacent title and body.")
mutated_hotspot_fields = move_hotspot_block.scan(
  /list\[(?:index|target)\]\.([a-zA-Z][a-zA-Z0-9]*)\s*=(?!=)/
).flatten.uniq.sort
check.call(mutated_hotspot_fields == %w[body title] &&
           !move_hotspot_block.match?(/\.splice\(|bodyListStyle/),
           "Hotspot up/down mutates slot identity, artwork, geometry, or stacking.")
check.call(builder.include?('const slotIndex = drag.kind === "hotspot" ? hotspotSlotIndex(item.id) : -1;'),
           "Live hotspot styling is not resolved from the current numbered slot.")
check.call(!builder.include?('(item.color ? `;--hotspot-color:${item.color}` : "")'),
           "Live hotspot styling can still reapply a stale per-object color.")
check.call(builder.include?("function drawAttentionToHotspot(id, scrollRow = true)") &&
           builder.include?('hotspot-object.is-attention') &&
           builder.include?('hotspot-entry.is-attention'),
           "The active-hotspot attention animation is missing from the marker or sidebar.")
check.call(builder.include?("drawAttentionToHotspot(nextHotspotId)") &&
           builder.include?("drawAttentionToHotspot(previousHotspotId)") &&
           builder.include?('binding.startsWith("hotspot.body:")'),
           "Hotspot attention is not connected to reader navigation and sidebar editing.")
check.call(builder.include?('aria-live="polite" data-action="activate-hotspot"') &&
           builder.include?('tabindex="0">${detail}</div>'),
           "Player hotspot details are not clickable and keyboard-activatable.")

fallback_block = builder[/const FALLBACK_SHAPES = \[(.*?)\n    \];/m, 1].to_s
fallback_rows = fallback_block.scan(/\["([^"]+)", "([^"]+)"\]/)
check.call(fallback_rows == catalog_rows,
           "The embedded shape backup list has drifted from shapes.csv.")
check.call(!builder.match?(/<input\b[^>]*type=["']file["']/i),
           "The builder contains a file upload input.")
check.call(!builder.match?(/\bFileReader\b|showOpenFilePicker|webkitdirectory/),
           "The builder contains a local file attachment API.")
check.call(!builder.include?("LOCAL_ANNOTATION_ASSET_ROOT"),
           "The builder still substitutes local shared annotation artwork.")
check.call(builder.include?("const ANNOTATION_ASSET_ROOT = PUBLIC_ANNOTATION_ASSET_ROOT;"),
           "Builder and player are not pinned to the same hosted annotation root.")
check.call(builder.include?("state.meta.mediaFolder || state.meta.tutorialSlug"),
           "Tutorial media URLs are not seeded from the tutorial media folder.")
check.call(builder.include?('metaInput("mediaFolder", "Media tutorial folder"'),
           "The media tutorial folder is not editable.")
check.call(builder.include?('function markupSvg(annotation)'),
           "Native SVG markup rendering is missing.")
check.call(builder.include?("data-main-media-error"),
           "Main hosted media does not have a visible failure state.")
check.call(builder.include?('--hand: "Shadows Into Light Two", cursive;'),
           "The approved handwriting font is not connected.")
check.call(builder.include?('data-style="regular"') &&
           builder.include?('data-style="italic"') &&
           builder.include?('data-style="hand"') &&
           !builder.include?('data-style="bold"'),
           "Text controls must be regular, italic, and handwriting.")
check.call(builder.include?('grid-template-columns: repeat(3, 36px);'),
           "The three text-style controls are no longer equal width.")
check.call(builder.include?('item?.textStyle === "bold"') &&
           builder.include?('? "italic"'),
           "Text saved by the bold-style regression is not migrated to italic.")

netlify = File.read(NETLIFY_CONFIG)
%w[/images/* /tutorials/* /gifs/* /video/* /audio/* /shapes.csv].each do |path|
  check.call(netlify.include?(%(for = "#{path}")),
             "netlify.toml has no header rule for #{path}.")
end

oversized = Dir.glob(File.join(ANNOTATIONS, "*.png")).map do |path|
  data = File.binread(path, 24)
  next unless data&.start_with?("\x89PNG".b) && data.bytesize >= 24

  width, height = data.byteslice(16, 8).unpack("NN")
  [File.basename(path), width, height] if [width, height].max > MAX_PNG_DIMENSION
end.compact
check.call(oversized.empty?,
           "Oversized annotation PNGs remain: #{oversized.map { |name, w, h| "#{name} (#{w}x#{h})" }.join(", ")}")

if ARGV.include?("--remote")
  require "net/http"
  require "openssl"

  remote_urls = catalog_rows.map { |_name, url| url }
  remote_urls.concat(required_shared.map { |filename| "#{PUBLIC_ROOT}#{filename}" })
  remote_urls << NAV_LOGO_URL
  remote_urls.uniq.each do |url|
    uri = URI(url)
    response = Net::HTTP.start(
      uri.host,
      uri.port,
      use_ssl: true,
      open_timeout: 10,
      read_timeout: 10
    ) { |http| http.head(uri.request_uri) }
    if response.code == "200"
      check.call(response["content-type"].to_s.start_with?("image/"),
                 "Hosted asset is not served as an image: #{url}")
    else
      errors << "Hosted asset returns #{response.code}: #{url}"
    end
  rescue StandardError => e
    errors << "Hosted asset check failed for #{url}: #{e.message}"
  end

  begin
    shapes_uri = URI("https://iridescent-wisp-57bcb1.netlify.app/shapes.csv")
    shapes_response = Net::HTTP.start(
      shapes_uri.host,
      shapes_uri.port,
      use_ssl: true,
      open_timeout: 10,
      read_timeout: 10
    ) { |http| http.head(shapes_uri.request_uri) }
    check.call(shapes_response.code == "200",
               "Hosted shapes.csv returns #{shapes_response.code}.")
    check.call(shapes_response["access-control-allow-origin"] == "*",
               "Hosted shapes.csv is missing Access-Control-Allow-Origin: *.")
  rescue StandardError => e
    errors << "Hosted shapes.csv check failed: #{e.message}"
  end
end

scope = ARGV.include?("--remote") ? "local + hosted" : "local"
if errors.empty?
  puts "PASS: Tutorial Builder v3 #{scope} wiring audit"
  puts "  shapes: #{catalog_rows.length}"
  puts "  required shared assets: #{required_shared.length}"
  puts "  hotspot artwork/color slots: #{expected_hotspot_styles.length} (fixed, repeating)"
  puts "  hotspot reorder fields: title + body only"
  puts "  hotspot attention: navigation + sidebar + marker"
  puts "  upload controls: 0"
  puts "  oversized annotation PNGs: 0"
  exit 0
end

warn "FAIL: Tutorial Builder v3 #{scope} wiring audit"
errors.each { |message| warn "  - #{message}" }
exit 1
