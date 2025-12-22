class AddCouponToMemberships < ActiveRecord::Migration[6.0]
  def change
    add_column :memberships, :coupon, :string
  end
end
