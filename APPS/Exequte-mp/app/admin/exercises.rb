ActiveAdmin.register Exercise do

  form do |f|
    f.inputs "Exercises" do
      f.input :photo, as: :file
      f.input :video, as: :file
      f.input :name
      f.input :cn_name
      f.input :description
      f.input :cn_description
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :name
      row :cn_name
      row :description
      row :cn_description
      row :photo_link do |exercise|
        if exercise.photo.attached?
          span link_to exercise.photo.service_url, exercise.photo.service_url
        end
      end
      row :photo do |exercise|
        if exercise.photo.attached?
          image_tag exercise.photo, width: 200
        end
      end
      row :video_link do |exercise|
        if exercise.video.attached?
          span link_to exercise.video.service_url, exercise.video.service_url
        end
      end
      row :video do |exercise|
        if exercise.video.attached?
          video_tag exercise.video.service_url, controls: true
        end
      end
    end
  end

  index do
    selectable_column
    column :id
    column :name
    column :cn_name
    column :description
    column :cn_description
    column :photo_link do |exercise|
      if exercise.photo.attached?
        url = exercise.photo.service_url[0..10] +  " ... " + exercise.photo.service_url[-20..-1]
        span link_to url, exercise.photo.service_url
      end
    end
    column :video_link do |exercise|
      if exercise.video.attached?
        url = exercise.video.service_url[0..10]  + " ... " + exercise.video.service_url[-20..-1]
        span link_to url, exercise.video.service_url
      end
    end
    column :photo do |exercise|
     if exercise.photo.attached?
       image_tag exercise.photo, width: 50
     end
    end
    column :video do |exercise|
      if exercise.video.attached?
        video_tag exercise.video.service_url, width: 80, controls: true
      end
    end
    actions
  end


  permit_params :photo, :video, :name, :cn_name, :description, :cn_description
end
