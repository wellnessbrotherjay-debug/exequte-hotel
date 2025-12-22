class AddWorkoutsQuote < ActiveRecord::Migration[6.0]
  def change
    #workouts
    add_column :workouts, :quote, :string
    add_column :workouts, :cn_quote, :string
    add_column :workouts, :title, :string
    add_column :workouts, :cn_title, :string
    add_column :workouts, :level, :string
    add_column :workouts, :total_duration, :integer, :default => 60
    add_column :workouts, :warmup_duration, :integer, :default => 12
    add_column :workouts, :warmup_exercise_duration, :integer, :default => 1
    add_column :workouts, :blocks_duration, :integer, :default => 35
    add_column :workouts, :blocks_rounds, :integer, :default => 5
    add_column :workouts, :blocks_duration_text, :string
    add_column :workouts, :blocks_exercise_duration, :integer, :default => 1
    add_column :workouts, :cooldown_duration, :integer, :default => 5
    add_column :workouts, :breathing_duration, :integer, :default => 2

    #exercises_workouts
    add_column :exercises_workouts, :format, :string
    add_column :exercises_workouts, :block, :string
    remove_column :exercises_workouts, :reps, :integer
    add_column :exercises_workouts, :reps_gold, :string
    add_column :exercises_workouts, :reps_silver, :string
    add_column :exercises_workouts, :reps_bronze, :string
    remove_column :exercises_workouts, :weight, :float
  end
end