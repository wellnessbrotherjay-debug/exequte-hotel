class RemoveCnTitleFromInfoItems < ActiveRecord::Migration[6.0]
  def change
    remove_column :info_items, :cn_title, :string
  end
end
