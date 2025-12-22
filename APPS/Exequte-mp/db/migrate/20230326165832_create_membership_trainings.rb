class CreateMembershipTrainings < ActiveRecord::Migration[6.0]
  def change
    create_table :membership_trainings do |t|
      t.belongs_to :membership_type, index: true
      t.belongs_to :training, index: true
    end
  end
end
