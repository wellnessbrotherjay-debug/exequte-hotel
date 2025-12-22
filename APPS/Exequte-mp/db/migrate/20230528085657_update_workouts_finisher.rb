class UpdateWorkoutsFinisher < ActiveRecord::Migration[6.0]
  def change
    #workouts
    add_column :workouts, :finisher_title, :string
    add_column :workouts, :finisher_format, :string
    add_column :workouts, :finisher_duration_format, :string
    add_column :workouts, :finisher_reps_text, :string
  end
end