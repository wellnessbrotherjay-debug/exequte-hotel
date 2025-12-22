# module Concerns
module MessageScheduler
  module WxTrainingSession
    def training_session_new
      set = []
    end

    def booking_update
      ["training_session_"]
    end

    def training_session_free_spot(user)
      puts "PREPARING NEW NOTIFICATION FOR TRAINING_SESSION"
      begins_at = self.training_session.begins_at
      note_params = {
        openid: self.user.openid,
        pagepath: "booking-details?id=#{self.id}",
        ts_name: self.training_session.localize_name,
        ts_time: DateTimeService.time_24_h_m(begins_at)
      }
      wx_params = WechatNotifier.job_reminder(note_params)
      wx_params[:deliver_at] = begins_at - 4.hours
      wx_params
    end
  end
end
