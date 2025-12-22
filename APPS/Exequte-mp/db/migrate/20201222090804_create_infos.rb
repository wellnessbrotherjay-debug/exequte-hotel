class CreateInfos < ActiveRecord::Migration[6.0]
  def change
    create_table :infos do |t|
      t.text :paragraph_one
      t.text :paragraph_two
      t.text :paragraph_three
      t.text :paragraph_four
      t.string :title_one
      t.string :title_two
      t.string :title_three
      t.string :title_four

      t.timestamps
    end
  end
end
