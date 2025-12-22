class AddPaymentAttributesToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :payment_status, :string
    add_column :bookings, :payment, :jsonb
  end
end
