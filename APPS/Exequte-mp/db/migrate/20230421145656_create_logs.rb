class CreateLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :logs do |t|
      t.string :log_type, null: false
      t.string :value, null: false

      t.timestamps
    end
  end
end
