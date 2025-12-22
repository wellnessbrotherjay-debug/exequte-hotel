ActiveAdmin.register Booking do
  # belongs_to :user
  # belongs_to :training_session

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  includes :user, training_session: [:instructor]
  permit_params :user_id, :training_session_id, :price_cents, :price_currency, :cancelled, :cancelled_at, :attended, :booked_with, :membership_id, :hrm_id
  json_editor

  filter :user_id,
         as: :select,
         collection: proc {
           begin
             User.order(:last_name).pluck(:last_name, :id)
           rescue ActiveRecord::StatementInvalid, ActiveRecord::NoDatabaseError, PG::UndefinedTable
             []
           end
         },
         label: "Client Last Name"
  filter :class_time,
         as: :date_range,
         collection: proc {
           begin
             TrainingSession.order(:begins_at).pluck(:begins_at)
           rescue ActiveRecord::StatementInvalid, ActiveRecord::NoDatabaseError, PG::UndefinedTable
             []
           end
         }
  filter :id, label: 'Booking Id'
  # filter :class_time
  filter :training_session_id
  filter :class_name
  filter :subtitle
  filter :price_cents
  filter :cancelled
  filter :cancelled_at
  filter :attended
  filter :booked_with
  filter :payment_status
  filter :membership_id
  filter :created_at
  filter :updated_at



  index do
    selectable_column
    column :id
    column :client_first_name
    column :client_last_name
    column :user_id
    column :class_time
    column :training_session_id
    column :class_name
    column :subtitle
    column :price_cents
    column :cancelled
    column :cancelled_at
    column :attended
    column :booked_with
    column :payment_status
    column :membership_id
    column :hrm do |booking|
      booking.hrm.display_name if booking.hrm.present?
    end
    column :created_at
    column :updated_at
    actions
  end

  csv do
    column :id
    column :user_id
    column :client_first_name
    column :client_last_name
    column :training_session_id
    column :class_name
    column :subtitle
    column :class_time
    column :price_cents
    column :cancelled
    column :cancelled_at
    column :attended
    column :booked_with
    column :payment_status
    column :membership_id
    column :created_at
    column :updated_at
    column :instructor
  end

  show do
    attributes_table do
      row :id
      row :client_first_name
      row :client_last_name
      row :user_id
      row :class_time
      row :training_session_id
      row :class_name
      row :subtitle
      row :price_cents
      row :cancelled
      row :cancelled_at
      row :attended
      row :booked_with
      row :payment_status
      row :membership_id
      row :hrm do |booking|
        booking.hrm.display_name if booking.hrm.present?
      end
      row :created_at
      row :updated_at
    end

    # Display the heart rate data associated with the booking
    if resource.heart_rate_data.present?
      panel 'Heart Rate Data' do
        attributes_table_for resource.heart_rate_data do
          row :id
          row :hrm_data_raw
          row :hrm_data
          row :hrm_graph do |heart_rate_data|
            if heart_rate_data.hrm_graph.present?
              image_tag "data:image/png;base64,#{heart_rate_data.hrm_graph['base64Data']}", height: '100px'
            end
          end
          row :hrm_zone_graph do |heart_rate_data|
            if heart_rate_data.hrm_zone_graph.present?
              image_tag "data:image/png;base64,#{heart_rate_data.hrm_zone_graph['base64Data']}", height: '100px'
            end
          end
          row :created_at
          row :updated_at
        end
      end
    end
    active_admin_comments
  end


  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs except: [:user, :booked_with]       # builds an input field for every attribute
    # Add an input for HRM association
    f.input :hrm, as: :select, collection: Hrm.all.map { |hrm| [hrm.display_name, hrm.id] }, include_blank: true, label: 'HRM'
    f.input :booked_with, collection: Booking::BOOKING_OPTIONS
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end
  #
  # or

  # sidebar :filters do
  #   render partial: 'search'
  # end

  #
  # permit_params do
  #   permitted = [:user_id, :training_session_id, :price_cents, :price_currency, :cancelled, :cancelled_at, :attended, :booked_with, :membership_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

end
