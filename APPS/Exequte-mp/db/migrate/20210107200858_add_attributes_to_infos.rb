class AddAttributesToInfos < ActiveRecord::Migration[6.0]
  def change
    add_column :infos, :cn_paragraph_one, :text
    add_column :infos, :cn_paragraph_two, :text
    add_column :infos, :cn_paragraph_three, :text
    add_column :infos, :cn_paragraph_four, :text
    add_column :infos, :cn_title_one, :string
    add_column :infos, :cn_title_two, :string
    add_column :infos, :cn_title_three, :string
    add_column :infos, :cn_title_four, :string
  end
end
