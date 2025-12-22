class AddActiveToTables < ActiveRecord::Migration[6.0]
  def change
    add_column :coupons, :active, :boolean, default: true
    add_column :membership_types, :active, :boolean, default: true
  end
end
