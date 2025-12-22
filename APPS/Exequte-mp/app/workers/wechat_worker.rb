class WechatWorker
  include Sidekiq::Worker

  def perform(action, obj_hash, wx_params={})
    # for backwards compatibility
    if wx_params.blank?
      wx_params = obj_hash
      obj_hash = action
    end


    # 5.times{puts ""}
    puts "WECHAT NOTIFICATION WORKER START!!!"

    p obj_hash
    p wx_params

    return true if notification_not_needed?(obj_hash)

    # return true if Rails.env == "development"
    return true if ENV["staging"] == "true"
    # update object w/ most recent database updates
    unless obj_hash.class == String
      obj_class = obj_hash["model"].constantize
      obj = obj_class.find_by(id: obj_hash["id"])

      return true if obj.blank?
    end
    # check for condition
    if wx_params["condition"].present? && obj_hash.class != String
      p "WORKER RUNNING CONDITION: #{wx_params["condition"]}"
      condition = obj.send(wx_params["condition"].to_sym)
    else
      p "DEFAULT TRUE for NO CONDITION"
      condition = true
    end

    if condition
      puts "NOTIFICATION SENDING!"
      WechatNotifier.notify!(wx_params)
    end
  end

  private

  def notification_not_needed?(obj_hash)
    return false unless obj_hash["model"].present? && obj_hash["model"] == "Booking"
    booking = Booking.find_by(id: obj_hash["id"].to_i)
    return true if booking.blank?
    booking_cancelled?(booking) || booking_created_late(booking) || booking_unpaid?(booking)
  end

  def booking_unpaid?(booking)
    unpaid = !booking&.settled?
    puts "===========Booking unpaid=============="
    unpaid
  end

  def booking_cancelled?(booking)

    cancelled = booking&.cancelled
    puts "========Booking cancelled===========" if cancelled
    cancelled
  end

  def booking_created_late(booking)
    late = booking&.created_at > booking&.booking_reminder_notification_time
    puts "========Booking created late===========" if late
    return false if Rails.env.development?
    late
  end

end
