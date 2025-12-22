# module Concerns
module MessageScheduler
  module WxBooking
    def booking_new
      set = ["booking_reminder"]
    end

    def booking_update
      ["booking_cancelled_notify_queue"]
    end

    def booking_reminder
      # return unless self.user.admin # TEST MODE
      puts "PREPARING NEW REMINDER FOR BOOKING"
      ts = self.training_session

      note_params = {
        openid: self.user.oa_open_id,
        unionid: self.user.union_id,
        pagepath: "pages/booking-info/booking-info?bookingId=#{self.id}&instructorId=#{ts.instructor.id}",
        ts_name: ts.full_name,
        ts_time: "Tomorrow, #{DateTimeService.time_12_h_m(ts.begins_at)}",
        ts_cancel_before: ts.cancel_before ? ts.cancel_before : 3
      }
      wx_params = WechatNotifier.booking_reminder(note_params)
      wx_params[:deliver_at] = booking_reminder_notification_time
      wx_params
    end
  end
end
# end
