class AddSubtitleToTrainingSessions < ActiveRecord::Migration[6.0]
  def change
    add_column :training_sessions, :subtitle, :string
    add_column :training_sessions, :cn_subtitle, :string
  end
end
