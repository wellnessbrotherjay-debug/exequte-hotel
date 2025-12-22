class AddLimitedToTrainingSession < ActiveRecord::Migration[6.0]
  def change
    add_column :training_sessions, :is_limited, :boolean, :default => false
    add_column :trainings, :is_limited, :boolean, :default => false
  end
end
