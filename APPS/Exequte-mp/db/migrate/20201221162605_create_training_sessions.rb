class CreateTrainingSessions < ActiveRecord::Migration[6.0]
  def change
    create_table :training_sessions do |t|
      t.string :name, null: false
      t.string :cn_name, null: false
      t.datetime :begins_at, null: false
      t.integer :duration, null: false
      t.integer :capacity, null: false
      t.integer :calories
      t.string :description, null: false
      t.string :cn_description, null: false
      t.references :training, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :queue
      t.monetize :price_1
      t.monetize :price_2
      t.monetize :price_3
      t.monetize :price_4
      t.monetize :price_5
      t.monetize :price_6
      t.monetize :price_7
      t.integer :class_kind, null: false
      t.integer :cancel_before, null: false

      t.timestamps
    end
  end
end
