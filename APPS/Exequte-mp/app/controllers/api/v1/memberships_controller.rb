module Api
  module V1
    class MembershipsController < Api::BaseController
      skip_before_action :authenticate_api_key!, only: [:payment_confirmed]
      skip_before_action :authenticate_user_from_token!, only: [:payment_confirmed]
      before_action :find_membership, only: [:destroy]


      def create
        puts "===================INSIDE MEMBERSHIPS CREATE========================="
        @membership_type = MembershipType.find(params[:membership_type_id])
        puts "===================FOUND MEMBERSHIP TYPE========================="
        p @membership_type
        @membership = Membership.new(permitted_params)
        puts "=============MEMBERSHIP PARAMS===================="
        p permitted_params
        puts "===================NEW MEMBERSHIP PARAMS OK========================="

        @membership.name = @membership_type.name
        @membership.cn_name = @membership_type.cn_name
        @membership.smoothie = @membership_type.smoothie
        @membership.vouchers = @membership_type.vouchers
        @membership.bookings_per_day = @membership_type.bookings_per_day
        @membership.is_trial = @membership_type.is_trial
        @membership.is_limited = @membership_type.is_limited
        @membership.is_class_pack = @membership_type.is_class_pack
        @membership.end_date = end_date
        @membership.membership_type = @membership_type
        @membership.payment_status = 'pending'
        # @membership.price = @membership_type.price
        @membership.user = current_user
        puts "===================VALUES ASSIGNED========================="
        p @membership

        if @membership.save
          puts "===================MEMBERSHIP IS SAVED========================="
          res = @membership.init_payment
          puts "===================PARAMS ARE GOING TO BE SENT TO MP========================="
          p res
          render_success(membership: @membership, res: res)
          # render_success(@membership.standard_hash) // this will move to notify
        else
          # render_error
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
          @membership = Membership.find(Membership.extract_id(result['out_trade_no']))
          puts "===================MEMBERSHIP FOUNT========================="

          @membership.update(payment_status: 'paid', payment: result.to_json)
          puts "===================MEMBERSHIP UPDATED========================="
          p @membership
          render xml: { return_code: 'SUCCESS', return_msg: 'OK' }.to_xml(root: 'xml', dasherize: false)
        else
          puts "===================SIGNATURE ERROR========================="
          render :xml => {return_code: "FAIL", return_msg: "Signature Error"}.to_xml(root: 'xml', dasherize: false)
        end
      end

      def destroy
        @membership.destroy
        render_success({msg: "Failed membership destroyed"})
      end

      private

      def find_membership
        @membership = Membership.find(params[:id])
      end

      def end_date
        @membership.start_date.midnight + @membership_type.duration.days - 1.second
      end

      def permitted_params
        puts "====================INSIDE PERMITTED PARAMS============================"
        # pars = params.require(:membership)
        # pars.each { |par| puts "param: #{par[1]} class: #{par[1].class}" }
        p params
        params.require(:membership).permit(:start_date, :price_cents, :coupon)
      end
    end
  end
end
