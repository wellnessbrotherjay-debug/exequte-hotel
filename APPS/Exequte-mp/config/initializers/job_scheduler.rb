# Be sure to restart your server when you modify this file.

# ActiveSupport::Reloader.to_prepare do
#   ApplicationController.renderer.defaults.merge!(
#     http_host: 'example.org',
#     https: false
#   )
# end
require 'rufus/scheduler'
require 'redis'

redis = Redis.new(url: ENV['REDIS_URL'])

scheduler = Rufus::Scheduler.new

scheduler.cron '13 23 * * *' do
  # every day at 23:30 (11:30pm)
  puts "setting lock"
  lock = redis.setnx('daily_no_show_cancellation_policy_lock', true) # Try to set the lock
  if lock
    redis.expire('daily_no_show_cancellation_policy_lock', 60) # Set the lock to expire in 60 seconds
    begin
      @logs = Log.new()
      @logs.log_type = "NO-SHOW RUN"
      @logs.value = "running no-show at #{Time.now}"
      if @logs.save
        puts "log save successful"
      else
        puts "error saving log"
      end
    rescue => e
      puts "something went wrong running the function"
    end
    processed_bookings = []
    time_range = Time.now.beginning_of_day..Time.now.end_of_day
    training_sessions = TrainingSession.where(
      begins_at:  time_range,
      enforce_cancellation_policy: true
    ).order(begins_at: :asc)
    training_sessions.each do | training|
      puts "==========checking the training:#{training.name}, begins_at:#{training.begins_at}========"
      training.bookings.settled.where(cancelled: false, attended: false, booked_with: "membership").each do | booking|
        booking_id = booking.id
        if processed_bookings[booking_id] != "checked"
          puts "#{booking.user.full_name} did a no-show on class #{booking.training_session.name} with #{booking.membership_id}"
          processed_bookings[booking_id] = "checked"
          begin
            membership = Membership.find(booking.membership_id)
            begin
              noshow_automatically_deduct = Settings.find_by(key: "noshow_automatically_deduct").value
              send_notification_to_jay = Settings.find_by(key: "send_notification_to_jay").value
            rescue => e
              puts  "===================SETTING NOT FOUND, USING FALSE as DEFAULT ========================="
              noshow_automatically_deduct = false
              send_notification_to_jay = false
            end
            noshow_text = "BOOKING ID:#{booking.id} #{booking.user.full_name} (id:#{booking.user_id}) did a no-show on class #{booking.training_session.name} (time: #{booking.training_session.begins_at} ) with membership #{booking.membership_id}. AUTOMATIC 1 DAY PENALTY APPLIED, Their membership expiration date is now #{membership.end_date}"
            if noshow_automatically_deduct == "true"
              membership.change_end_date(-1)
              if membership.save
                puts "===================NO-SHOW DEDUCT MEMBERSHIP IS SAVED========================="
              else
                puts "===================ERROR SAVING MEMBERSHIP========================="
              end
            else
              noshow_text = "BOOKING ID:#{booking.id} | #{booking.user.full_name} (id:#{booking.user_id}) did a no-show on class #{booking.training_session.name} (time: #{booking.training_session.begins_at} ) with membership #{booking.membership_id}."
            end
            puts "about to add a log in the log table"
            @logs = Log.new()
            @logs.log_type = "NOSHOW_PENALTY"
            @logs.value = noshow_text
            if @logs.save
              puts "log save successful"
            else
              puts "error saving log"
            end
            if send_notification_to_jay == "true"
              begin
                puts "NOTIFICATION FOR NOSHOW #{booking.user.full_name}"
                puts "booking.user.oa_open_id:#{booking.user.oa_open_id}"
                puts "booking.user.union_id:#{booking.user.union_id}"
                #send notification to Jay's personal wechat
                # Not sure what obj_hash does so can be an error next line
                obj_hash  = {id: booking.training_session.id, model:  booking.training_session.model_name.name}
                note_params = {
                  openid: "oS9Rj6yc2qhkFgP5Z5q-sttzZ1dk",
                  unionid: "oJVlf6F2Mwc8xj4V5uPbvXDcvBH4", # needed to retrieve oa_open_id if it is not present
                  pagepath: "pages/class-info/class-info?sessionId=#{booking.training_session.id}&instructorId=#{booking.training_session.instructor.id}",
                  user_name: booking.user.full_name,
                  ts_name: booking.training_session.full_name,
                  membership_id: booking.membership_id,
                  phone: booking.user.phone,
                  # ts_date: DateTimeService.date_d_m_y(training_session.begins_at),
                  ts_time: "#{DateTimeService.date_d_m_y(booking.training_session.begins_at)} #{DateTimeService.time_12_h_m(booking.training_session.begins_at)}"
                }
                wx_params = WechatNotifier.noshow(note_params)
                WechatWorker.perform_async('noshow', obj_hash, wx_params)
                #WechatNotifier.notify!(wx_params)
              rescue => exceptionThrown
                puts exceptionThrown
                puts  "===================SOMETHING WENT WRONG, ABORT========================="
              end
            end
          rescue => e
            puts  "===================NO-SHOW MEMBERSHIP NOT FOUND, ABORT========================="
          end
        else
          puts "multiple bookings, already did a no-show for this user"
          puts "about to add a log in the log table"
          noshow_text = "#{booking.user.full_name} (id:#{booking.user_id}) booked this session #{booking.training_session.name} (time: #{booking.training_session.begins_at} ) with membership #{booking.membership_id} for multiple times. Do not process multiple refund."
          @logs = Log.new()
          @logs.log_type = "MULTIPLE_BOOKING_NOTICE"
          @logs.value = noshow_text
          if @logs.save
            puts "log save successful"
          else
            puts "error saving log"
          end
        end
      end
    end
    #redis.del('daily_no_show_cancellation_policy_lock') # Release the lock
  end
end