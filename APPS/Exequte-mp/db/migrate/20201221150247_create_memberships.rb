class CreateMemberships < ActiveRecord::Migration[6.0]
  def change
    create_table :memberships do |t|
      t.references :membership_type, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :cn_name, null: false
      t.integer :price_cents, default: 0, null: false
      t.string :price_currency, default: "CNY", null: false
      t.datetime :start_date
      t.datetime :end_date
      t.boolean :smoothie, null: false

      t.timestamps
    end
  end
end
