class AddWorkoutsBlocks < ActiveRecord::Migration[6.0]
  def change
    #workouts
    add_column :workouts, :block_a_format, :string
    add_column :workouts, :block_b_format, :string
    add_column :workouts, :block_c_format, :string
  end
end