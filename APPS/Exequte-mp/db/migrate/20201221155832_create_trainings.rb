class CreateTrainings < ActiveRecord::Migration[6.0]
  def change
    create_table :trainings do |t|
      t.string :name, null: false
      t.integer :calories
      t.integer :duration, null: false
      t.integer :capacity, null: false
      t.references :class_type, null: false, foreign_key: true
      t.text :description, null: false
      t.string :cn_name, null: false
      t.text :cn_description, null: false

      t.timestamps
    end
  end
end
