class AddLocationToTrainingSession < ActiveRecord::Migration[6.0]
  def change
    add_column :training_sessions, :location, :string
    add_column :training_sessions, :current_block, :string
  end
end
