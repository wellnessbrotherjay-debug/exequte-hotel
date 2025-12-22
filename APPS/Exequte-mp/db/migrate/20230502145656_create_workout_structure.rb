class CreateWorkoutStructure < ActiveRecord::Migration[6.0]
  def change
    create_table :exercises do |t|
      t.string :name
      t.string :description
      t.string :cn_name
      t.string :cn_description
      t.datetime :destroyed_at
      t.timestamps
    end

    create_table :workouts do |t|
      t.references :training
      t.references :training_session
      t.string :name
      t.string :workout_type
      t.string :cn_name
      t.string :cn_description
      t.datetime :destroyed_at
      t.timestamps
    end

    create_table :exercises_workouts do |t|
      t.references :workout
      t.references :exercise
      t.integer :reps
      t.integer :sets
      t.float :weight
      t.integer :time_limit
      t.datetime :destroyed_at
      t.timestamps
    end
  end
end
