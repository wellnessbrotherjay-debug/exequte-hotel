module Api
  module V1
    class CouponsController < Api::BaseController
      def use_coupon
        @coupon = Coupon.active.find_by(coupon_code: params[:coupon_code])

        # Coupon does not exist
        if @coupon.nil?
          render_success({msg: "Coupon does not exist"})
          return
        end

        # Coupon exists
        @user_coupon = UserCoupon.new(user: current_user, coupon: @coupon)
        coupon_valid = current_user.bookings.find_by(coupon: @coupon.coupon_code).nil? && current_user.memberships.find_by(coupon: @coupon.coupon_code).nil?
        # User_coupon doesn't exists or wasn't used
        if @user_coupon.save || coupon_valid
          render_success(@coupon)
        else
          render_success({msg: "This coupon was used before"})
        end
      end
    end
  end
end
