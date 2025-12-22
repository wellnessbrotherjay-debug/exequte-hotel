class AddPaymentAttributesToMemberships < ActiveRecord::Migration[6.0]
  def change
    add_column :memberships, :payment_status, :string
    add_column :memberships, :payment, :jsonb
  end
end
