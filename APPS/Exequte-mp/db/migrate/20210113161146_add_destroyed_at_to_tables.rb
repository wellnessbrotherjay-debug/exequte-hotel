class AddDestroyedAtToTables < ActiveRecord::Migration[6.0]
  def change
    add_column :banners, :destroyed_at, :datetime
    add_column :bookings, :destroyed_at, :datetime
    add_column :class_types, :destroyed_at, :datetime
    add_column :coupons, :destroyed_at, :datetime
    add_column :infos, :destroyed_at, :datetime
    add_column :memberships, :destroyed_at, :datetime
    add_column :membership_types, :destroyed_at, :datetime
    add_column :trainings, :destroyed_at, :datetime
    add_column :training_sessions, :destroyed_at, :datetime
    add_column :users, :destroyed_at, :datetime
    add_column :user_coupons, :destroyed_at, :datetime
  end
end
