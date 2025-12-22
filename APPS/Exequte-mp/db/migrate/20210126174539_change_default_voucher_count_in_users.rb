class ChangeDefaultVoucherCountInUsers < ActiveRecord::Migration[6.0]
  def change
    change_column_default :users, :voucher_count, from: 5, to: 1
  end
end
