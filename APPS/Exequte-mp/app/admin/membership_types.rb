ActiveAdmin.register MembershipType do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :name, :duration, :cn_name, :price_cents, :price_currency, :smoothie, :active, :vouchers, :is_class_pack, :is_trial, :is_limited, :bookings_per_day, training_ids: []

  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs
    f.input :trainings, as: :check_boxes, collection: Training.all
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end
  #






  # or
  #
  # permit_params do
  #   permitted = [:name, :duration, :cn_name, :price_cents, :price_currency, :smoothie]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

end
