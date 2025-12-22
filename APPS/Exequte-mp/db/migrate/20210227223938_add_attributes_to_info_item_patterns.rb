class AddAttributesToInfoItemPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :info_item_patterns, :margin_top, :integer
    add_column :info_item_patterns, :margin_left, :integer
    add_column :info_item_patterns, :text_align, :string
    add_column :info_item_patterns, :text_transform, :string
    add_column :info_item_patterns, :italic, :boolean
  end
end
