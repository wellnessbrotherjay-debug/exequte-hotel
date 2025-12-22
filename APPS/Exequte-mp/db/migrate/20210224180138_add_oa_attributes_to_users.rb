class AddOaAttributesToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :oa_open_id, :string
    add_column :users, :oa_info, :text
    add_column :users, :oa_subscribed_at, :integer
  end
end
