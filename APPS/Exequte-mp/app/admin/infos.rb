ActiveAdmin.register Info do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :paragraph_one, :paragraph_two, :paragraph_three, :paragraph_four, :title_one, :title_two, :title_three, :title_four, :cn_title_one, :cn_title_two, :cn_title_three, :cn_title_four, :cn_paragraph_one, :cn_paragraph_two, :cn_paragraph_three, :cn_paragraph_four, :photo_1, :photo_2, :terms
  #
  # or
  #
  form do |f|
    f.semantic_errors
    f.inputs
    f.inputs do
      f.input :photo_1, as: :file
      f.input :photo_2, as: :file
    end
    f.actions
  end

  # permit_params do
  #   permitted = [:paragraph_one, :paragraph_two, :paragraph_three, :paragraph_four, :title_one, :title_two, :title_three, :title_four]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

end
