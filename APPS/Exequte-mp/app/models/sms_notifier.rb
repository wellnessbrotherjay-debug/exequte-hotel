class SmsNotifier < ApplicationRecord
  def self.trainingsession_cancel(params={})
    session_name = params[:ts_name]
    session_time = params[:ts_time]
    phone = params[:phone]
    template_code = 'SMS_274545471'
    template_param = {"classname":session_name, "classtime": session_time}
    puts "about to send sms to #{phone}"
    if phone
      Aliyun::CloudSms.send_msg(phone, template_code, template_param )
      puts "sms sent"
    else
      puts ">>>customer did not provide phone, do not send SMS"
    end
  end
end