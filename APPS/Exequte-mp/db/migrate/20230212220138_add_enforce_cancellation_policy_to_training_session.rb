class AddEnforceCancellationPolicyToTrainingSession < ActiveRecord::Migration[6.0]
  def change
    add_column :training_sessions, :enforce_cancellation_policy, :boolean, :default => true
  end
end
