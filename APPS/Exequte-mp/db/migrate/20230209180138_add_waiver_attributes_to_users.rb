class AddWaiverAttributesToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :waiver_signed, :boolean
  end
end
