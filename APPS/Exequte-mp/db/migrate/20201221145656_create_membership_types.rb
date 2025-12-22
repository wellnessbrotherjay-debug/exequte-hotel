class CreateMembershipTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :membership_types do |t|
      t.string :name, null: false
      t.integer :duration, null: false
      t.string :cn_name, null: false
      t.integer :price_cents, default: 0, null: false
      t.string :price_currency, default: "CNY", null: false
      t.boolean :smoothie, null: false

      t.timestamps
    end
  end
end
