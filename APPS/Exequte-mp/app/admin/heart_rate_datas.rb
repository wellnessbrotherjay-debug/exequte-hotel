ActiveAdmin.register HeartRateData do
  permit_params :booking_id, :hrm_data_raw, :hrm_data, :hrm_graph, :hrm_zone_graph

  index do
    selectable_column
    id_column
    column :booking
    column :hrm_data_raw
    column :hrm_data
    column 'Hrm Graph' do |heart_rate_data|
      image_tag("data:image/png;base64,#{heart_rate_data.hrm_graph['base64Data']}", height: '100')
    end
    column 'Hrm Zone Graph' do |heart_rate_data|
      image_tag("data:image/png;base64,#{heart_rate_data.hrm_zone_graph['base64Data']}", height: '100')
    end
    actions
  end

  form do |f|
    f.inputs 'Heart Rate Data Details' do
      f.input :booking, as: :select, collection: Booking.all.map { |booking| [booking.id, booking.id] }
      f.input :hrm_data_raw
      f.input :hrm_data
      f.input :hrm_graph
      f.input :hrm_zone_graph
    end
    f.actions
  end


end
