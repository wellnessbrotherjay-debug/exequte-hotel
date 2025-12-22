module Api
  module V1
    class TrainingSessionsController < Api::BaseController
      before_action :find_training_session, only: [:show, :add_user_to_queue, :session_attendance, :cancel, :change_capacity]
      before_action :choose_date_range, only: %i[index dates_list]
      skip_before_action :authenticate_api_key!, only: [:current, :current_hrm, :current_switch_block]
      skip_before_action :authenticate_user_from_token!, only: [:current, :current_hrm, :current_switch_block]


      def index
        render_success(@date_range.to_a)#.map { |d| DateTimeService.date_wd_d_m(d) })
      end

      def sessions
        date_str = params[:date]
        # Check if date_str is nil
        if date_str.nil? || date_str.empty?
          empty_sessions = []
          render_success(empty_sessions)
          return
        end
        date_str[-6] = '+'
        date = date_str.to_datetime
        puts "Date: #{date}"
        puts "today: #{DateTime.now.midnight}"
        puts "Date is today? #{date == DateTime.now.midnight}"
        time_range = date == DateTime.now.midnight ? Time.now..date.end_of_day : date.beginning_of_day..date.end_of_day
        if date == DateTime.now.midnight
          sessions = []
          time_range = (Time.now - 30.minutes)..date.end_of_day
          session_all = TrainingSession.includes(:bookings, :training, bookings: [:user], training: [:class_type]).where(begins_at: time_range, cancelled: false)
          session_all.each do | s |
            puts "======#{s.late_booking_minutes}"
            if s.late_booking_minutes != nil && s.late_booking_minutes > 0
              puts "======#{s.name} session begins at #{s.begins_at}, delay is #{s.late_booking_minutes}"
              late_cancel_interval = s.begins_at.advance(:minutes => s.late_booking_minutes)
              if Time.now.before? late_cancel_interval
                puts "======session begins at #{s.begins_at}, delay is #{s.late_booking_minutes} can show until #{late_cancel_interval}  "
                sessions.append(s)
              end
            else
              puts "===== no late booking minutes specificed, check if session has started already"
              if Time.now.before? s.begins_at
                sessions.append(s)
              end
            end
          end
          sessions = sessions.map { |ts| ts_to_hash(ts) }
        else
          sessions = TrainingSession.includes(:bookings, :training, bookings: [:user], training: [:class_type]).where(begins_at: time_range, cancelled: false).order(begins_at: :asc).map { |ts| ts_to_hash(ts) }
        end
        render_success(sessions)
      end

      def cancel
        @training_session.cancelled = true
        @training_session.cancelled_at = DateTime.now
        cancellation_note = params[:note] ? params[:note] : "no reason provided"
        puts "==================training session #{@training_session.name} was canceled with this reason #{cancellation_note}==============="
        @training_session.note = cancellation_note
        puts "===================training session cancelled at #{@training_session.cancelled_at} ========================="
        if @training_session.save
           @training_session.bookings.settled.each do | booking|
             #only refund for bookings that were not cancelled
             if booking.cancelled == false
              puts "#{booking.user.full_name} booked class #{booking.training_session.name}  with #{booking.booked_with}"
              begin
                #return voucher if paid with drop-in or voucher
                if %w[voucher drop-in class-pack].include?(booking.booked_with)
                  puts "current user voucher #{booking.user.voucher_count}"
                  booking.user.return_voucher!
                else
                  puts "current user booked with membership, do nothing"
                end
                puts "notify cancellation for this booking"
                begin
                  TrainingSession.notify_cancellation_single(booking)
                rescue => e
                  puts e
                  puts  "===================SOMETHING WENT WRONG SENDING NOTIFICATION SINGLE, ABORT========================="
                end
                #cancel the bookings
                puts "==============canceling bookings========="
                booking.cancelled = true
                booking.attended = false
                booking.cancelled_at = DateTime.now
                if booking.save
                  puts "===================booking cancelled at #{booking.cancelled_at} ========================="
                else
                  # render error
                end
              rescue => exceptionThrown
                puts exceptionThrown
                puts  "===================SOMETHING WENT WRONG, ABORT========================="
              end
             end
           end
           #puts "=========ABOUT TO SEND WECHAT TEMPLATE MSG FOR CLASS CANCELLATION========"
          #@todo modify below line to be a training session cancellation message
          #TrainingSession.notify_cancellation(@training_session)
          render_success({msg: "Cancelled"})
        else
          # render error
        end
      end

      def change_capacity
        @training_session.updated_at = DateTime.now
        new_capacity = params[:capacity]
        puts "==================training session #{@training_session.name}  had this training capacity  #{@training_session.capacity}, changing to #{new_capacity} ==============="
        @training_session.capacity = new_capacity
        if @training_session.save
          puts "=========about to update users in the queue about new capacity========"
          TrainingSession.notify_queue(@training_session)
          render_success({msg: "Capacity changed"})
        else
          render_error({ message: 'Something went wrong' })
        end
      end

      def show
        render_success(ts_to_show_hash(@training_session))
      end

      def add_user_to_queue
        @training_session.queue << current_user.id
        @training_session.save
        render_success(ts_to_show_hash(@training_session))
      end

      def instructor_sessions
        history_ts = current_user
        .training_sessions_as_instructor
        .where('begins_at <= ?', DateTime.now)
        .where(cancelled: false)
        .order(begins_at: :desc)
        .map(&:history_hash)
        upcoming_ts = current_user
        .training_sessions_as_instructor
        .where('begins_at >= ?', DateTime.now)
        .where(cancelled: false)
        .order(:begins_at)
        .map(&:upcoming_hash)
        sessions = [upcoming_ts, history_ts]
        render_success(sessions)
      end

      def admin_sessions
        today = DateTime.now.midnight
        last_day_future = today + 7.days - 1.second
        last_day_past = today - 7.days - 1.second
        date_range_history = (last_day_past..today)
        date_range_future = (today..last_day_future)
        puts "--------#{date_range_history}---------"
        puts "--------#{date_range_future}---------"
        history_ts = TrainingSession.where(
                        begins_at: date_range_history,
                        cancelled: false)
                       .order(begins_at: :desc)
                       .map(&:history_hash)
        upcoming_ts = TrainingSession.where(
                        begins_at: date_range_future,
                        cancelled: false)
                        .order(:begins_at)
                        .map(&:upcoming_hash)
        sessions = [upcoming_ts, history_ts]
        render_success(sessions)
      end

      def current
        location = params[:location]
        current_session_time_start_bottom_range = DateTime.now - 60.minutes
        current_session_time_start_top_range = DateTime.now + 60.minutes
        current_session_time_start_range = (current_session_time_start_bottom_range..current_session_time_start_top_range)
        puts "--------#{current_session_time_start_range}---------"
        current_ts = TrainingSession.where(
          begins_at: current_session_time_start_range,
          location: location.present? ? location : '',
          cancelled: false)
          .map(&:show_workout_ts)
        puts current_ts
        render_success(current_ts)
      end

      def current_hrm_old
        location = params[:location]
        current_session_time_start_bottom_range = DateTime.now - 60.minutes
        current_session_time_start_top_range = DateTime.now + 60.minutes
        current_session_time_start_range = (current_session_time_start_bottom_range..current_session_time_start_top_range)
        puts "--------#{current_session_time_start_range}---------"

        # Fetch current training sessions with hrm_assignments
        current_sessions_with_hrm = TrainingSession.includes(:hrm_assignments)
                                                   .where(
                                                     begins_at: current_session_time_start_range,
                                                     location: location.present? ? location : '',
                                                     cancelled: false
                                                   )

        current_ts = current_sessions_with_hrm.map(&:show_assignment_ts)
        puts current_ts
        render_success(current_ts)
      end

      def current_hrm
        location = params[:location]
        current_time = DateTime.now
        # Fetch current training sessions with hrm_assignments
        current_sessions_with_hrm = TrainingSession.includes(:hrm_assignments)
                                                   .where(
                                                     "begins_at <= ? AND ? <= (begins_at + duration * interval '1 minute') AND location = ? AND cancelled = ?",
                                                     current_time,
                                                     current_time,
                                                     location.present? ? location : '',
                                                     false
                                                   )
        current_ts = current_sessions_with_hrm.map(&:show_assignment_ts)
        puts current_ts
        render_success(current_ts)
      end

      def current_switch_block_old
        block_name = params[:name]
        location = params[:location]
        current_session_time_start_bottom_range = DateTime.now - 60.minutes
        current_session_time_start_top_range = DateTime.now + 60.minutes
        current_session_time_start_range = (current_session_time_start_bottom_range..current_session_time_start_top_range)
        puts "--------#{current_session_time_start_range}---------"
        current_ts = TrainingSession.find_by(
          begins_at: current_session_time_start_range,
          location: location.present? ? location : '',
          cancelled: false)
        if current_ts.present?
          puts "==================training session #{current_ts.name}"
          puts "==================training session #{current_ts.name}  had this training block  #{current_ts.current_block}, changing to #{block_name} ==============="
          current_ts.current_block = block_name
          if current_ts.save
            puts "=========training session block updated successfully========"
            render_success({msg: "block changed"})
          else
            render_error({ message: 'Something went wrong' })
          end
        else
          puts "==================no active training session found"
        end
      end

      def current_switch_block
        block_name = params[:name]
        location = params[:location]
        current_time = DateTime.now

        # Fetch current training sessions with hrm_assignments
        current_ts = TrainingSession.where("begins_at <= ? AND ? <= (begins_at + duration * interval '1 minute') AND location = ? AND cancelled = ?",
                                           current_time,
                                           current_time,
                                           location.present? ? location : '',
                                           false
        ).first  # Use .first to get a single record

        if current_ts.present?
          puts "==================training session #{current_ts.name}"
          puts "==================training session #{current_ts.name}  had this training block  #{current_ts.current_block}, changing to #{block_name} ==============="

          # Check if current_ts has the attribute current_block
          if current_ts.respond_to?(:current_block)
            current_ts.current_block = block_name

            if current_ts.save
              puts "=========training session block updated successfully========"
              render_success({msg: "block changed"})
            else
              render_error({ message: 'Something went wrong' })
            end
          else
            puts "==================current_ts does not respond to current_block"
            render_error({ message: 'current_ts does not respond to current_block' })
          end
        else
          puts "==================no active training session found"
        end
      end

      def dates_list
        @training_sessions = TrainingSession.where(
          training_id: params[:training_id],
          begins_at: @date_range,
          cancelled: false
        ).order(begins_at: :asc)
        render_success(@training_sessions.map { |ts| ts_to_hash(ts).merge!(ts.date_list_hash) })
      end

      def session_attendance
        render_success(@training_session.attendance_hash)
      end

      private

      def choose_date_range
        #show also sessions that have already started in 20 minutes
        today = DateTime.now.midnight
        last_day = today + 14.days - 1.second
        @date_range = (today..last_day)
      end

      def ts_to_show_hash(training_session)
        ts_to_hash(training_session).merge!(training_session.show_hash)
      end

      def find_training_session
        @training_session = TrainingSession.find(params[:id])
      end

      def ts_to_hash(training_session)
        h = training_session.standard_hash
        h[:price] = training_session_price(training_session)
        h[:btn_pattern] = btn_pattern(training_session)
        h[:hrm] = hrm_assigned(training_session)
        h[:access_options] = access_options(training_session)
        membership_to_use = usable_membership(training_session)
        begin
          sessions_left = sessions_left_for_day(training_session)
          puts "====how many sessions left:#{sessions_left}"
          if membership_to_use
            if sessions_left == -1
              # -1 means unlimited membership
              h[:usable_membership] = usable_membership(training_session).booking_hash
            else
              if sessions_left > 0
                h[:usable_membership] = usable_membership(training_session).booking_hash_limited(sessions_left)
              end
            end
          else
            puts "==== no membership can be used"
          end
        rescue => e
          puts "====something went wrong computing session left, return normal membership"
          h[:usable_membership] = usable_membership(training_session).booking_hash if membership_to_use
        end
        h[:usable_classpack] = usable_classpack(training_session).booking_hash if usable_classpack(training_session)
        # begin
        # workout = show_workout(training_session)
        # if workout
        #   puts "found associated workout"
        #   h[:workout] = workout
        # end
        # rescue => e
        #   puts e
        # end
        h
      end

      def training_session_price(training_session)
        kind = training_session.class_kind
        prices = current_user.prices
        training_session.attributes[prices[kind]].fdiv(100)
      end

      def hrm_assigned(training_session)
        booked = current_user.bookings.with_ts.any? { |b| b.training_session.id == training_session.id && !b.cancelled && b.settled? }
        if booked
          current_user.bookings.with_ts.each do | b|
            if b.training_session.id == training_session.id && !b.cancelled && b.settled?
              if b.hrm
                return b.hrm
              end
              break
            end
          end
        end
      end

      def btn_pattern(training_session)
        booked = current_user.bookings.with_ts.any? { |b| b.training_session.id == training_session.id && !b.cancelled && b.settled? }
        if booked
          booking = nil
          current_user.bookings.with_ts.each do | b|
            if b.training_session.id == training_session.id && !b.cancelled && b.settled?
              booking = b
              break
            end
          end
        end
        queued_up = training_session.queue.include?(current_user.id)

        return { disabled: false, action: nil, text: "BOOKED", can_cancel: true, cancel_text: "CANCEL", booking: booking } if booked
        return { disabled: false, action: 'navigateToBooking', text: "COMMIT" } if training_session.can_book? && !booked
        return { disabled: true, action: nil, text: "IN QUEUE" } if queued_up

        { disabled: false, action: 'queueUp', text: "QUEUE UP" }
      end

      def access_options(training_session)
        return { free: true } if training_session.class_kind == 3

        options = { drop_in: true }
        return options if training_session.class_kind == 1

        options[:voucher] = true if current_user.voucher_count.positive?
        options[:membership] = membership_option(training_session)
        options[:classpack] = classpack_option(training_session)
        options
      end

      def sessions_left_for_day(training_session)
        current_active_memberships = current_user.memberships.not_classpack.settled.find_by(
          'start_date <= ? AND end_date > ?',
          training_session.begins_at,
          training_session.begins_at
        )
        begin
          if current_active_memberships
            if current_active_memberships.unlimited?
              return -1
            else
              limit_bookings = current_active_memberships.bookings_per_day
              bookings_for_date_count = current_user.bookings_date?(training_session.begins_at)
              if bookings_for_date_count
                return limit_bookings - bookings_for_date_count
              else
                return limit_bookings
              end
            end
          end
        rescue => e
          puts "====something went wrong, return -1"
          puts e
          return -1
        end
      end

      def usable_membership_for_limited_class(training_session, membership)
        if membership
            class_pack_type = membership.membership_type
            is_allowed = false
            training_session_name = training_session.training.name
            class_pack_type.trainings.each do | t |
              if training_session_name == t.name
                is_allowed = true
                break
              end
            end
            if is_allowed
              return true
            else
              return false
            end
          end
      end


      def usable_membership(training_session)
        current_active_memberships = current_user.memberships.not_classpack.settled.find_by(
          'start_date <= ? AND end_date > ?',
          training_session.begins_at,
          training_session.begins_at
        )
        begin
          if current_active_memberships
            if training_session.training.is_limited
              is_allowed = usable_membership_for_limited_class(training_session, current_active_memberships)
              if (!is_allowed)
                return false
              end
            else
              current_active_memberships = current_user.memberships.not_classpack.is_not_limited.settled.find_by(
                'start_date <= ? AND end_date > ?',
                training_session.begins_at,
                training_session.begins_at
              )
            end
            puts "======== FOUND THIS MEMBERSHIP : #{current_active_memberships.name}, #{current_active_memberships.unlimited?}========"
            if current_active_memberships.unlimited?
              return current_active_memberships
            else
              puts "======== LIMITED MEMBERSHIP, CHECK DAILY BOOKINGS FOR DATE:#{training_session.begins_at.beginning_of_day}"
              puts "======== LIMIT PER DAY: #{current_active_memberships.bookings_per_day} ===="
              limit_bookings = current_active_memberships.bookings_per_day
              bookings_for_date_count = current_user.bookings_date?(training_session.begins_at)
              if bookings_for_date_count
                puts "======== DATE:#{training_session.begins_at.beginning_of_day} BOOKINGS: #{bookings_for_date_count}"
                if bookings_for_date_count < limit_bookings
                  puts "======== BOOKED #{bookings_for_date_count} CLASS, CAN STILL BOOK======"
                  return current_active_memberships
                else
                  puts "======== ALREADY EXHAUSTED BOOKINGS FOR TODAY, CANNOT PURCHASE MORE CLASSES======"
                  return false
                end
              else
                puts "======== NO BOOKINGS FOR THAT DAY, CAN STILL BOOK======"
                return current_active_memberships
              end
            end
          end
        rescue => e
          puts "====something went wrong, return current membership"
          puts e
          return current_active_memberships
        end
      end

      def usable_classpack(training_session)
        current_active_classpack = current_user.memberships.classpack.find_by(
          'start_date <= ? AND end_date > ? AND vouchers > 0',
          training_session.begins_at,
          training_session.begins_at
        )
        begin
          if training_session.training.is_limited
            is_allowed = usable_membership_for_limited_class(training_session, current_active_classpack)
            if (!is_allowed)
              return false
            else
              return current_active_classpack
            end
          else
            current_active_classpack = current_user.memberships.classpack.is_not_limited.find_by(
              'start_date <= ? AND end_date > ? AND vouchers > 0',
              training_session.begins_at,
              training_session.begins_at
            )
            return current_active_classpack
          end
        rescue => e
          puts "====something went wrong, return current classpack"
          puts e
          return current_active_classpack
        end


        # if training_session.is_limited
        #   puts ">>>>>>>>>>this training session #{training_session.name} is limited, only allow certain type of memberships"
        #   if current_active_classpack
        #     class_pack_type = current_active_classpack.membership_type
        #     puts ">>>>>>>>>>>>>>#{class_pack_type.name}"
        #     is_allowed = false
        #     training_session_name = training_session.training.name
        #     class_pack_type.trainings.each do | t |
        #       puts ">>>checking #{training_session_name} and #{t.name}"
        #       if training_session_name == t.name
        #         is_allowed = true
        #         break
        #       end
        #     end
        #     puts ">>>>is_allowed=#{is_allowed}"
        #     if is_allowed
        #       return current_active_classpack
        #     else
        #       puts ">>no class pack suitables"
        #       return false
        #     end
        #   end
        # end
      end

      def upcoming_membership(training_session)
        current_user.memberships.settled.find_by(
          'start_date >  ?',
          training_session.begins_at
        )
      end

      def membership_option(training_session)
        return 'membership' if usable_membership(training_session)

        'buy-membership' unless upcoming_membership(training_session)
      end

      def classpack_option(training_session)
        return 'classpack' if usable_classpack(training_session)
      end

      def show_workout(training_session)
        if training_session.workouts
          current = training_session.workouts[0]
          return current.show_hash_blocks
        end
      end
    end
  end
end
