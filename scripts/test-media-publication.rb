#!/usr/bin/env ruby
# frozen_string_literal: true
require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require 'open3'
require 'json'

class MediaPublicationTest < Minitest::Test
  def setup
    @root = Dir.mktmpdir('media-publication-test-')
    FileUtils.mkdir_p(File.join(@root, 'scripts'))
    %w[media-publication-policy.rb media-publish-files.rb build-media-site.rb].each do |script|
      FileUtils.cp(File.join(__dir__, script), File.join(@root, 'scripts', script))
    end
    run!('git', 'init', '-q')
    write('media-publication.json', JSON.generate('public_pages' => ['test-folder/player.html'], 'public_files' => ['tutorials/catalog.json']))
    write('test-folder/player.html', '<body data-mode="player">Player</body>')
    write('tutorials/catalog.json', '{}')
    write('tutorials/DRAFT-1/hosted.png', 'tutorial media')
    write('images/public.png', 'public image')
    run!('git', 'add', '.')
  end

  def teardown
    FileUtils.remove_entry(@root)
  end

  def write(path, contents)
    target = File.join(@root, path)
    FileUtils.mkdir_p(File.dirname(target))
    File.binwrite(target, contents)
  end

  def run!(*args)
    output, error, status = Open3.capture3(*args, chdir: @root)
    assert status.success?, "#{args.inspect}: #{output}\n#{error}"
    output
  end

  def build
    run!('ruby', 'scripts/build-media-site.rb')
  end

  def test_only_public_media_and_explicit_players_are_built
    private_files = %w[tutorial-builders/app.html Tutorial\ Builders/photo.png tutorial-builder-work/asset.png .tutorial-project-history/snapshot.json tmp/leaked.pdf images/backups/private.png exports/player.html scripts/private.rb unknown/photo.png]
    private_files.each { |path| write(path, 'private') }
    run!('git', 'add', '.')
    build
    private_files.each { |path| refute File.exist?(File.join(@root, '.media-public', path)), path }
    %w[images/public.png tutorials/DRAFT-1/hosted.png tutorials/catalog.json test-folder/player.html].each do |path|
      assert_equal File.binread(File.join(@root, path)), File.binread(File.join(@root, '.media-public', path))
    end
  end

  def test_builder_cannot_replace_an_approved_player
    build
    write('test-folder/player.html', '<body data-mode="builder">Draft</body>')
    _, error, status = Open3.capture3('ruby', 'scripts/build-media-site.rb', chdir: @root)
    refute status.success?
    assert_includes error, 'Editable builder cannot be published'
    assert_includes File.read(File.join(@root, '.media-public/test-folder/player.html')), 'data-mode="player"'
  end

  def test_symlinks_cannot_escape_the_media_folder
    File.symlink('/etc/hosts', File.join(@root, 'images', 'escape.png'))
    run!('git', 'add', '.')
    _, error, status = Open3.capture3('ruby', 'scripts/build-media-site.rb', chdir: @root)
    refute status.success?
    assert_includes error, 'symbolic links'
  end

  def test_rebuilding_removes_stale_public_files
    build
    File.unlink(File.join(@root, 'images/public.png'))
    run!('git', 'add', '-u')
    build
    refute File.exist?(File.join(@root, '.media-public/images/public.png'))
  end

  def test_staging_untracks_recovery_without_deleting_local_work
    write('.tutorial-centered-projects.json', 'draft')
    write('tmp/private.pdf', 'test output')
    write('exports/player.html', 'working export')
    run!('git', 'add', '.')
    run!('ruby', 'scripts/media-publish-files.rb', 'stage')
    tracked = run!('git', 'ls-files').lines.map(&:strip)
    %w[.tutorial-centered-projects.json tmp/private.pdf exports/player.html].each do |path|
      refute_includes tracked, path
      assert File.file?(File.join(@root, path)), path
    end
  end

  def test_missing_required_media_stops_the_build
    File.unlink(File.join(@root, 'tutorials/catalog.json'))
    _, error, status = Open3.capture3('ruby', 'scripts/build-media-site.rb', chdir: @root)
    refute status.success?
    assert_includes error, 'Required public files'
  end

  def test_untracked_media_is_not_silently_deployed
    write('images/untracked.png', 'not staged')
    build
    refute File.exist?(File.join(@root, '.media-public/images/untracked.png'))
  end
end
