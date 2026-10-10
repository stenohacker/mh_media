# frozen_string_literal: true
require 'json'

# The repository is a workspace, never the deployment directory.
module MediaPublication
  ASSET_TYPES = {
    'images' => %w[.avif .bmp .gif .jpeg .jpg .png .svg .webp .ico],
    'gifs' => %w[.gif .webp],
    'audio' => %w[.mp3 .wav .m4a .ogg .aac .flac],
    'video' => %w[.mp4 .webm .mov .m4v],
    'tutorials' => %w[.avif .bmp .gif .jpeg .jpg .png .svg .webp .mp3 .wav .m4a .ogg .mp4 .webm],
    'downloads' => %w[.pdf .txt .csv .rtf .docx .xlsx .pptx .zip .json],
    'fonts' => %w[.ttf .otf .woff .woff2 .txt]
  }.freeze
  LOCAL_PART = /\A(?:backups?|audits?|tmp|archive|node_modules|exports|tutorial[- _]builders?(?:[- _]work)?)\z/i

  def self.local_path?(path)
    parts = path.split('/')
    parts.any? { |part| part.start_with?('.') || part.match?(LOCAL_PART) } ||
      path.match?(%r{\Atutorial-(?:demo-builder|builder-centered|video-page-builder)-v.*\.html\z}) ||
      path == 'tutorial-demo-builder-server.rb' ||
      path == 'tutorials/ap-demo/appearance-pages-demo.html' ||
      path.match?(%r{\AOPEN.*TUTORIAL.*BUILDER.*\.command\z})
  end

  def self.manifest(root)
    data = JSON.parse(File.read(File.join(root, 'media-publication.json')))
    %w[public_pages public_files].each do |key|
      raise "Missing publication list: #{key}" unless data[key].is_a?(Array)
      data[key].each do |path|
        raise "Unsafe publication path: #{path.inspect}" unless path.is_a?(String) &&
          !path.empty? && !path.start_with?('/') && !path.include?('\\') &&
          !local_path?(path) && path.split('/').none?(&:empty?)
      end
    end
    data
  end

  def self.public_path?(path, manifest)
    return false if local_path?(path)
    return manifest['public_pages'].include?(path) if File.extname(path).downcase == '.html'
    manifest['public_files'].include?(path) ||
      (ASSET_TYPES.fetch(path.split('/').first, []).include?(File.extname(path).downcase) && path.include?('/'))
  end

  def self.repository_file?(path)
    File.basename(path) == '.gitkeep' ||
      %w[.gitignore AGENTS.md netlify.toml media-publication.json MEDIA_PUBLICATION.md PUBLISH\ MEDIA\ WEBSITE.command].include?(path) ||
      path.match?(%r{\Ascripts/[a-z0-9-]+\.rb\z})
  end

  def self.validate_file!(root, path)
    current = root
    path.split('/').each do |part|
      current = File.join(current, part)
      raise "Publication refuses symbolic links: #{path}" if File.symlink?(current)
    end
    raise "Missing public file: #{path}" unless File.file?(current)
    raise "Public file exceeds 95 MiB: #{path}" if File.size(current) > 95 * 1024 * 1024
    if File.extname(path).downcase == '.html'
      html = File.binread(current)
      raise "Editable builder cannot be published: #{path}" if html.match?(/<body\b[^>]*\bdata-mode\s*=\s*["']?builder\b/i)
      raise "Only standalone players may be public HTML: #{path}" unless html.match?(/<body\b[^>]*\bdata-mode\s*=\s*["']player["']/i)
    end
  end
end
