ActiveAdmin.register Log do

  permit_params :log_type, :value

  action_item :view, only: :index do
    render "logs/filter_logs", context: self
  end

  collection_action :generate_logs, method: :get do
    start_date = params[:start_date]
    end_date = params[:end_date]
    Log.run_noshow(start_date, end_date)
    redirect_to admin_logs_path, notice: "No-Show routine run successfully"
  end

  index do
    selectable_column
    column :id
    column :log_type
    column :value
    column :created_at
    actions
  end

end
