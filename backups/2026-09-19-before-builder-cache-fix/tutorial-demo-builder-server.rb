#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "securerandom"
require "time"
require "webrick"

SERVICE_NAME = "magic-hashtags-tutorial-builder"
SERVICE_VERSION = 4
MAX_REQUEST_BYTES = 20 * 1024 * 1024

class ProjectStore
  def initialize(folder, stem)
    @path = File.join(folder, ".tutorial-#{stem}-projects.json")
    @backup_path = File.join(folder, ".tutorial-#{stem}-projects.backup.json")
    @mutex = Mutex.new
  end

  def list
    @mutex.synchronize do
      read_database.fetch("projects").map { |project| summary(project) }
    end
  end

  def fetch(id)
    @mutex.synchronize do
      project = find_project(read_database, id)
      project && deep_copy(project)
    end
  end

  def create(name, state)
    @mutex.synchronize do
      database = read_database
      now = Time.now.utc.iso8601(3)
      project = {
        "id" => "project-#{Time.now.utc.strftime("%Y%m%d%H%M%S")}-#{SecureRandom.hex(4)}",
        "name" => clean_name(name),
        "createdAt" => now,
        "updatedAt" => now,
        "state" => valid_state(state)
      }
      database.fetch("projects") << project
      write_database(database)
      deep_copy(project)
    end
  end

  def update(id, attributes)
    @mutex.synchronize do
      database = read_database
      project = find_project(database, id)
      return nil unless project

      project["name"] = clean_name(attributes["name"]) if attributes.key?("name")
      project["state"] = valid_state(attributes["state"]) if attributes.key?("state")
      project["updatedAt"] = Time.now.utc.iso8601(3)
      write_database(database)
      deep_copy(project)
    end
  end

  def delete(id)
    @mutex.synchronize do
      database = read_database
      project = find_project(database, id)
      return nil unless project

      database.fetch("projects").delete(project)
      write_database(database)
      summary(project)
    end
  end

  private

  def default_database
    { "version" => 1, "projects" => [] }
  end

  def read_database
    return default_database unless File.file?(@path)

    parsed = JSON.parse(File.read(@path, encoding: "UTF-8"))
    raise "The project file is not an object." unless parsed.is_a?(Hash)
    raise "The project list is missing." unless parsed["projects"].is_a?(Array)

    parsed
  rescue JSON::ParserError => error
    raise "The project file is not valid JSON: #{error.message}"
  end

  def write_database(database)
    contents = JSON.pretty_generate(database) + "\n"
    if File.file?(@path)
      atomic_write(@backup_path, File.binread(@path))
    end
    atomic_write(@path, contents)
  end

  def atomic_write(path, contents)
    temporary_path = "#{path}.tmp-#{Process.pid}-#{SecureRandom.hex(4)}"
    File.open(temporary_path, "wb", 0o600) do |file|
      file.write(contents)
      file.flush
      file.fsync
    end
    File.rename(temporary_path, path)
  ensure
    File.unlink(temporary_path) if temporary_path && File.exist?(temporary_path)
  end

  def find_project(database, id)
    return nil unless id.match?(/\Aproject-[a-zA-Z0-9_-]{1,100}\z/)

    database.fetch("projects").find { |project| project["id"] == id }
  end

  def clean_name(value)
    name = value.to_s.gsub(/[\u0000-\u001f\u007f]/, " ").strip.gsub(/\s+/, " ")
    raise "Enter a project name." if name.empty?
    raise "Project names must be 100 characters or fewer." if name.length > 100

    name
  end

  def valid_state(value)
    raise "Project state must be a JSON object." unless value.is_a?(Hash)

    deep_copy(value)
  end

  def summary(project)
    project.reject { |key, _value| key == "state" }
  end

  def deep_copy(value)
    JSON.parse(JSON.generate(value))
  end
end

def json_response(response, status, payload)
  response.status = status
  response["Content-Type"] = "application/json; charset=utf-8"
  response["Cache-Control"] = "no-store"
  response.body = JSON.generate(payload)
end

def request_json(request)
  body = request.body.to_s
  raise "The project is too large to save." if body.bytesize > MAX_REQUEST_BYTES

  parsed = JSON.parse(body)
  raise "The request must contain a JSON object." unless parsed.is_a?(Hash)

  parsed
rescue JSON::ParserError => error
  raise "The request is not valid JSON: #{error.message}"
end

folder = File.expand_path(ARGV.fetch(0))
port = Integer(ARGV.fetch(1, "8765"), 10)
raise "Builder folder does not exist: #{folder}" unless Dir.exist?(folder)

stores = {
  "demo" => ProjectStore.new(folder, "demo"),
  "centered" => ProjectStore.new(folder, "centered")
}.freeze
server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: port,
  DocumentRoot: folder,
  DoNotReverseLookup: true,
  AccessLog: [[STDOUT, WEBrick::AccessLog::COMMON_LOG_FORMAT]],
  Logger: WEBrick::Log.new(STDERR, WEBrick::Log::INFO)
)

server.mount_proc "/__tutorial_builder" do |request, response|
  begin
    if request.request_method == "GET" && request.path == "/__tutorial_builder/health"
      json_response(response, 200, service: SERVICE_NAME, version: SERVICE_VERSION, projectTypes: stores.keys)
      next
    end

    match = request.path.match(%r{\A/__tutorial_builder(?:/(centered))?/projects(?:/(project-[a-zA-Z0-9_-]{1,100})(/delete)?)?\z})
    unless match
      json_response(response, 404, error: "Unknown builder request.")
      next
    end

    project_type = match[1] || "demo"
    project_id = match[2]
    delete_action = match[3] == "/delete"
    store = stores.fetch(project_type)
    if project_id.nil? && request.request_method == "GET"
      json_response(response, 200, projects: store.list)
    elsif project_id.nil? && request.request_method == "POST"
      body = request_json(request)
      project = store.create(body["name"], body["state"])
      json_response(response, 201, project: project)
    elsif project_id && request.request_method == "GET"
      project = store.fetch(project_id)
      project ? json_response(response, 200, project: project) : json_response(response, 404, error: "Project not found.")
    elsif project_id && request.request_method == "PUT"
      project = store.update(project_id, request_json(request))
      project ? json_response(response, 200, project: project) : json_response(response, 404, error: "Project not found.")
    elsif project_id && delete_action && request.request_method == "POST"
      project = store.delete(project_id)
      project ? json_response(response, 200, project: project) : json_response(response, 404, error: "Project not found.")
    else
      json_response(response, 405, error: "That project request method is not allowed.")
    end
  rescue StandardError => error
    warn "Builder API error: #{error.class}: #{error.message}"
    json_response(response, 422, error: error.message)
  end
end

trap("INT") { server.shutdown }
trap("TERM") { server.shutdown }
server.start
