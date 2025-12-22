class CreateCoupons < ActiveRecord::Migration[6.0]
  def change
    create_table :coupons do |t|
      t.string :relation
      t.string :coupon_code
      t.float :discount
      t.text :note

      t.timestamps
    end
  end
end
