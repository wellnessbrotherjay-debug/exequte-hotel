class CreateHrms < ActiveRecord::Migration[6.0]
  def change
    create_table :hrms do |t|
      t.string :name, null: false
      t.string :hub, null: false
      t.string :display_name, null: false
      t.boolean :is_used, null: false, default: false

      t.timestamps
    end
  end
end
