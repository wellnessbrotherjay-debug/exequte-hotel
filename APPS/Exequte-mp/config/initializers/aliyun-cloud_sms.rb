require 'aliyun/cloud_sms'

#https://www.rubydoc.info/gems/aliyun-cloud_sms/0.2.3

Aliyun::CloudSms.configure do |config|
  config.access_key_secret = Rails.application.credentials.aliyun_access_key_secret
  config.access_key_id =  Rails.application.credentials.aliyun_access_key_id
  config.sign_name = 'exeQute'
end