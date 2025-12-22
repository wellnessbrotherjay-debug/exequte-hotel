class CreateTrainingsWorkouts < ActiveRecord::Migration[6.0]
  def change
    create_table :trainings_workouts, id: false do |t|
      t.belongs_to :training
      t.belongs_to :workout
    end

    add_index :trainings_workouts, [:training_id, :workout_id], unique: true
  end
end