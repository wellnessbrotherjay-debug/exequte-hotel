class AddLimitToMemberships < ActiveRecord::Migration[6.0]
  def change
    add_column :memberships, :bookings_per_day, :integer
    add_column :membership_types, :bookings_per_day, :integer
  end
end
