# -*- encoding: utf-8 -*-
# stub: mimemagic 0.3.5 ruby lib

Gem::Specification.new do |s|
  s.name = "mimemagic".freeze
  s.version = "0.3.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "bug_tracker_uri" => "https://github.com/minad/mimemagic/issues", "changelog_uri" => "https://github.com/minad/mimemagic/blob/master/CHANGELOG.md", "source_code_uri" => "https://github.com/minad/mimemagic" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Daniel Mendler".freeze]
  s.date = "2023-02-02"
  s.description = "Fast mime detection by extension or content in pure ruby (Uses freedesktop.org.xml shared-mime-info database)".freeze
  s.email = ["mail@daniel-mendler.de".freeze]
  s.files = [".gitignore".freeze, ".travis.yml".freeze, ".yardopts".freeze, "CHANGELOG.md".freeze, "Gemfile".freeze, "LICENSE".freeze, "README.md".freeze, "Rakefile".freeze, "lib/mimemagic.rb".freeze, "lib/mimemagic/overlay.rb".freeze, "lib/mimemagic/tables.rb".freeze, "lib/mimemagic/version.rb".freeze, "mimemagic.gemspec".freeze, "script/freedesktop.org.xml".freeze, "script/generate-mime.rb".freeze, "test/files/application.gzip".freeze, "test/files/application.vnd.openxmlformats-officedocument.spreadsheetml{gdocs}.sheet".freeze, "test/files/application.vnd.openxmlformats-officedocument.spreadsheetml{msoffice}.sheet".freeze, "test/files/application.vnd.openxmlformats-officedocument.spreadsheetml{rubyxl}.sheet".freeze, "test/files/application.x-bzip".freeze, "test/files/application.x-ruby".freeze, "test/files/application.x-tar".freeze, "test/files/application.zip".freeze, "test/files/image.jpeg".freeze, "test/files/image.png".freeze, "test/mimemagic_test.rb".freeze]
  s.homepage = "https://github.com/minad/mimemagic".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.0.9".freeze
  s.summary = "Fast mime detection by extension or content".freeze

  s.installed_by_version = "3.0.9" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<minitest>.freeze, ["~> 5.11"])
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
    else
      s.add_dependency(%q<minitest>.freeze, ["~> 5.11"])
      s.add_dependency(%q<rake>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<minitest>.freeze, ["~> 5.11"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
  end
end
