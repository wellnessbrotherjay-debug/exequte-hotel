class ChangeNameDefault < ActiveRecord::Migration[6.0]
  def change
    change_column :class_types,:name, :string, null: false
    change_column :class_types, :kind, :integer,  null: false
    change_column :class_types, :cancel_before,:integer,  null: false
  end
end
