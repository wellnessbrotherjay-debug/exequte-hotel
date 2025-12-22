
class Workout < ApplicationRecord
  has_and_belongs_to_many :trainings
  has_and_belongs_to_many :training_sessions
  # belongs_to :training_session
  # enum workout_type: [:power, :plyo, :deload, :hiit]
  has_one_attached :photo
  has_one_attached :video
  has_many :exercises_workouts
  has_many :exercises, through: :exercises_workouts
  accepts_nested_attributes_for :exercises_workouts, allow_destroy: true
  scope :order_by_name, -> { order('name ASC')}
  scope :order_by_title, -> { order('title ASC')}

  def show_hash
    {
      id: id,
      name: name,
      workout_type: workout_type,
      cn_name: cn_name,
      description: description,
      cn_description: cn_description,
      destroyed_at: destroyed_at,
      created_at: created_at,
      updated_at: updated_at,
      quote: quote,
      cn_quote: cn_quote,
      title: title,
      cn_title: cn_title,
      title_footer: title_footer,
      cn_title_footer: cn_title_footer,
      level: level,
      total_duration: total_duration,
      warmup_duration: warmup_duration,
      warmup_exercise_duration: warmup_exercise_duration,
      blocks_duration: blocks_duration,
      blocks_rounds: blocks_rounds,
      blocks_duration_text: blocks_duration_text,
      blocks_exercise_duration: blocks_exercise_duration,
      cooldown_duration: cooldown_duration,
      breathing_duration: breathing_duration,
      block_a_format: block_a_format,
      block_b_format: block_b_format,
      block_c_format: block_c_format,
      block_a_title: block_a_title,
      block_b_title: block_b_title,
      block_c_title: block_c_title,
      block_a_duration_format: block_a_duration_format,
      block_b_duration_format: block_b_duration_format,
      block_c_duration_format: block_c_duration_format,
      block_a_reps_text: block_a_reps_text,
      block_b_reps_text: block_b_reps_text,
      block_c_reps_text: block_c_reps_text,
      warmup_duration_format: warmup_duration_format,
      finisher_title: finisher_title,
      finisher_format: finisher_format,
      finisher_duration_format: finisher_duration_format,
      finisher_reps_text: finisher_reps_text,
      training_id: training_id,
      training_session_id: training_session_id,
      photo: photo.attached? ? photo.service_url : "",
      video: video.attached? ? video.service_url : "",
      exercises_workouts: exercises_workouts.map do |ew|
        {
          name: ew.exercise.name,
          cn_name: ew.exercise.cn_name,
          description: ew.exercise.description,
          cn_description: ew.exercise.cn_description,
          photo: ew.exercise.photo.attached? ? ew.exercise.photo.service_url : "",
          video: ew.exercise.video.attached? ? ew.exercise.video.service_url : "",
          reps_gold: ew.reps_gold,
          reps_silver: ew.reps_silver,
          reps_bronze: ew.reps_bronze,
          block: ew.block,
          format: ew.format,
          sets: ew.sets,
          time: ew.time_limit
        }
      end
    }
  end



  # def show_hash_blocks
  #   {
  #     id: id,
  #     name: name,
  #     workout_type: workout_type,
  #     cn_name: cn_name,
  #     description: description,
  #     cn_description: cn_description,
  #     destroyed_at: destroyed_at,
  #     created_at: created_at,
  #     updated_at: updated_at,
  #     quote: quote,
  #     cn_quote: cn_quote,
  #     title: title,
  #     cn_title: cn_title,
  #     title_footer: title_footer,
  #     cn_title_footer: cn_title_footer,
  #     level: level,
  #     total_duration: total_duration,
  #     warmup_duration: warmup_duration,
  #     warmup_exercise_duration: warmup_exercise_duration,
  #     blocks_duration: blocks_duration,
  #     blocks_rounds: blocks_rounds,
  #     blocks_duration_text: blocks_duration_text,
  #     blocks_exercise_duration: blocks_exercise_duration,
  #     cooldown_duration: cooldown_duration,
  #     breathing_duration: breathing_duration,
  #     block_a_format: block_a_format,
  #     block_b_format: block_b_format,
  #     block_c_format: block_c_format,
  #     block_a_title: block_a_title,
  #     block_b_title: block_b_title,
  #     block_c_title: block_c_title,
  #     block_a_duration_format: block_a_duration_format,
  #     block_b_duration_format: block_b_duration_format,
  #     block_c_duration_format: block_c_duration_format,
  #     block_a_reps_text: block_a_reps_text,
  #     block_b_reps_text: block_b_reps_text,
  #     block_c_reps_text: block_c_reps_text,
  #     warmup_duration_format: warmup_duration_format,
  #     finisher_title: finisher_title,
  #     finisher_format: finisher_format,
  #     finisher_duration_format: finisher_duration_format,
  #     finisher_reps_text: finisher_reps_text,
  #     training_id: training_id,
  #     training_session_id: training_session_id,
  #     photo: photo.attached? ? photo.service_url : "",
  #     video: video.attached? ? video.service_url : "",
  #     exercises_workouts: exercises_workouts.map do |ew|
  #       {
  #         name: ew.exercise.name,
  #         cn_name: ew.exercise.cn_name,
  #         description: ew.exercise.description,
  #         cn_description: ew.exercise.cn_description,
  #         photo: ew.exercise.photo.attached? ? ew.exercise.photo.service_url : "",
  #         video: ew.exercise.video.attached? ? ew.exercise.video.service_url : "",
  #         reps_gold: ew.reps_gold,
  #         reps_silver: ew.reps_silver,
  #         reps_bronze: ew.reps_bronze,
  #         block: ew.block,
  #         format: ew.format,
  #         sets: ew.sets,
  #         time: ew.time_limit
  #       }
  #     end
  #   }
  # end

  #safe version with null checks
  def show_hash_blocks
    blocks = exercises_workouts.group_by(&:block).transform_values do |exercises|
      exercises.sort_by { |ew| ew.order ? ew.order : ew.id }.map do |ew|
        exercise = ew.exercise

        {
          name: exercise&.name.presence || "",
          cn_name: exercise&.cn_name.presence || "",
          description: exercise&.description.presence || "",
          cn_description: exercise&.cn_description.presence || "",
          photo: exercise&.photo&.attached? ? exercise.photo.service_url : "",
          video: exercise&.video&.attached? ? exercise.video.service_url : "",
          reps: ew.reps.presence || "",
          reps_gold: ew.reps_gold.presence || "",
          reps_silver: ew.reps_silver.presence || "",
          reps_bronze: ew.reps_bronze.presence || "",
          format: ew.format.presence || "",
          sets: ew.sets.presence || "",
          time: ew.time_limit.presence || "",
          order: ew.order.presence || ""
        }
      end
    end

    {
      id: id,
      name: name.presence || "",
      workout_type: workout_type.presence || "",
      cn_name: cn_name.presence || "",
      description: description.presence || "",
      cn_description: cn_description.presence || "",
      destroyed_at: destroyed_at.presence || "",
      created_at: created_at.presence || "",
      updated_at: updated_at.presence || "",
      quote: quote.presence || "",
      cn_quote: cn_quote.presence || "",
      title: title.presence || "",
      cn_title: cn_title.presence || "",
      title_footer: title_footer.presence || "",
      cn_title_footer: cn_title_footer.presence || "",
      level: level.presence || "",
      total_duration: total_duration.presence || "",
      warmup_duration: warmup_duration.presence || "",
      warmup_exercise_duration: warmup_exercise_duration.presence || "",
      blocks_duration: blocks_duration.presence || "",
      blocks_rounds: blocks_rounds.presence || "",
      blocks_duration_text: blocks_duration_text.presence || "",
      blocks_exercise_duration: blocks_exercise_duration.presence || "",
      cooldown_duration: cooldown_duration.presence || "",
      breathing_duration: breathing_duration.presence || "",
      block_a_format: block_a_format.presence || "",
      block_b_format: block_b_format.presence || "",
      block_c_format: block_c_format.presence || "",
      block_a_title: block_a_title.presence || "",
      block_b_title: block_b_title.presence || "",
      block_c_title: block_c_title.presence || "",
      block_a_duration_format: block_a_duration_format.presence || "",
      block_b_duration_format: block_b_duration_format.presence || "",
      block_c_duration_format: block_c_duration_format.presence || "",
      block_a_reps_text: block_a_reps_text.presence || "",
      block_b_reps_text: block_b_reps_text.presence || "",
      block_c_reps_text: block_c_reps_text.presence || "",
      warmup_duration_format: warmup_duration_format.presence || "",
      finisher_title: finisher_title.presence || "",
      finisher_format: finisher_format.presence || "",
      finisher_duration_format: finisher_duration_format.presence || "",
      finisher_reps_text: finisher_reps_text.presence || "",
      training_id: training_id.presence || "",
      training_session_id: training_session_id.presence || "",
      photo: photo.attached? ? photo.service_url : "",
      video: video.attached? ? video.service_url : "",
      exercises_workouts: blocks
    }
  end

  # def show_hash_blocks
  #   blocks = exercises_workouts.group_by(&:block).transform_values do |exercises|
  #     exercises.sort_by { |ew| ew.order ? ew.order : ew.id }.map do |ew|
  #       {
  #         name: ew.exercise.name,
  #         cn_name: ew.exercise.cn_name,
  #         description: ew.exercise.description,
  #         cn_description: ew.exercise.cn_description,
  #         photo: ew.exercise.photo.attached? ? ew.exercise.photo.service_url : "",
  #         video: ew.exercise.video.attached? ? ew.exercise.video.service_url : "",
  #         reps_gold: ew.reps_gold,
  #         reps_silver: ew.reps_silver,
  #         reps_bronze: ew.reps_bronze,
  #         format: ew.format,
  #         sets: ew.sets,
  #         time: ew.time_limit,
  #         order: ew.order
  #       }
  #     end
  #   end
  #
  #   {
  #     id: id,
  #     name: name,
  #     workout_type: workout_type,
  #     cn_name: cn_name,
  #     description: description,
  #     cn_description: cn_description,
  #     destroyed_at: destroyed_at,
  #     created_at: created_at,
  #     updated_at: updated_at,
  #     quote: quote,
  #     cn_quote: cn_quote,
  #     title: title,
  #     cn_title: cn_title,
  #     title_footer: title_footer,
  #     cn_title_footer: cn_title_footer,
  #     level: level,
  #     total_duration: total_duration,
  #     warmup_duration: warmup_duration,
  #     warmup_exercise_duration: warmup_exercise_duration,
  #     blocks_duration: blocks_duration,
  #     blocks_rounds: blocks_rounds,
  #     blocks_duration_text: blocks_duration_text,
  #     blocks_exercise_duration: blocks_exercise_duration,
  #     cooldown_duration: cooldown_duration,
  #     breathing_duration: breathing_duration,
  #     block_a_format: block_a_format,
  #     block_b_format: block_b_format,
  #     block_c_format: block_c_format,
  #     block_a_title: block_a_title,
  #     block_b_title: block_b_title,
  #     block_c_title: block_c_title,
  #     block_a_duration_format: block_a_duration_format,
  #     block_b_duration_format: block_b_duration_format,
  #     block_c_duration_format: block_c_duration_format,
  #     block_a_reps_text: block_a_reps_text,
  #     block_b_reps_text: block_b_reps_text,
  #     block_c_reps_text: block_c_reps_text,
  #     warmup_duration_format: warmup_duration_format,
  #     finisher_title: finisher_title,
  #     finisher_format: finisher_format,
  #     finisher_duration_format: finisher_duration_format,
  #     finisher_reps_text: finisher_reps_text,
  #     training_id: training_id,
  #     training_session_id: training_session_id,
  #     photo: photo.attached? ? photo.service_url : "",
  #     video: video.attached? ? video.service_url : "",
  #     exercises_workouts: blocks
  #   }
  # end

end


# def show_hash_blocks
#   {
#     id: id,
#     name: name,
#     workout_type: workout_type,
#     cn_name: cn_name,
#     description: description,
#     cn_description: cn_description,
#     destroyed_at: destroyed_at,
#     created_at: created_at,
#     updated_at: updated_at,
#     quote: quote,
#     cn_quote: cn_quote,
#     title: title,
#     cn_title: cn_title,
#     title_footer: title_footer,
#     cn_title_footer: cn_title_footer,
#     level: level,
#     total_duration: total_duration,
#     warmup_duration: warmup_duration,
#     warmup_exercise_duration: warmup_exercise_duration,
#     blocks_duration: blocks_duration,
#     blocks_rounds: blocks_rounds,
#     blocks_duration_text: blocks_duration_text,
#     blocks_exercise_duration: blocks_exercise_duration,
#     cooldown_duration: cooldown_duration,
#     breathing_duration: breathing_duration,
#     block_a_format: block_a_format,
#     block_b_format: block_b_format,
#     block_c_format: block_c_format,
#     block_a_title: block_a_title,
#     block_b_title: block_b_title,
#     block_c_title: block_c_title,
#     block_a_duration_format: block_a_duration_format,
#     block_b_duration_format: block_b_duration_format,
#     block_c_duration_format: block_c_duration_format,
#     block_a_reps_text: block_a_reps_text,
#     block_b_reps_text: block_b_reps_text,
#     block_c_reps_text: block_c_reps_text,
#     warmup_duration_format: warmup_duration_format,
#     finisher_title: finisher_title,
#     finisher_format: finisher_format,
#     finisher_duration_format: finisher_duration_format,
#     finisher_reps_text: finisher_reps_text,
#     training_id: training_id,
#     training_session_id: training_session_id,
#     photo: photo.attached? ? photo.service_url : "",
#     video: video.attached? ? video.service_url : "",
#     exercises_workouts: exercises_workouts.map do |ew|
#       {
#         name: ew.exercise.name,
#         cn_name: ew.exercise.cn_name,
#         description: ew.exercise.description,
#         cn_description: ew.exercise.cn_description,
#         photo: ew.exercise.photo.attached? ? ew.exercise.photo.service_url : "",
#         video: ew.exercise.video.attached? ? ew.exercise.video.service_url : "",
#         reps_gold: ew.reps_gold,
#         reps_silver: ew.reps_silver,
#         reps_bronze: ew.reps_bronze,
#         block: ew.block,
#         format: ew.format,
#         sets: ew.sets,
#         time: ew.time_limit
#       }
#     end
#   }
# end

def full_name
  "#{name} - #{workout_type}"
end
