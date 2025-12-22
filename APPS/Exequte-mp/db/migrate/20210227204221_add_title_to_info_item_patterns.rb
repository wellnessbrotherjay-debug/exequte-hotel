class AddTitleToInfoItemPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :info_item_patterns, :title, :boolean
  end
end
