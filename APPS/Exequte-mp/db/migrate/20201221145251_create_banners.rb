class CreateBanners < ActiveRecord::Migration[6.0]
  def change
    create_table :banners do |t|
      t.boolean :current, null: false, default: true

      t.timestamps
    end
  end
end
