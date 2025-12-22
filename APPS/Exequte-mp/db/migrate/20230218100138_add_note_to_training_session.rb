class AddNoteToTrainingSession < ActiveRecord::Migration[6.0]
  def change
    add_column :training_sessions, :note, :string
    add_column :training_sessions, :cancelled, :boolean, :default => false
    add_column :training_sessions, :cancelled_at, :datetime
  end
end
