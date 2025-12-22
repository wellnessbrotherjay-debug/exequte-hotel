ActiveAdmin.register Membership do
  # belongs_to :membership_type
  # belongs_to :user
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :membership_type_id, :user_id, :name, :cn_name, :price_cents, :price_currency, :start_date, :end_date, :smoothie, :vouchers, :is_class_pack, :is_trial, :is_limited, :bookings_per_day,  :payment_status
  #
  # or
  #
  # permit_params do
  #   permitted = [:membership_type_id, :user_id, :name, :cn_name, :price_cents, :price_currency, :start_date, :end_date, :smoothie]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

  form do |f|
    f.semantic_errors # shows errors on :base
    # f.inputs except: %i[user_id price_1_cents price_1_currency price_2_cents price_2_currency price_3_cents price_3_currency price_4_cents price_4_currency price_5_cents price_5_currency price_6_cents price_6_currency price_7_cents price_7_currency queue]# builds an input field for every attribute
    f.inputs do
      f.input :membership_type, collection: MembershipType.all
      f.input :user, collection: User.all.order_by_name
      f.input :name
      f.input :cn_name
      f.input :price_cents
      f.input :price_currency
      f.input :start_date
      f.input :end_date
      f.input :smoothie
      f.input :vouchers
      f.input :is_class_pack
      f.input :is_trial
      f.input :is_limited
      f.input :bookings_per_day
      f.input :payment_status
    end
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end
  # json_editor

end
