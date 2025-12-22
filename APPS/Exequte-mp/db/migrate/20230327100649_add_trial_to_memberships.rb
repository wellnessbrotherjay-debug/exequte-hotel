class AddTrialToMemberships < ActiveRecord::Migration[6.0]
  def change
    add_column :membership_types, :is_trial, :boolean, :default => false
    add_column :memberships, :is_trial, :boolean, :default => false
  end
end
