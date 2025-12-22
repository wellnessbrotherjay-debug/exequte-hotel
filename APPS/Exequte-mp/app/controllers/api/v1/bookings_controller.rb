module Api
  module V1
    class BookingsController < Api::BaseController
      skip_before_action :authenticate_api_key!, only: [:payment_confirmed]
      skip_before_action :authenticate_user_from_token!, only: [:payment_confirmed]
      before_action :find_training_session, only: %i[create attendance_list]
      before_action :find_booking, only: %i[show cancel destroy]
      def index
        render_success([upcoming, cancelled.concat(history)])
      end

      def show
        render_success(@booking.show_hash)
      end

      def create
        begin
          if current_user.bookings.where(cancelled: false, training_session: @training_session, payment_status: ['paid', 'none']).present?
            @logs = Log.new()
            @logs.log_type = "MULTIPLE BOOKING ATTEMPT"
            @logs.value = "#{current_user.full_name} (id:#{current_user.user_id}) is trying to book the class again #{@training_session.name} (time: #{@training_session.name} ) "
            if @logs.save
              puts "log save successful"
            else
              puts "error saving log"
            end
          end
        rescue => e
        end

        return render_success({msg: 'The class is full, please queue up'}) unless @training_session.can_book?

        return render_success({msg: 'Please fill in your profile'}) unless current_user.first_name.present?

        return render_success({msg: 'You have already booked this class'}) if current_user.bookings.where(cancelled: false, training_session: @training_session, payment_status: ['paid', 'none']).present?

        @booking = Booking.new(permitted_params)
        @booking.user = current_user
        @booking.training_session = @training_session
        @booking.payment_status = @booking.booked_with == 'drop-in' ?  'pending' : 'none'
        if @booking.save
          @training_session.queue.delete(current_user.id)
          @training_session.save
          @booking.user.use_voucher! if @booking.booked_with == "voucher"
          if @booking.booked_with == "class-pack"
            puts "===================REMOVING ONE VOUCHER FROM CLASS-PACK:========================="
            begin
              puts @booking.membership_id
              @membership = Membership.find(@booking.membership_id)
              puts "===================CLASS PACK MEMBERSHIP NAME:#{@membership.name}========================="
              @membership.use_voucher!
              if @membership.save
                puts "===================MEMBERSHIP IS SAVED========================="
              else
                puts "===================ERROR SAVING MEMBERSHIP========================="
              end
            rescue => e
              puts  "===================CLASS-PACK MEMBERSHIP NOT FOUND========================="
            end
          end
          #assign HRM devices
          begin
          if @booking.payment_status == 'none'
            puts  "===================ASSIGNING HRM========================="
            @booking.assign_hrm_to_training_session
            puts  "===================HRM ASSIGNED========================="
          end
          rescue => e
            puts  "===================ERROR ASSIGNING HRM========================="
          end
          response = {booking: @booking.standard_hash}
          response[:res] = @booking.init_payment if @booking.booked_with == "drop-in"
          render_success(response)
        else
          return render_error({msg: 'Booking was not created'})
        end
      end

      def payment_confirmed
        puts "===================PAYMENT CONFIRMED========================="
        # @membership = Membership.find(params[:id])
        result = Hash.from_xml(request.body.read)['xml']
        puts "===============RESULT=========================="
        p result
        logger.info result.inspect
        if WxPay::Sign.verify?(result)
          @booking = Booking.find(Booking.extract_id(result['out_trade_no']))
          puts "===================BOOKING FOUND========================="

          @booking.update(payment_status: 'paid', payment: result.to_json)
          puts "===================BOOKING UPDATED========================="
          p @booking
          begin
            puts  "===================ASSIGNING HRM========================="
            @booking.assign_hrm_to_training_session
          rescue => e
              puts  "===================ERROR ASSIGNING HRM========================="
          end
          render xml: { return_code: 'SUCCESS', return_msg: 'OK' }.to_xml(root: 'xml', dasherize: false)
        else
          puts "===================SIGNATURE ERROR========================="
          render :xml => {return_code: "FAIL", return_msg: "Signature Error"}.to_xml(root: 'xml', dasherize: false)
        end
      end

      def destroy
        @booking.destroy
        render_success({msg: "Failed booking destroyed"})
      end

      def cancel
        @booking.cancelled = true
        @booking.attended = false
        @booking.cancelled_at = DateTime.now
        puts "===================cancelled at #{@booking.cancelled_at} ========================="
        if @booking.save
          if @booking.cancelled_on_time?
            if %w[voucher drop-in].include?(@booking.booked_with)
              @booking.user.return_voucher!
              puts "===================RETURN VOUCHER========================="
            else
              if %w[class-pack].include?(@booking.booked_with)
                puts "===================RETURNING ONE VOUCHER TO CLASS-PACK:========================="
                begin
                  puts @booking.membership_id
                  @membership = Membership.find(@booking.membership_id)
                  puts "===================CLASS PACK MEMBERSHIP NAME:#{@membership.name}========================="
                  @membership.return_voucher!
                  if @membership.save
                    puts "===================MEMBERSHIP IS SAVED========================="
                  else
                    puts "===================ERROR SAVING MEMBERSHIP========================="
                  end
                rescue => e
                  puts  "===================CLASS-PACK MEMBERSHIP NOT FOUND========================="
                end
              else
                puts "===================NO VOUCHER========================="
              end
            end
            puts "===================CANCELED ON TIME========================="
          else
            puts "===================LATE CANCELLATION========================="
            if @booking.booked_with == "membership"
              if @booking.training_session.enforce_cancellation_policy
                puts "===================REMOVING ONE DAY========================="
                begin
                  puts @booking.membership_id
                  @membership = Membership.find(@booking.membership_id)
                  @membership.change_end_date(-1)
                  if @membership.save
                    puts "===================MEMBERSHIP IS SAVED========================="
                  else
                    puts "===================ERROR SAVING MEMBERSHIP========================="
                  end
                  @logs = Log.new()
                  @logs.log_type = "LATE CANCEL BOOKING (ENFORCED)"
                  @logs.value = "#{@booking.user.full_name} (id:#{@booking.user_id}) did a late cancellation on class #{@booking.training_session.name} (time: #{@booking.training_session.begins_at} ) with membership #{@membership.name} #{@membership.id}. The membership expiration date is now #{@membership.end_date}"
                  if @logs.save
                    puts "log save successful"
                  else
                    puts "error saving log"
                  end
                  # puts "NOTIFICATION FOR NOSHOW #{@booking.user.full_name}"
                  # puts "booking.user.oa_open_id:#{@booking.user.oa_open_id}"
                  # puts "booking.user.union_id:#{@booking.user.union_id}"
                  # # Not sure what obj_hash does so can be an error next line
                  # obj_hash  = {id: @booking.training_session.id, model:  @booking.training_session.model_name.name}
                  # note_params = {
                  #   openid: @booking.user.oa_open_id,
                  #   unionid: @booking.user.union_id, # needed to retrieve oa_open_id if it is not present
                  #   pagepath: "pages/class-info/class-info?sessionId=#{@booking.training_session.id}&instructorId=#{@booking.training_session.instructor.id}",
                  #   user_name: @booking.user.full_name,
                  #   ts_name: @booking.training_session.full_name,
                  #   membership_id: @booking.membership_id,
                  #   phone: @booking.user.phone,
                  #   # ts_date: DateTimeService.date_d_m_y(training_session.begins_at),
                  #   ts_time: "#{DateTimeService.date_d_m_y(@booking.training_session.begins_at)} #{DateTimeService.time_12_h_m(@booking.training_session.begins_at)}"
                  # }
                  # wx_params = WechatNotifier.noshow(note_params)
                  # WechatWorker.perform_async('noshow', obj_hash, wx_params)
                  # #WechatNotifier.notify!(wx_params)
                rescue => e
                  puts e
                  puts  "===================MEMBERSHIP NOT FOUND========================="
                end
              end
            else
              puts "===================ENFORCE CANCELLATION POLICY IS FALSE, DO NOT REMOVE DAYS, BUT STILL LOG IT========================="
              @logs = Log.new()
              @logs.log_type = "LATE CANCEL BOOKING NOT ENFORCED"
              @logs.value = "#{@booking.user.full_name} (id:#{@booking.user_id}) did a late cancellation on class #{@booking.training_session.name} (time: #{@booking.training_session.begins_at} )."
              if @logs.save
                puts "log save successful"
              else
                puts "error saving log"
              end
            end
          end
          TrainingSession.notify_queue(@booking.training_session)
          begin
            puts  "===================REMOVING HRM AFTER CANCELLATION========================="
            @booking.unassign_hrm_to_training_session
            puts  "===================HRM ASSIGNED REMOVED========================="
          rescue => e
          end
          render_success({msg: "Cancelled"})
        else
          # render error
        end
      end

      # def attendance_list
      #   bookings = @training_session.bookings.where(cancelled: false)
      #   render_success(bookings)
      # end

      def take_attendance
        attendance_arr = params["_json"]
        attendance_arr.each { |x| Booking.find(x[:id]).update(attended: x[:attended]) }
        render_success({message: "Attendance taken!"})
      end

      private

      def history
        Booking.for(current_user).history.map(&:history_hash)
      end

      def cancelled
        Booking.for(current_user).upcoming.cancelled.map(&:history_hash)
      end

      def upcoming
        Booking.for(current_user).upcoming.active.map(&:upcoming_hash)
      end

      def find_booking
        @booking = Booking.find(params[:id])
      end

      def find_training_session
        @training_session = TrainingSession.find(params[:training_session_id])
      end

      def permitted_params
        params.require(:booking).permit(:booked_with, :membership_id, :price_cents, :coupon)
      end
    end
  end
end
