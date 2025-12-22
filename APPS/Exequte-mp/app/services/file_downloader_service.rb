require 'open-uri'

class FileDownloaderService
  def self.download(url)
    URI.open(url)
  end

  def self.filename
    "#{SecureRandom.hex(10)}.jpeg"
  end
end
