class AddLimitedToMemberships < ActiveRecord::Migration[6.0]
  def change
    add_column :membership_types, :is_limited, :boolean, :default => false
    add_column :memberships, :is_limited, :boolean, :default => false
  end
end
