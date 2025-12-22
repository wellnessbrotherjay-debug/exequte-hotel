class ChangeTitleToBooleanInInfoItems < ActiveRecord::Migration[6.0]
  def change
    remove_column :info_items, :title, :string
    add_column :info_items, :title, :boolean
  end
end
