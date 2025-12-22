class AddTermsToInfos < ActiveRecord::Migration[6.0]
  def change
    add_column :infos, :terms, :boolean, default: false
  end
end
