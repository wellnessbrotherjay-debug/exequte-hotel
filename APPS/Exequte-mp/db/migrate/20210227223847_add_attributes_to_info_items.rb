class AddAttributesToInfoItems < ActiveRecord::Migration[6.0]
  def change
    add_column :info_items, :margin_top, :integer
    add_column :info_items, :margin_left, :integer
    add_column :info_items, :text_align, :string
    add_column :info_items, :text_transform, :string
    add_column :info_items, :italic, :boolean
  end
end
