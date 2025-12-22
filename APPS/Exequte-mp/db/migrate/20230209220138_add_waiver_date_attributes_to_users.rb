class AddWaiverDateAttributesToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :waiver_signed_at, :datetime
  end
end
