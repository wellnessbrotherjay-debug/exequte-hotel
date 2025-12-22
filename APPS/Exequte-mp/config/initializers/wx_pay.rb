# required
WxPay.appid = Rails.application.credentials.wx_mp_app_id
WxPay.key = Rails.application.credentials.wx_pay_api_key
WxPay.mch_id = Rails.application.credentials.wx_pay_mch_id.to_s # required type is String, otherwise there will be cases where JS_PAY can pay but the APP cannot pay
WxPay.debug_mode = true # default is `true`
WxPay.sandbox_mode = false # default is `false`

# cert, see https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=4_3
# using PCKS12
# WxPay.set_apiclient_by_pkcs12(File.read(pkcs12_filepath), pass)

# if you want to use `generate_authorize_req` and `authenticate`
WxPay.appsecret = Rails.application.credentials.wx_mp_app_secret

# optional - configurations for RestClient timeout, etc.
WxPay.extra_rest_client_options = {timeout: 6, open_timeout: 8}
