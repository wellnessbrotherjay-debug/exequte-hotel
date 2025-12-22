class UpdateWorkoutsBlocks < ActiveRecord::Migration[6.0]
  def change
    #workouts
    add_column :workouts, :block_a_title, :string
    add_column :workouts, :block_b_title, :string
    add_column :workouts, :block_c_title, :string
    add_column :workouts, :block_a_duration_format, :string
    add_column :workouts, :block_b_duration_format, :string
    add_column :workouts, :block_c_duration_format, :string
    add_column :workouts, :block_a_reps_text, :string
    add_column :workouts, :block_b_reps_text, :string
    add_column :workouts, :block_c_reps_text, :string
    add_column :workouts, :warmup_duration_format, :string
    add_column :workouts, :title_footer, :string
    add_column :workouts, :cn_title_footer, :string
  end
end