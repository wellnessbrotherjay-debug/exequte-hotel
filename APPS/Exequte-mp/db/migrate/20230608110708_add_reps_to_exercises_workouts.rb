class AddRepsToExercisesWorkouts < ActiveRecord::Migration[6.0]
  def change
    add_column :exercises_workouts, :reps, :string
  end
end
