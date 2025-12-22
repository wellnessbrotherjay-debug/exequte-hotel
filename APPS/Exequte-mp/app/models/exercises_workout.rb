# frozen_string_literal: true

class ExercisesWorkout < ApplicationRecord
  belongs_to :workout
  belongs_to :exercise

  attribute :batch_index, :integer
end
