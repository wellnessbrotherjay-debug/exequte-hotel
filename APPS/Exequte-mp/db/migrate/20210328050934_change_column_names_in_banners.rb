class ChangeColumnNamesInBanners < ActiveRecord::Migration[6.0]
  def change
    change_table :banners do |t|
      t.rename :title, :activity_name
      t.rename :promo_text, :activity_time
    end
  end
end
