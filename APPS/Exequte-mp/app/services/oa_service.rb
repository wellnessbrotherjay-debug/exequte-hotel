class OaService
  attr_accessor :access_token
  def get_users_info
    # access_token
    # puts "access_token"
    # p @access_token
    users_list
    puts "users_list"
    # p @users_list
    users_info
    puts "users_info"
    # p @users_info
    @users_info
  end

  # private

  def access_token
    app_id = Rails.application.credentials.dig(:wx_oa, :app_id)
    app_secret = Rails.application.credentials.dig(:wx_oa, :app_secret)

    url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{app_id}&secret=#{app_secret}"
    puts "================== ACCESS TOKEN URL SET ===================="

    r = RestClient.get(url)
    puts "================== ACCESS TOKEN R ===================="
    p r

    res = JSON.parse r
    puts "================== ACCESS TOKEN RES ===================="
    res
    @access_token = res['access_token']
    # @access_token = "43_aU8YZroFQYpDsbZTygDHfQUJ3k4XOBkNMa9cpIwinKeRcWMfM0oyYbxg2Bdm3Uh3IiYBaQ_uxloZF2bZpBf_ptSB3i7vn0Z-aqvfFMi-CP9pVARQn3nGWMM1HiaXcGaevMyFW1lJJFkDGgM8UDMaAAABKT"
  end


  def users_list
    url = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=#{@access_token}"
    puts "================== URL ===================="
    p url
    r = RestClient.get(url)
    puts "================== R ===================="
    p r
    res = JSON.parse r
    puts "================== RES ===================="
    p res

    @users_list = res['data']['openid']
    next_openid = res['next_openid']

    while next_openid.present?
      r = RestClient.get(url + '&next_openid=' + next_openid)
      res = JSON.parse r
      @users_list += res['data']['openid'] if res['data'].present?
      next_openid = res['next_openid']
    end
    @users_list = @users_list.uniq
  end

  def users_info
    users_info = []
    url = "https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=#{@access_token}"

    @users_list.each_slice(100).each do |set|
      puts "================== INSIDE EACH ===================="

      data = {}
      data["user_list"] = set.map{ |x| {openid: x, lang: 'en'} }
      r = RestClient.post(url, data.to_json)
      res = JSON.parse r
      users_info << res["user_info_list"]
    end
    @users_info = users_info.flatten
  end
end

# app_secret = "46ba6e3800e79874459861aa8bce5bf4"
# app_id = "wxb24c089a90f978dc"
# @access_token = "42_fRZhgfsLz1296jOsO1fcuY4zxtE-73NNFu4Ry3oMemJRdphMyUMHCfz_u0qLmGW7o1TtDystCLeRb026DgPTB08LmikGz60W5X6FedN-GYrf9iWRnvfPSngrV-LbWpBG7uqKmVKAYoz7JnIFQLCiAIAMHY"

# My oa_open_id = "oS9Rj68fySLTSNGeAzIkUfUaMVc4"
# "openid"=>"oS9Rj68fySLTSNGeAzIkUfUaMVc4",
