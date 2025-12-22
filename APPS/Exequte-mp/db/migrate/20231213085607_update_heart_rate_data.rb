class UpdateHeartRateData < ActiveRecord::Migration[6.0]
  def change
    add_column :heart_rate_data, :hrm_zone_graph, :jsonb, default: {}, null: false
    add_column :heart_rate_data, :hrm_combined_graph, :jsonb, default: {}, null: false
  end
end
