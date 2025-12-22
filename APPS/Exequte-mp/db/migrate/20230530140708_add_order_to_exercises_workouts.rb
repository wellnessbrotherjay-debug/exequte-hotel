class AddOrderToExercisesWorkouts < ActiveRecord::Migration[6.0]
  def change
    add_column :exercises_workouts, :order, :integer
  end
end
