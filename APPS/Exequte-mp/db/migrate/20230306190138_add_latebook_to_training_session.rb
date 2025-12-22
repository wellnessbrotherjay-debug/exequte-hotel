class AddLatebookToTrainingSession < ActiveRecord::Migration[6.0]
  def change
    add_column :training_sessions, :late_booking_minutes, :integer
    add_column :trainings, :late_booking_minutes, :integer
  end
end
