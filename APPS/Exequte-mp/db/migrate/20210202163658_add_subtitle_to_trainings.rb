class AddSubtitleToTrainings < ActiveRecord::Migration[6.0]
  def change
    add_column :trainings, :subtitle, :string
    add_column :trainings, :cn_subtitle, :string
  end
end
