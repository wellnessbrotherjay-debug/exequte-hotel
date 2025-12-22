class AddVouchersToMemberships < ActiveRecord::Migration[6.0]
  def change
    add_column :memberships, :vouchers, :integer
    add_column :memberships, :is_class_pack, :boolean, :default => false
    add_column :membership_types, :vouchers, :integer
    add_column :membership_types, :is_class_pack, :boolean, :default => false
  end
end
