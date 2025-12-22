class CreateInfoItems < ActiveRecord::Migration[6.0]
  def change
    create_table :info_items do |t|
      t.string :title
      t.string :cn_title
      t.text :item_text
      t.text :cn_item_text
      t.integer :margin_bottom
      t.integer :font_size
      t.string :placement
      t.integer :position
      t.references :info, null: false, foreign_key: true
      t.references :info_item_pattern, foreign_key: true
      t.text :note

      t.timestamps
    end
  end
end
