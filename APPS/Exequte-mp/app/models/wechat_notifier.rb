require 'rest-client'

class WechatNotifier < ApplicationRecord
  mattr_accessor :token
  mattr_accessor :token_time
  mattr_accessor :oa_service
  mattr_accessor :oa_users
  mattr_accessor :oa_users_time
  mattr_accessor :js_ticket
  mattr_accessor :js_ticket_time
  self.abstract_class = true
  COLORS = {header: "#BB2332", body: "#0064FF", footer: "#00E1B4" }

  # =====================================================
  #             TEMPLATES FOR NOTIFICATIONS
  # =====================================================


  def self.templates
    return {
      "booking_reminder" => booking_reminder,
      "notify_queue" => notify_queue,
      "new_banner" => new_banner,
      "trainingsession_cancel" => trainingsession_cancel,
      "noshow" => noshow
    }
  end

  def self.booking_reminder(params={})
    {
      "template_id" => "siNd6GpH_dAD9k8gIHE0sz384YGb96Dx0uG3_Qr8FVQ", #新订单通知
      "receiver" => params[:openid],#(params[:openid] || "OPENID"), # receiver's openid
      "unionid" => params[:unionid], # will be used if openid is blank
      "pagepath" => (params[:pagepath] || "PAGEPATH"), # Reirect to an MP page on tap
      "header_color" => COLORS[:header], # RED
      "body_color" => COLORS[:body], # BLUE
      "footer_color" => COLORS[:footer], # Spare Leash Green
      "data" => {

        # CUSTOM MESSAGES SENT TO USER
        # Ekaterina can edit!
        "first" => "COMMIT, bring water and a towel!",
        "keyword1" => "#{params[:ts_name]}",
        "keyword2" => "exeQute JingAn",
        "keyword3" => "425, Yanping Rd, 1F",
        "keyword4" => "#{params[:ts_time]}",
        "remark" => "Cancel #{params[:ts_cancel_before]}hrs in advance!"
      }
    }
  end

  def self.notify_queue(params={})
    {
      "template_id" => "siNd6GpH_dAD9k8gIHE0sz384YGb96Dx0uG3_Qr8FVQ", #新订单通知
      "receiver" => params[:openid], # receiver's openid
      "unionid" => params[:unionid], # will be used if openid is blank
      "pagepath" => (params[:pagepath] || "PAGEPATH"), # Reirect to an MP page on tap
      "header_color" => COLORS[:header], # RED
      "body_color" => COLORS[:body], # BLUE
      "footer_color" => COLORS[:footer], # Green
      "data" => {

        # CUSTOM MESSAGES SENT TO USER

        "first" => "Yesss! A spot freed up!",
        "keyword1" => "#{params[:ts_name]}",
        "keyword2" => "exeQute JingAn",
        "keyword3" => "425, Yanping Rd, 1F",
        "keyword4" => "#{params[:ts_time]}",
        "remark" => "Be the FASTEST and COMMIT now!"
      }
    }
  end

  def self.new_banner(params={})
    puts "INSIDE NEW BANNER"
    {
      "template_id" => "siNd6GpH_dAD9k8gIHE0sz384YGb96Dx0uG3_Qr8FVQ", #新订单通知
      "receiver" => params[:openid], # receiver's openid
      "unionid" => params[:unionid], # will be used if openid is blank
      "pagepath" => (params[:pagepath] || "PAGEPATH"), # Reirect to an MP page on tap
      "header_color" => COLORS[:header], # RED
      "body_color" => COLORS[:body], # BLUE
      "footer_color" => COLORS[:footer], # Spare Leash Green
      "data" => {

        # CUSTOM MESSAGES SENT TO USER
        # Ekaterina can edit!
        "first" => "Updates from EXEQUTE!",
        "keyword1" => "#{params[:activity_name]}",
        "keyword2" => "exeQute JingAn",
        "keyword3" => "425, Yanping Rd, 1F",
        "keyword4" => "#{params[:activity_time]}",
        "remark" => "Check it out now!"
      }
    }
  end

  def self.noshow(params={})
    puts "INSIDE NO SHOW"
    {
      "template_id" => "siNd6GpH_dAD9k8gIHE0sz384YGb96Dx0uG3_Qr8FVQ", #新订单通知
      "receiver" => params[:openid], # receiver's openid
      "unionid" => params[:unionid], # will be used if openid is blank
      "pagepath" => (params[:pagepath] || "PAGEPATH"), # Reirect to an MP page on tap
      "header_color" => COLORS[:header], # RED
      "body_color" => COLORS[:body], # BLUE
      "footer_color" => COLORS[:footer], # Spare Leash Green
      "data" => {

        # CUSTOM MESSAGES SENT TO USER
        # Ekaterina can edit!
        "first" => "NO-SHOW UPDATE",
        "keyword1" => "#{params[:user_name]}",
        "keyword2" => "#{params[:membership_id]}",
        "keyword3" => "#{params[:ts_time]}",
        "keyword4" => "#{params[:ts_name]}",
        "remark" => "Check it out now!"
      }
    }
  end

  def self.trainingsession_cancel(params={})
    {
      "template_id" => "siNd6GpH_dAD9k8gIHE0sz384YGb96Dx0uG3_Qr8FVQ", #新订单通知
      "receiver" => params[:openid],#(params[:openid] || "OPENID"), # receiver's openid
      "unionid" => params[:unionid], # will be used if openid is blank
      "pagepath" => (params[:pagepath] || "PAGEPATH"), # Reirect to an MP page on tap
      "header_color" => COLORS[:header], # RED
      "body_color" => COLORS[:body], # BLUE
      "footer_color" => COLORS[:footer], # Spare Leash Green
      "data" => {
        "first" => "This training session was cancelled.　你预约了的课被取消了。",
        "keyword1" => "#{params[:ts_name]}",
        "keyword2" => "exeQute JingAn",
        "keyword3" => "425, Yanping Rd, 1F",
        "keyword4" => "#{params[:ts_time]}",
        "remark" => "If you booked with voucher/drop-in, your voucher has already been returned to your account."
      }
    }
  end



  # ======================================================
  #                 API CONNECTORS
  #                  DON'T TOUCH!
  # ======================================================
  def self.token_expired?
    return true if self.token.nil?
    expiration = self.token_time + 100.minutes
    return false if expiration > Time.now
    return true
  end

  def self.get_token
    if self.token_expired?
      self.set_token
    end
    return self.token
  end

  def self.set_token
    # app_id = Rails.application.credentials.dig(:wx_mp_app_id)
    # app_secret = Rails.application.credentials.dig(:wx_mp_app_secret)
    # token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{app_id}&secret=#{app_secret}"
    # result = RestClient.get(token_url)
    self.oa_service ||= OaService.new
    p "OA SERVICE IN SET TOKEN"
    p self.oa_service
    access_token = oa_service.access_token
    if access_token.present?
      self.token = access_token
      self.token_time = Time.now
    else
      p 'get token failed'
    end
  end

  def self.fetch_token(again=false)
    puts "fetching wx oa token..."
    url = 'https://exequte.cn/wx_token'
    url += "?again=true" if again
    RestClient.get(url).body
  end

  def self.notify!(params={})
    puts 'INSIDE NOFIFY! (NOTIFIER)'
    if params["second_attempt"]
      token = self.fetch_token(true)
    else
      token = self.fetch_token
    end

    params["receiver"] = self.set_user_oa_open_id(params["unionid"], token) if params["receiver"].blank?


    # oa_users.find{|x| x['unionid'] == ?????}
    post_msg = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=#{token}"
    data = {}
    params["data"].each do |k,v|
      color = params["body_color"]
      color = params["header_color"] if k == "first"
      color = params["footer_color"] if k == "remark"
      data[k] = {"value"=> v, "color"=> color}
    end
    miniprogram = {
      "appid" => Rails.application.credentials.wx_mp_app_id
    }
    miniprogram["pagepath"] = params["pagepath"] if params["pagepath"].present?
    msg = {
      "touser"=> params["receiver"],
      "template_id"=> params["template_id"],
      "miniprogram"=> miniprogram,
      "data"=> data
    }
    msg["url"] = params["redirect_url"] if params["redirect_url"].present?

    p '------start send msg--------'
    p msg
    result = RestClient.post(post_msg, msg.to_json)
    p JSON.parse(result)

    errcode  = JSON.parse(result)["errcode"]
    if ["0", 0].include? errcode
      p 'sent out!'
      return true
    elsif params["second_attempt"].blank?
      5.times{p "--------FATAL------ MSG SEND FAILED"}
      p "Trying again..."
      params["second_attempt"] = true
      self.notify!(params)
    else
      5.times{p "--------FATAL------ MSG SEND FAILED"}
      return false
    end
  end

  def subscribe?
    check_sub_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=#{access_token}&openid=#{openid}&lang=zh_CN"
    result = RestClient.get check_sub_url
    subscribe = JSON.parse(result)["subscribe"]
    subscribe == 1 ? false : true
  end

  def self.set_js_ticket
    token = self.get_token
    jsapi_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=#{token}&type=jsapi"
    result = RestClient.get(jsapi_url)
    r = JSON.parse(result)
    if !r["ticket"].nil?
      self.js_ticket_time = Time.now
      self.js_ticket = r["ticket"]
    else
      p 'get js_ticket failed'
    end
  end


  def self.get_js_ticket
    return SecureRandom.hex if Rails.env == "development"

    if self.js_ticket_expired?
      self.set_js_ticket
    else
      return self.js_ticket
    end
  end

  def self.js_ticket_expired?
    return true if self.js_ticket.nil?
    expiration = self.js_ticket_time + 110.minutes
    return false if expiration > Time.now
    return true
  end

  def self.set_oa_users(wx_token)
    self.oa_service ||= OaService.new
    self.oa_service.access_token = wx_token
    users = self.oa_service.get_users_info
    if users.present?
      self.oa_users_time = Time.now
      self.oa_users = users
    else
      p 'failed to get oa_users'
    end
  end

  def self.get_oa_users(wx_token)
    self.oa_users_expired? ? self.set_oa_users(wx_token) : self.oa_users
  end

  def self.oa_users_expired?
    return true if self.oa_users.nil?
    expiration = self.oa_users_time + 1.day
    return false if expiration > Time.now
    return true
  end

  # gets the list of OA subscribers, finds the right subscriber by union id, updates user and returns the openid
  def self.set_user_oa_open_id(union_id, wx_token)
    puts "SETTING OA OPEN ID"
    oa_users = self.get_oa_users(wx_token)
    oa_user = oa_users.find{|x| x["unionid"] == union_id }
    return unless oa_user.present?

    User.find_by(union_id: union_id).update(oa_open_id: oa_user["openid"], oa_info: oa_user)
    oa_user["openid"]
  end
end
