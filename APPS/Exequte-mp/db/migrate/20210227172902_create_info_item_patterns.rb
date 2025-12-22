class CreateInfoItemPatterns < ActiveRecord::Migration[6.0]
  def change
    create_table :info_item_patterns do |t|
      t.integer :margin_bottom
      t.integer :font_size
      t.string :placement
      t.integer :position
      t.text :note

      t.timestamps
    end
  end
end
