class CreateBookings < ActiveRecord::Migration[6.0]
  def change
    create_table :bookings do |t|
      t.references :user, null: false, foreign_key: true
      t.references :training_session, null: false, foreign_key: true
      t.monetize :price
      t.boolean :cancelled, null: false, default: false
      t.datetime :cancelled_at
      t.boolean :attended
      t.string :booked_with
      t.references :membership, foreign_key: true

      t.timestamps
    end
  end
end
