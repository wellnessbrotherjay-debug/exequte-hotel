class WechatOpenidService
  attr_reader :error, :js_code

  def initialize(js_code)
    @error = 'Wechat miniprogram credentials are missing' if app_id.blank? || app_secret.blank?
    @js_code = js_code
  end

  def request
    url = URI::HTTPS.build(host: 'api.weixin.qq.com', path: '/sns/jscode2session', query: params.to_query)
    res = HTTParty.get url
    JSON.parse(res.parsed_response)
  rescue => e
    @error = e
  end

  private

  def app_id
    Rails.application.credentials.wx_mp_app_id
  end

  def app_secret
    Rails.application.credentials.wx_mp_app_secret
  end

  def params
    {
      appid: app_id,
      secret: app_secret,
      js_code: js_code,
      grant_type: 'authorization_code'
    }
  end
end
