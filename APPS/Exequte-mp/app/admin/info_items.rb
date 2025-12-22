ActiveAdmin.register InfoItem do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #


  permit_params :title, :item_text, :cn_item_text, :margin_bottom, :font_size, :placement, :position, :info_id, :info_item_pattern_id, :margin_top, :margin_left, :text_align, :text_transform, :italic, :note
  #




  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs except: [:placement, :text_align, :text_transform]       # builds an input field for every attribute
    f.input :placement, collection: InfoItem::PLACEMENTS
    f.input :text_align, collection: InfoItem::ALIGNS
    f.input :text_transform, collection: InfoItem::TRANSFORMS

    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end


  # or
  #
  # permit_params do
  #   permitted = [:title, :cn_title, :item_text, :cn_item_text, :margin_bottom, :font_size, :placement, :position, :info_id, :note]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

end


# rails g model info_pattern title:string cn_title:string item_text:text cn_item_text:text margin_bottom:integer font_size:integer placement:string position:integer info:references note:text
