ActiveAdmin.register User do
  # config.create_another = true

  # end
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :email, :encrypted_password, :reset_password_token, :reset_password_sent_at, :remember_created_at, :name, :city, :wechat, :phone, :gender, :admin, :wx_open_id, :wx_session_key, :first_name, :last_name, :workout_name, :emergency_name, :emergency_phone, :birthday, :nationality, :profession, :profession_activity_level, :favorite_song, :music_styles, :sports, :favorite_food, :voucher_count, :instructor, :instructor_bio, :cn_instructor_bio, :height, :current_weight, :current_body_fat, :current_shapes, :target, :target_weight, :target_body_fat, :target_shapes, :mp_email, :instructor_photo, :waiver_signed, :waiver_signed_at, :avatar
  #
  # or
  #
  # permit_params do
  #   permitted = [:email, :encrypted_password, :reset_password_token, :reset_password_sent_at, :remember_created_at, :name, :city, :wechat, :phone, :gender, :admin, :wx_open_id, :wx_session_key, :first_name, :last_name, :workout_name, :emergency_name, :emergency_phone, :birthday, :nationality, :profession, :profession_activity_level, :favorite_song, :music_styles, :sports, :favorite_food, :voucher_count, :instructor, :instructor_bio, :cn_instructor_bio, :height, :current_weight, :current_body_fat, :current_shapes, :target, :target_weight, :target_body_fat, :target_shapes]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

  # sidebar "Belongings", only: [:show, :edit] do
  #   ul do
  #     li link_to "Bookings",    admin_user_bookings_path(resource)
  #   end
  # end

  # sidebar "Belongings", only: [:show, :edit] do
  #   ul do
  #     li link_to "Memberships",    admin_user_memberships_path(resource)
  #     li link_to "Bookings",    admin_user_bookings_path(resource)
  #   end
  # end


  show do
    tabs do
      tab "Primary" do
        attributes_table do
          row :id
          row :first_name
          row :last_name
          row :workout_name
          row :wechat
          row :phone
          row :mp_email
          row :emergency_name
          row :emergency_phone
          row :voucher_count
          row :instructor
          row :admin
          row :waiver_signed
          row :waiver_signed_at
        end
      end
      tab "Secondary" do
        attributes_table do
          row :birthday
          row :nationality
          row :profession
          row :profession_activity_level
          row :favorite_song
          row :favorite_food
        end
      end
      tab "Instructor" do
        attributes_table do
          row :instructor_bio
          row :cn_instructor_bio
          row :instructor_photo do |user|
            if user.instructor_photo.attached?
              image_tag url_for(user.instructor_photo), size: "50x50"
            else
              "No Avatar"
            end
          end
        end
      end
      tab "Body" do
        attributes_table do
          row :height
          row :current_weight
          row :current_body_fat
          row :current_shapes
          row :target
          row :target_weight
          row :target_body_fat
        end
      end
      tab "Avatar" do
        attributes_table do
          row :avatar do |user|
            if user.avatar.attached?
              image_tag url_for(user.avatar), size: "50x50"
            else
              "No Avatar"
            end
          end
        end
      end
    end
  end

  index do
    selectable_column
    column :id
    column :avatar do |user|
      if user.avatar.attached?
        image_tag url_for(user.avatar), size: "50x50"
      else
        "No Avatar"
      end
    end
    column :first_name
    column :last_name
    column :gender
    column :mp_email
    column :phone
    column :workout_name
    column :emergency_name
    column :emergency_phone
    column :voucher_count
    column :instructor
    column :admin
    column :waiver_signed
    column :waiver_signed_at
    column :created_at
    column :updated_at
    actions
  end

  form do |f|
    tabs do
      tab "Primary" do
        f.semantic_errors # shows errors on :base
        f.inputs :first_name, :last_name, :workout_name, :wechat, :phone, :mp_email, :emergency_name, :emergency_phone, :voucher_count, :instructor, :admin, :waiver_signed, :waiver_signed_at #, :password, :password_confirmation # builds an input field for every attribute
        # , :password, :password_confirmation
        f.inputs do
          f.input :gender, collection: User::GENDERS
        end
      end
      tab "Secondary" do
        f.semantic_errors # shows errors on :base
        f.inputs :birthday, :nationality, :profession, :profession_activity_level, :favorite_song, :favorite_food
      end
      tab "Instructor" do
        f.inputs :instructor_bio, :cn_instructor_bio
        f.inputs do
          f.input :instructor_photo, as: :file
        end
      end
      tab "Body" do
        f.semantic_errors # shows errors on :base
        f.inputs :height, :current_weight, :current_body_fat, :current_shapes
        f.inputs do
          f.input :target, collection: User::TARGETS
        end
        f.inputs :target_weight, :target_body_fat
      end
      tab "Avatar" do
        f.inputs do
          f.input :avatar, as: :file, hint: f.object.avatar.attached? ? image_tag(url_for(f.object.avatar)) : content_tag(:span, "No avatar yet")
        end
      end
    end
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end
  # panel 'Markup' do
  #   "The following can be used in the content below..."
  # end
  # inputs 'Content', :body
  # para "Press cancel to return to the list without saving."
  #   actions
  # end
  # permit_params :name, :city, :phone, :mp_email, :gender, :wx_open_id, :wx_session_key, :first_name, :last_name, :workout_name, :emergency_name, :emergency_phone, :birthday, :nationality , :id, :profession, :profession_activity_level, :favorite_song, :music_styles, :sports, :favorite_food, :voucher_count, :instructor, :instructor_bio, :cn_instructor_bio, :height, :current_weight, :current_body_fat, :current_shapes, :target, :target_weight, :target_body_fat, :target_shapes, :admin, :wechat
  # permit_params do

end
