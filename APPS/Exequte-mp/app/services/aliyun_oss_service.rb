require 'aliyun/sts'
require 'aliyun/oss'
class AliyunOssService
  BUCKET = 'exequte-main'.freeze

  STS = Aliyun::STS::Client.new(
    access_key_id:
    Rails.application.credentials.aliyun_access_key_id,
    access_key_secret:
    Rails.application.credentials.aliyun_access_key_secret
  )

  def self.client(token)
    Aliyun::OSS::Client.new(
      endpoint: Rails.application.credentials.aliyun_endpoint,
      access_key_id: token.access_key_id,
      access_key_secret: token.access_key_secret,
      sts_token: token.security_token
    )
  end

  def self.token
    policy = Aliyun::STS::Policy.new
    policy.allow(['oss:*'], ["acs:oss:*:1557106377546687:#{BUCKET}/*"])
    STS.assume_role('acs:ram::1557106377546687:role/exequte-oss-full', 'client-01', policy, 15 * 60)
  end

  def self.upload(file, filename = SecureRandom.hex(16), bucket = BUCKET)
    client = client(fetch_token)
    bucket = client.get_bucket(bucket)
    bucket.put_object(filename, file: file.path)
  end
end
