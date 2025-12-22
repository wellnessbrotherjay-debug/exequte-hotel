ActiveAdmin.register Hrm do

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
  #       t.string :name, null: false
  #       t.string :hub, null: false
  #       t.string :display_name, null: false
  #       t.boolean :is_used, null: false, default: false
  permit_params :name, :hub, :display_name, :is_used
end
