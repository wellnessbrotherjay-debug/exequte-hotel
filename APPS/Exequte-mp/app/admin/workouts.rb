ActiveAdmin.register Workout do
  #permit_params :photo, :video, :name, :cn_name, :description, :cn_description, :quote, :cn_quote, :title, :cn_title, :level, :total_duration, :warmup_duration, :warmup_exercise_duration, :blocks_duration, :block_a_format, :block_b_format, :block_c_format, :finisher_format, :block_a_title, :block_b_title, :block_c_title, :finisher_title, :block_a_duration_format, :block_b_duration_format, :block_c_duration_format, :finisher_duration_format, :block_a_reps_text, :block_b_reps_text, :block_c_reps_text, :finisher_reps_text, :warmup_duration_format,  :title_footer, :cn_title_footer, :blocks_rounds, :blocks_duration_text, :blocks_exercise_duration, :cooldown_duration, :breathing_duration, :workout_type, :training_session_id, :training_id, training_ids: [], training_session_ids: [],  exercises_workouts_attributes: [:id, :exercise_id, :format, :block, :reps_gold, :reps_silver, :reps_bronze, :sets, :time_limit, :_destroy]
  permit_params :photo, :video, :name, :cn_name, :description, :cn_description, :quote, :cn_quote, :title, :cn_title, :level, :total_duration, :warmup_duration, :warmup_exercise_duration, :blocks_duration, :block_a_format, :block_b_format, :block_c_format, :finisher_format, :block_a_title, :block_b_title, :block_c_title, :finisher_title, :block_a_duration_format, :block_b_duration_format, :block_c_duration_format, :finisher_duration_format, :block_a_reps_text, :block_b_reps_text, :block_c_reps_text, :finisher_reps_text, :warmup_duration_format, :title_footer, :cn_title_footer, :blocks_rounds, :blocks_duration_text, :blocks_exercise_duration, :cooldown_duration, :breathing_duration, :workout_type, :training_session_id, :training_id, training_ids: [], training_session_ids: [], exercises_workouts_attributes: [:id, :exercise_id, :format, :block, :reps, :reps_gold, :reps_silver, :reps_bronze, :sets, :time_limit, :_destroy, :batch_index, :order]

  index do
    selectable_column
    column :id
    column :name
    column :workout_type
    column :title
    column :level
    column :quote
    column :trainings
    column :photo_link do |workout|
      if workout.photo.attached?
        url = workout.photo.service_url[0..10] +  " ... " + workout.photo.service_url[-20..-1]
        span link_to url, workout.photo.service_url
      end
    end
    column :video_link do |workout|
      if workout.video.attached?
        url = workout.video.service_url[0..10]  + " ... " + workout.video.service_url[-20..-1]
        span link_to url, workout.video.service_url
      end
    end
    column :photo do |workout|
      if workout.photo.attached?
        image_tag workout.photo, width: 50
      end
    end
    column :video do |workout|
      if workout.video.attached?
        video_tag workout.video.service_url, width: 80, controls: true
      end
    end
    column :updated_at
    column :created_at
    actions do |workout|
      link_to 'Download Template', '#', data: { workout_id: workout.id, workout_name: workout.name } , class: 'download_link member_link', onclick: 'downloadWorkoutTemplate(this);return false;'
    end
    render partial: 'admin/index'
    render partial: 'admin/template'
  end

  show do
    attributes_table do
      row :id
      row :name
      row :cn_name
      row :workout_type
      row :description
      row :cn_description
      row :quote
      row :cn_quote
      row :title
      row :cn_title
      row :title_footer
      row :cn_title_footer
      row :level
      row :total_duration
      row :warmup_duration
      row :warmup_exercise_duration
      row :block_a_format
      row :block_b_format
      row :block_c_format
      row :finisher_format
      row :block_a_title
      row :block_b_title
      row :block_c_title
      row :finisher_title
      row :block_a_reps_text
      row :block_b_reps_text
      row :block_c_reps_text
      row :finisher_reps_text
      row :block_a_duration_format
      row :block_b_duration_format
      row :block_c_duration_format
      row :finisher_duration_format
      row :warmup_duration_format
      row :blocks_duration
      row :blocks_rounds
      row :blocks_duration_text
      row :blocks_exercise_duration
      row :cooldown_duration
      row :breathing_duration
      row :trainings
      row :photo_link do |workout|
        if workout.photo.attached?
          span link_to workout.photo.service_url, workout.photo.service_url
        end
      end
      row :photo do |workout|
        if workout.photo.attached?
          image_tag workout.photo, width: 200
        end
      end
      row :video_link do |workout|
        if workout.video.attached?
          span link_to workout.video.service_url, workout.video.service_url
        end
      end
      row :video do |workout|
        if workout.video.attached?
          video_tag workout.video.service_url, controls: true
        end
      end
      row :json do |workout|
        div class: 'collapsible' do
          span class: 'collapsible-header', onclick: '(function(event){var content = event.target.nextElementSibling; content.style.display = content.style.display === "none" ? "block" : "none";})(event)' do
            'JSON'
          end
          div class: 'collapsible-content', style: 'display: none' do
            pre JSON.pretty_generate(workout.show_hash_blocks)
          end
        end
      end
    end

    panel 'Exercises' do
      grouped_exercises_workouts = workout.exercises_workouts.order(:block, :order).group_by(&:block)

      ordered_blocks = ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher', 'cooldown', 'breathing']

      ordered_blocks.each do |block_name|
        exercise_workouts = grouped_exercises_workouts[block_name]

        next if exercise_workouts.blank?

        span block_name.capitalize, class: 'group-heading' do
          table_for exercise_workouts do
            column :order
            column :exercise
            column :block
            column :format
            column :reps
            column :reps_gold
            column :reps_silver
            column :reps_bronze
            column :sets
            column :time_limit
            column :created_at
            column :updated_at
          end
        end
      end
    end

    render partial: 'admin/show'
    render partial: 'admin/template'
    active_admin_comments
  end

  form do |f|
    f.semantic_errors

    f.inputs 'Workout Details' do
      f.input :name
      f.input :cn_name
      f.input :description
      f.input :cn_description
      # Default values for new records only
      if f.object.new_record?
        f.input :quote, input_html: { value: '"Keep your face always toward the sunshine, and shadows will fall behind you."' }
        f.input :level, input_html: { value: '5' }
        f.input :block_a_format, input_html: { value: 'EMOM' }
        f.input :block_b_format, input_html: { value: 'EMOM' }
        f.input :block_c_format, input_html: { value: 'EMOM' }
        f.input :finisher_format, input_html: { value: 'TABATA' }
        f.input :block_a_title, input_html: { value: 'Block A' }
        f.input :block_b_title, input_html: { value: 'Block B' }
        f.input :block_c_title, input_html: { value: 'Block C' }
        f.input :finisher_title, input_html: { value: 'Finisher' }
        f.input :block_a_duration_format, input_html: { value: '20 min AMRAP' }
        f.input :block_b_duration_format, input_html: { value: '20 min AMRAP' }
        f.input :block_c_duration_format, input_html: { value: '20 min AMRAP' }
        f.input :finisher_duration_format, input_html: { value: 'Tabata' }
        f.input :warmup_duration_format, input_html: { value: '6 min AMRAP' }
        f.input :blocks_duration_text, input_html: { value: '40 min AMRAP' }
      end
      f.input :quote
      f.input :cn_quote
      f.input :title
      f.input :cn_title
      f.input :title_footer
      f.input :cn_title_footer
      f.input :level
      f.input :total_duration
      f.input :blocks_duration
      f.input :blocks_duration_text
      f.input :blocks_rounds
      f.input :blocks_exercise_duration
      f.input :warmup_duration
      f.input :warmup_exercise_duration
      f.input :block_a_title
      f.input :block_b_title
      f.input :block_c_title
      f.input :finisher_title
      f.input :block_a_reps_text
      f.input :block_b_reps_text
      f.input :block_c_reps_text
      f.input :finisher_reps_text
      f.input :warmup_duration_format
      f.input :block_a_duration_format
      f.input :block_b_duration_format
      f.input :block_c_duration_format
      f.input :finisher_duration_format
      f.input :cooldown_duration
      f.input :breathing_duration
      f.input :workout_type, as: :select, collection: ['power', 'plyo', 'deload', 'hiit']
      #f.input :workout_type, as: :select, collection: Workout.workout_types.keys
      f.input :trainings, as: :select, collection: Training.all.map { |t| [t.name, t.id] }
      f.input :photo, as: :file
      f.input :video, as: :file
    end


    f.inputs 'Exercises' do
      f.has_many :exercises_workouts, heading: false, allow_destroy: true, new_record: true do |ew|
        exercises_collection = Exercise.all.order_by_name.map { |e| [e.name, e.id] }
        ew.input :exercise, as: :select, collection: exercises_collection
        # ew.input :exercise, as: :select, collection: Exercise.all.order_by_name.map { |e| [e.name, e.id] }
        ew.input :block, as: :select, collection: ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher' , 'cooldown', 'breathing']
        ew.input :format, as: :string, input_html: { id: "format-input-#{ew.object.id}" }
        ew.input :format, as: :select, collection: ['TABATA', 'EMOM', 'AMRAP', 'OTHER'], prompt: 'Select Format', input_html: { id: "format-select-#{ew.object.id}" }
        ew.input :reps
        ew.input :reps_gold
        ew.input :reps_silver
        ew.input :reps_bronze
        ew.input :sets
        ew.input :time_limit
        ew.input :order, as: :number
      end
      # Add new batch inputs for three exercises_workouts
      if f.object.new_record?
        3.times do |index|
          f.semantic_fields_for :exercises_workouts, f.object.exercises_workouts[index] || f.object.exercises_workouts.build(batch_index: index) do |ef|
            ef.inputs "Warm-Up Exercise # #{index + 1}" do
              exercises_collection = Exercise.all.order_by_name.map { |e| [e.name, e.id] }
              ef.input :exercise, as: :select, collection: exercises_collection, selected: exercises_collection.first[1]
              ef.input :block, as: :select, collection: ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher', 'cooldown', 'breathing'], selected: 'warm-up'
              ef.input :format, as: :string, input_html: { id: "format-input-#{ef.object_id}" }
              ef.input :format, as: :select, collection: ['TABATA', 'EMOM', 'AMRAP', 'OTHER'], prompt: 'Select Format', input_html: { id: "format-select-#{ef.object_id}" } , selected: 'AMRAP'
              ef.input :reps
              ef.input :reps_gold
              ef.input :reps_silver
              ef.input :reps_bronze
              ef.input :sets
              ef.input :time_limit
              ef.input :order, as: :number
              # Add Remove button for batch input records
              ef.input :_destroy, as: :boolean, label: 'Remove'
            end
          end
        end
        3.times do |index|
          f.semantic_fields_for :exercises_workouts, f.object.exercises_workouts[index] || f.object.exercises_workouts.build(batch_index: index) do |ef|
            ef.inputs "Block A Exercise # #{index + 1}" do
              exercises_collection = Exercise.all.order_by_name.map { |e| [e.name, e.id] }
              ef.input :exercise, as: :select, collection: exercises_collection, selected: exercises_collection.first[1]
              ef.input :block, as: :select, collection: ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher', 'cooldown', 'breathing'], selected: 'block-a'
              ef.input :format, as: :string, input_html: { id: "format-input-#{ef.object_id}" }
              ef.input :format, as: :select, collection: ['TABATA', 'EMOM', 'AMRAP', 'OTHER'], prompt: 'Select Format', input_html: { id: "format-select-#{ef.object_id}" } , selected: 'EMOM'
              ef.input :reps
              ef.input :reps_gold
              ef.input :reps_silver
              ef.input :reps_bronze
              ef.input :sets
              ef.input :time_limit
              ef.input :order, as: :number
              # Add Remove button for batch input records
              ef.input :_destroy, as: :boolean, label: 'Remove'
            end
          end
        end
        3.times do |index|
          f.semantic_fields_for :exercises_workouts, f.object.exercises_workouts[index] || f.object.exercises_workouts.build(batch_index: index) do |ef|
            ef.inputs "Block B Exercise # #{index + 1}" do
              exercises_collection = Exercise.all.order_by_name.map { |e| [e.name, e.id] }
              ef.input :exercise, as: :select, collection: exercises_collection, selected: exercises_collection.first[1]
              ef.input :block, as: :select, collection: ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher', 'cooldown', 'breathing'], selected: 'block-b'
              ef.input :format, as: :string, input_html: { id: "format-input-#{ef.object_id}" }
              ef.input :format, as: :select, collection: ['TABATA', 'EMOM', 'AMRAP', 'OTHER'], prompt: 'Select Format', input_html: { id: "format-select-#{ef.object_id}" } , selected: 'EMOM'
              ef.input :reps
              ef.input :reps_gold
              ef.input :reps_silver
              ef.input :reps_bronze
              ef.input :sets
              ef.input :time_limit
              ef.input :order, as: :number
              # Add Remove button for batch input records
              ef.input :_destroy, as: :boolean, label: 'Remove'
            end
          end
        end
        3.times do |index|
          f.semantic_fields_for :exercises_workouts, f.object.exercises_workouts[index] || f.object.exercises_workouts.build(batch_index: index) do |ef|
            ef.inputs "Block C Exercise # #{index + 1}" do
              exercises_collection = Exercise.all.order_by_name.map { |e| [e.name, e.id] }
              ef.input :exercise, as: :select, collection: exercises_collection, selected: exercises_collection.first[1]
              ef.input :block, as: :select, collection: ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher', 'cooldown', 'breathing'], selected: 'block-c'
              ef.input :format, as: :string, input_html: { id: "format-input-#{ef.object_id}" }
              ef.input :format, as: :select, collection: ['TABATA', 'EMOM', 'AMRAP', 'OTHER'], prompt: 'Select Format', input_html: { id: "format-select-#{ef.object_id}" } , selected: 'EMOM'
              ef.input :reps
              ef.input :reps_gold
              ef.input :reps_silver
              ef.input :reps_bronze
              ef.input :sets
              ef.input :time_limit
              ef.input :order, as: :number
              # Add Remove button for batch input records
              ef.input :_destroy, as: :boolean, label: 'Remove'
            end
          end
        end
        1.times do |index|
          f.semantic_fields_for :exercises_workouts, f.object.exercises_workouts[index] || f.object.exercises_workouts.build(batch_index: index) do |ef|
            ef.inputs "Finisher Exercise #" do
              exercises_collection = Exercise.all.order_by_name.map { |e| [e.name, e.id] }
              ef.input :exercise, as: :select, collection: exercises_collection, selected: exercises_collection.first[1]
              ef.input :block, as: :select, collection: ['warm-up', 'block-a', 'block-b', 'block-c', 'finisher', 'cooldown', 'breathing'], selected: 'finisher'
              ef.input :format, as: :string, input_html: { id: "format-input-#{ef.object_id}" }
              ef.input :format, as: :select, collection: ['TABATA', 'EMOM', 'AMRAP', 'OTHER'], prompt: 'Select Format', input_html: { id: "format-select-#{ef.object_id}" } , selected: 'EMOM'
              ef.input :reps
              ef.input :reps_gold
              ef.input :reps_silver
              ef.input :reps_bronze
              ef.input :sets
              ef.input :time_limit
              ef.input :order, as: :number

              # Add Remove button for batch input records
              ef.input :_destroy, as: :boolean, label: 'Remove'
            end
          end
        end
      end
    end
    render partial: 'admin/form'
    f.actions
  end
end
