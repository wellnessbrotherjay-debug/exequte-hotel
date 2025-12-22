class AddCouponToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :coupon, :string
  end
end
