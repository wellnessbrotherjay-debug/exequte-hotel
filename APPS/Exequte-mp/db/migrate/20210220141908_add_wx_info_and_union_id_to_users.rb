class AddWxInfoAndUnionIdToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :wx_info, :text
    add_column :users, :union_id, :string
  end
end
