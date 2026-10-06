#!/usr/bin/env ruby
# frozen_string_literal: true
require 'net/http'
require 'uri'

base = URI('https://iridescent-wisp-57bcb1.netlify.app')
checks = {
  'shapes.csv' => 200,
  'tutorials/catalog.json' => 200,
  'tutorials/ap-demo/a01-go-to-website-click-reporter-tools.png' => 200,
  'video/appearance-pages-demo-plugin.mp4' => 200,
  'images/annotation-libraries/catalog.json' => 200,
  'scripts/tutorial-reading-export.js' => 200,
  'test-folder/test-1.html' => 200,
  'video/test-tutorial.html' => 200,
  'tutorial-demo-builder-v2.html' => 404,
  'tutorial-demo-builder-server.rb' => 404,
  '.tutorial-demo-projects.json' => 404,
  '.tutorial-centered-projects.json' => 404,
  '.tutorial-project-history/demo-20260923T051343.302707Z.json' => 404,
  'tmp/pdfs/pdf-download-repair/embedded.pdf' => 404,
  'exports/2026-09-14/appearance-pages-demo.html' => 404,
  'AGENTS.md' => 404,
  'scripts/media-publish-files.rb' => 404
}
failures = []
Net::HTTP.start(base.host, base.port, use_ssl: true, open_timeout: 15, read_timeout: 20) do |http|
  checks.each do |path, expected|
    response = http.request(Net::HTTP::Head.new("/#{path}?publication-check=#{Time.now.to_i}", 'Cache-Control' => 'no-cache'))
    actual = response.code.to_i
    failures << "#{path}: expected #{expected}, received #{actual}" unless actual == expected
  end
end
abort "Live publication verification failed:\n#{failures.join("\n")}" unless failures.empty?
puts "Live boundary verified: public media works; builder, drafts, recovery and internal files are unavailable (#{checks.length} checks)."
