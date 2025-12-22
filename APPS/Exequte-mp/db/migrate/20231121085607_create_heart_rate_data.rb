class CreateHeartRateData < ActiveRecord::Migration[6.0]
  def change
    create_table :heart_rate_data do |t|
      t.references :booking, foreign_key: true
      t.jsonb :hrm_data_raw, default: [], null: false
      t.jsonb :hrm_data, default: {}, null: false
      t.jsonb :hrm_graph, default: {}, null: false
      t.timestamps
    end
  end
end
