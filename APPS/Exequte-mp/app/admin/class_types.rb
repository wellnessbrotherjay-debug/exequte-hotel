ActiveAdmin.register ClassType do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :price_1_cents, :price_1_currency, :price_2_cents, :price_2_currency, :price_3_cents, :price_3_currency, :price_4_cents, :price_4_currency, :price_5_cents, :price_5_currency, :price_6_cents, :price_6_currency, :price_7_cents, :price_7_currency, :name, :kind, :cancel_before
  #
  # or
  #
  # permit_params do
  #   permitted = [:price_1_cents, :price_1_currency, :price_2_cents, :price_2_currency, :price_3_cents, :price_3_currency, :price_4_cents, :price_4_currency, :price_5_cents, :price_5_currency, :price_6_cents, :price_6_currency, :price_7_cents, :price_7_currency, :name, :kind, :cancel_before]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

end
