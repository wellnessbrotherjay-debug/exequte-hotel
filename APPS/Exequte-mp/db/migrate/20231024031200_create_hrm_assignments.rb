class CreateHrmAssignments < ActiveRecord::Migration[6.0]
  def change
    create_table :hrm_assignments do |t|
      t.references :hrm, null: false, foreign_key: true
      t.references :training_session, null: false, foreign_key: true
      t.boolean :assigned, default: false

      t.timestamps
    end
  end
end
