class CreateClassTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :class_types do |t|
      t.monetize :price_1
      t.monetize :price_2
      t.monetize :price_3
      t.monetize :price_4
      t.monetize :price_5
      t.monetize :price_6
      t.monetize :price_7
      t.string :name
      t.integer :kind
      t.integer :cancel_before

      t.timestamps
    end
  end
end
