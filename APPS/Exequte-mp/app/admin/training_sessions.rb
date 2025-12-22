ActiveAdmin.register TrainingSession do

  permit_params :queue, :training_id, :begins_at, :user_id, :duration, :capacity, :calories, :name, :cn_name, :price_1, :price_1_currency, :price_2, :price_2_currency, :price_3, :price_3_currency, :price_4, :price_4_currency, :price_5, :price_5_currency, :price_6, :price_6_currency, :price_7, :price_7_currency, :description, :cn_description, :class_kind, :cancel_before, :subtitle, :cn_subtitle, :enforce_cancellation_policy, :cancelled, :cancelled_at, :note, :late_booking_minutes, :is_limited, :location, :poster_photo, :current_block, workout_ids: [], photos: [], videos: []

  member_action :delete_training_session_photo, method: :delete do
    begin
      @attachment = ActiveStorage::Attachment.find(params[:id])
      key = @attachment.blob.key
      puts "About to remove the following picture with key: #{key}"
      @attachment.purge
      redirect_back(fallback_location: edit_admin_training_session_path)
    rescue => e
      puts "Something went wrong: #{e.message}"
      # Handle the error, e.g., redirect to an error page or display a flash message.
    end
  end

  index do
    selectable_column
    column :id
    column :name
    column :subtitle
    column :begins_at
    column :capacity
    column :queue
    column :instructor
    column :duration
    column :price_1
    column :description
    column :calories
    column :training_id
    column :workouts
    column :cancel_before
    column :created_at
    column :updated_at
    column :enforce_cancellation_policy
    column :cancelled
    column :cancelled_at
    column :note
    column :late_booking_minutes
    column :is_limited
    column :location
    column :current_block
    actions do |training_session|
      if training_session.workout_current.present?
      link_to 'Download Template', '#', data: { workout_id: training_session.workout_current.id, workout_name: training_session.workout_current.name } , class: 'download_link member_link', onclick: 'downloadWorkoutTemplate(this);return false;'
      end
    end
    render partial: 'admin/index'
    render partial: 'admin/template'
  end


  form do |f|
    tabs do
      tab "Basic" do
        f.semantic_errors # shows errors on :base
        # f.inputs except: %i[user_id price_1_cents price_1_currency price_2_cents price_2_currency price_3_cents price_3_currency price_4_cents price_4_currency price_5_cents price_5_currency price_6_cents price_6_currency price_7_cents price_7_currency queue]# builds an input field for every attribute
        f.inputs do
          f.input :training, collection: Training.all
          f.input :workouts, collection: Workout.all
          f.input :instructor, collection: User.where(instructor: true)
          f.input :name
          f.input :cn_name
          f.input :subtitle
          f.input :cn_subtitle
          f.input :begins_at
          f.input :duration
          f.input :capacity
          f.input :calories
          f.input :description
          f.input :cn_description
          f.input :class_kind
          f.input :cancel_before
          f.input :enforce_cancellation_policy
          f.input :cancelled
          f.input :cancelled_at
          f.input :note
          f.input :late_booking_minutes
          f.input :is_limited
          f.input :location
          f.input :current_block
        end
      end
      tab "Prices" do
        f.semantic_errors # shows errors on :base
        f.inputs :price_1, :price_2, :price_3,:price_4, :price_5, :price_6, :price_7
      end
      tab "Media" do
        # Add a section for uploading multiple photos
        f.input :photos, as: :file, input_html: { multiple: true }
        # # Add a section for uploading multiple videos
        f.input :videos, as: :file, input_html: { multiple: true }
        f.input :poster_photo, as: :file
      end
    end
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end

  show do
    attributes_table do
      row :id
      row :name
      row :cn_name
      row :training
      row :workouts
      row :subtitle
      row :cn_subtitle
      row :begins_at
      row :duration
      row :capacity
      row :calories
      row :description
      row :cn_description
      row :class_kind
      row :cancel_before
      row :enforce_cancellation_policy
      row :cancelled
      row :cancelled_at
      row :note
      row :late_booking_minutes
      row :is_limited
      row :price_1
      row :location
      row :current_block
      row :poster_photo do |ts|
        if ts.poster_photo.attached?
          image_tag ts.poster_photo, width: 200
        end
      end
      row :template do |training_session|
        if training_session.workout_current.present?
            a 'Download Template', class: 'clickable-btn', 'data-workout-id': training_session.workout_current.id, 'data-workout-name': training_session.workout_current.name, onclick: 'downloadWorkoutTemplate(this);return false;' do
              'Download Template'
            end
            a 'Show Template', class: 'clickable-btn', 'data-workout-id': training_session.workout_current.id, 'data-workout-name': training_session.workout_current.name, onclick: 'showWorkoutTemplate(this, false);return false;' do
              'Show Template'
            end
            render partial: 'admin/index'
            render partial: 'admin/template'
        end
      end
      row :photos do
        div do
          training_session.photos.each do |img|
            div class: "photo-item" do
              div do
                image_tag url_for(img), size: "200x200"
              end
              div do
                link_to 'Delete', delete_training_session_photo_admin_training_session_path(img), method: :delete, data: { confirm: 'Are you sure?' }
              end
            end
          end
        end
      end
      row :videos do
        div do
          training_session.videos.each do |img|
            div class: "video-item" do
              div do
                video_tag url_for(img), controls: true
              end
              div do
                link_to 'Delete', delete_training_session_photo_admin_training_session_path(img), method: :delete, data: { confirm: 'Are you sure?' }
              end
            end
          end
        end
      end
      row "Assigned HRMs" do |training_session|
        ul do
          hrm_assignments = HrmAssignment.where(training_session_id: training_session.id, assigned: true)
          hrm_assignments.each do |hrm_assignment|
            hrm = Hrm.find(hrm_assignment.hrm_id)
            booking = training_session.bookings.find_by(hrm_assignment: hrm_assignment)
            li do
              "#{hrm.name} (Assigned to: #{booking.user.full_name if booking})"
            end
          end
        end
      end


      row "Free HRM" do |training_session|
        ul do
          # Get HRMs associated with the training session
          assigned_hrm_ids = training_session.hrm_assignments.where(assigned: true).pluck(:hrm_id)
          # Find unassigned HRMs
          unassigned_hrms = Hrm.where.not(id: assigned_hrm_ids)
          unassigned_hrms.each do |hrm|
            li do
              hrm.name
            end
          end
        end
      end
    end
  end
end
