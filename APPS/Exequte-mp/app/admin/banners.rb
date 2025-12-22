ActiveAdmin.register Banner do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  # permit_params :current
  #
  # or
  #
  # permit_params do
  #   permitted = [:current]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

  form do |f|
    f.inputs "Banners" do
      f.input :photo, as: :file
      f.input :activity_name
      f.input :activity_time
      f.input :current, label: "Current", as: :radio
    end
    f.actions
  end

  permit_params :photo, :current, :activity_name, :activity_time
end
