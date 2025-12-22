class AddDetailsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :name, :string
    add_column :users, :city, :string
    add_column :users, :wechat, :string
    add_column :users, :phone, :string
    add_column :users, :mp_email, :string
    add_column :users, :gender, :string
    add_column :users, :admin, :boolean, default: false
    add_column :users, :wx_open_id, :string
    add_column :users, :wx_session_key, :string
    add_column :users, :workout_name, :string
    add_column :users, :emergency_name, :string
    add_column :users, :emergency_phone, :string
    add_column :users, :birthday, :date
    add_column :users, :nationality, :string
    add_column :users, :profession, :string
    add_column :users, :profession_activity_level, :string
    add_column :users, :favorite_song, :string
    add_column :users, :music_styles, :string
    add_column :users, :sports, :string
    add_column :users, :favorite_food, :text
    add_column :users, :voucher_count, :integer, default: 5, null: false
    add_column :users, :instructor, :boolean, default: false, null: false
    add_column :users, :instructor_bio, :string
    add_column :users, :cn_instructor_bio, :string
    add_column :users, :height, :integer
    add_column :users, :current_weight, :integer
    add_column :users, :current_body_fat, :integer
    add_column :users, :current_shapes, :string
    add_column :users, :target, :string
    add_column :users, :target_weight, :integer
    add_column :users, :target_body_fat, :integer
    add_column :users, :target_shapes, :string
  end
end
