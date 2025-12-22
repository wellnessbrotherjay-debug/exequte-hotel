ActiveAdmin.register InfoItemPattern do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :margin_bottom, :font_size, :placement, :position, :note, :title, :margin_top, :margin_left, :text_align, :text_transform, :italic
  #
  # or
  #
  # permit_params do
  #   permitted = [:margin_bottom, :font_size, :placement, :position, :note]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs except: [:placement, :text_align, :text_transform]       # builds an input field for every attribute
    f.input :placement, collection: InfoItem::PLACEMENTS
    f.input :text_align, collection: InfoItem::ALIGNS
    f.input :text_transform, collection: InfoItem::TRANSFORMS
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end
end
