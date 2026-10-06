#!/usr/bin/env ruby
# Prepare the repository for publication without deleting local authoring files.
require 'open3'
require 'set'
require_relative 'media-publication-policy'

Dir.chdir(File.expand_path('..', __dir__))
def git(*args)
  output, error, status = Open3.capture3('git', *args)
  abort(error) unless status.success?
  output
end

mode = ARGV.fetch(0, 'check')
abort 'Use check or stage' unless %w[check stage].include?(mode)
manifest = MediaPublication.manifest(Dir.pwd)
tracked = git('ls-files', '-z', '--cached').split("\0").to_set
ignored = git('ls-files', '-z', '--cached', '--ignored', '--exclude-standard').split("\0").to_set
candidates = git('ls-files', '-z', '--cached', '--others', '--exclude-standard').split("\0").uniq
local = candidates.select do |path|
  !MediaPublication.repository_file?(path) && (
    ignored.include?(path) || MediaPublication.local_path?(path) ||
    (File.file?(path) && File.extname(path).downcase == '.html' &&
      File.binread(path).match?(/<body\b[^>]*\bdata-mode\s*=\s*["']?builder\b/i)))
end.to_set
eligible = candidates.select do |path|
  !local.include?(path) && (MediaPublication.public_path?(path, manifest) || MediaPublication.repository_file?(path))
end
public_files = eligible.select { |path| MediaPublication.public_path?(path, manifest) && (File.exist?(path) || File.symlink?(path)) }
public_files.each { |path| MediaPublication.validate_file!(Dir.pwd, path) }
missing = manifest.values.flatten - public_files
abort "Required public files are missing: #{missing.join(', ')}" unless missing.empty?
puts "Public media files: #{public_files.length}"
puts "Local-only files to remove from Git tracking: #{(tracked & local).length}; local copies stay intact."
puts 'Other workspace files are excluded from the public build.'
exit if mode == 'check'

(tracked & local).to_a.each_slice(100) do |paths|
  git('--literal-pathspecs', 'rm', '--cached', '--ignore-unmatch', '--', *paths)
end
eligible.each_slice(100) do |paths|
  git('--literal-pathspecs', 'add', '-A', '--', *paths)
end
# Inspect the complete index, including files staged before this publisher ran.
indexed = git('ls-files', '-z').split("\0")
leaked = indexed.select { |path| local.include?(path) }
abort "Local files remain staged: #{leaked.join(', ')}" unless leaked.empty?
puts 'Repository prepared. The separate public build is the deployment authority.'
