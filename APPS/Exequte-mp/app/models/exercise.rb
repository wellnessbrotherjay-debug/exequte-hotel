# frozen_string_literal: true

class Exercise < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :cn_name, presence: true, uniqueness: true
  validates :description, presence: true
  validates :cn_description, presence: true
  has_one_attached :photo
  has_one_attached :video
  has_many :exercises_workouts
  has_many :workouts, through: :exercises_workouts
  default_scope -> { where(destroyed_at: nil) }
  scope :order_by_name, -> { order('name ASC')}
end


