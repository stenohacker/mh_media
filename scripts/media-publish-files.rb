#!/usr/bin/env ruby
# Prepare the Git publication tree without deleting local authoring files.
require 'open3'
require 'set'

def git(*args)
  output, error, status = Open3.capture3('git', *args)
  abort(error) unless status.success?
  output
end

mode = ARGV.fetch(0, 'check')
abort 'Use check or stage' unless %w[check stage].include?(mode)
tracked = git('ls-files', '-z', '--cached').split("\0").to_set
ignored = git('ls-files', '-z', '--cached', '--ignored', '--exclude-standard').split("\0").to_set
candidates = git('ls-files', '-z', '--cached', '--others', '--exclude-standard').split("\0").uniq
local = candidates.select do |path|
  ignored.include?(path) ||
    path.match?(%r{\A(?:tutorial-builder-work|backups|audits|\.tutorial-project-history|archive|node_modules)(?:/|\z)}) ||
    path.match?(%r{(?:\A|/)\.DS_Store\z}) ||
    path.match?(%r{\Atutorial-(?:demo-builder|builder-centered|video-page-builder)-v.*\.html\z}) ||
    (File.file?(path) && File.extname(path) == '.html' &&
      File.binread(path).match?(/<body\b[^>]*\bdata-mode\s*=\s*["']builder["']/i))
end.to_set
publish = candidates.reject { |path| local.include?(path) }
oversize = publish.select { |path| File.file?(path) && File.size(path) > 95 * 1024 * 1024 }
unless oversize.empty?
  abort "Publication stopped: media files exceed 95 MiB:\n#{oversize.join("\n") }"
end

puts "Public media/repository files: #{publish.length}"
puts "Previously tracked local-only files to untrack: #{(tracked & local).length} (local files preserved)"
puts "No publishable file exceeds 95 MiB."
exit if mode == 'check'

# Literal, enumerated filenames avoid git add's ignored-directory/pathspec error.
# Deletions remove old local-only files from the next published tree as well.
(tracked & local).to_a.each_slice(100) do |paths|
  git('--literal-pathspecs', 'rm', '--cached', '-f', '--ignore-unmatch', '--', *paths)
end
publish.each_slice(100) do |paths|
  git('--literal-pathspecs', 'add', '-A', '--', *paths)
end
staged = git('diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR').split("\0")
leaked = staged.select { |path| local.include?(path) }
abort "Local files were unexpectedly staged: #{leaked.join(', ')}" unless leaked.empty?
puts 'Media staged successfully; no builder or recovery files staged for upload.'
