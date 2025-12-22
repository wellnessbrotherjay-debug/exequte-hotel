class AddAttributesToBanners < ActiveRecord::Migration[6.0]
  def change
    add_column :banners, :title, :string#, null: false
    add_column :banners, :promo_text, :string#, null: false
  end
end
