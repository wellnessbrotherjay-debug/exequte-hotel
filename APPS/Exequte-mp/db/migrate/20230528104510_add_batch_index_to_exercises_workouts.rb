class AddBatchIndexToExercisesWorkouts < ActiveRecord::Migration[6.0]
  def change
    add_column :exercises_workouts, :batch_index, :integer
  end
end
