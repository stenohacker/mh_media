#!/usr/bin/env ruby

require "json"

repository = File.expand_path(ARGV.fetch(0, File.join(__dir__, "..")))
tutorials_root = File.join(repository, "tutorials")
catalog_path = File.join(tutorials_root, "catalog.json")
extensions = %w[.avif .bmp .gif .jpeg .jpg .png .svg .webp]

tutorials = Dir.children(tutorials_root).each_with_object([]) do |folder, tutorial_entries|
  absolute_folder = File.join(tutorials_root, folder)
  next unless File.directory?(absolute_folder)
  next if folder.start_with?(".") || folder.match?(/\ADRAFT-[1-5]\z/i)

  images = Dir.children(absolute_folder).each_with_object([]) do |filename, image_entries|
    absolute_file = File.join(absolute_folder, filename)
    next unless File.file?(absolute_file)
    next if filename.start_with?(".")
    next unless extensions.include?(File.extname(filename).downcase)

    image_entries << {
      "name" => filename,
      "type" => File.extname(filename).casecmp?(".gif") ? "gif" : "image"
    }
  end.sort_by { |image| image.fetch("name").downcase }

  tutorial_entries << { "folder" => folder, "images" => images }
end.sort_by { |tutorial| tutorial.fetch("folder").downcase }

contents = JSON.pretty_generate({ "version" => 1, "tutorials" => tutorials }) + "\n"
if File.exist?(catalog_path) && File.binread(catalog_path) == contents
  puts "Tutorial catalog is already current."
else
  File.binwrite(catalog_path, contents)
  puts "Updated tutorials/catalog.json from the tutorial folders."
end
