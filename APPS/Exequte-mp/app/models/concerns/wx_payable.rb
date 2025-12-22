module WxPayable
  extend ActiveSupport::Concern
  class_methods do
    def extract_id(result)
      regex = /(?<=_)\d+/
      result[regex].to_i
    end
  end

  def pay_params
    url = Rails.env.development? ? 'exequte.vipgz4.idcfengye.com/api/v1' : "https://exequte.cn/api/v1"
    singular = model_name.singular
    plural = model_name.plural
    h = {
      body: "exeQute gym #{plural}",
      out_trade_no: "xQ_#{singular}_#{id}_#{DateTime.now.to_i}",
      total_fee: price_cents,
      spbill_create_ip: Socket.ip_address_list.detect(&:ipv4_private?).ip_address,
      notify_url: "#{url}/#{plural}/notify",
      trade_type: "JSAPI",
      openid: user.wx_open_id
    }
    puts "============OUT TRADE NUMBER=============="
    p h[:out_trade_no]
    p "Length:"
    p h[:out_trade_no].size
    h
  end

  def init_payment
    r = WxPay::Service.invoke_unifiedorder pay_params
    puts "============================INVOKE RESULT===================================="
    p r
    if r.success?
      params = {
        prepayid: r["prepay_id"],
        noncestr: r["nonce_str"]
      }
      puts "===================PARAMS FORMED========================="

      p params
      return WxPay::Service.generate_js_pay_req params
    else
      puts "===================INVOKE FAILED========================="
      p params
    end
  end
end
