class CreateJoinTableTrainingSessionsWorkouts < ActiveRecord::Migration[6.0]
  def change
    create_join_table :training_sessions, :workouts do |t|
      # t.index [:training_session_id, :workout_id]
      # t.index [:workout_id, :training_session_id]
    end
  end
end
