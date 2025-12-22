class Training < ApplicationRecord
  validates :name, presence: true
  validates :subtitle, uniqueness: { scope: :name }
  validates :cn_name, presence: true, uniqueness: true
  validates :description, presence: true
  validates :cn_description, presence: true
  validates :duration, presence: true
  validates :duration, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :capacity, presence: true
  validates :capacity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  belongs_to :class_type
  has_many :training_sessions
  has_many :bookings, through: :training_sessions
  has_many :membership_trainings
  has_many :membership_types, through: :membership_trainings, source: :membership_type
  has_and_belongs_to_many :workouts
  accepts_nested_attributes_for :membership_trainings
  has_one_attached :photo
  has_one_attached :poster_photo
  default_scope -> { where(destroyed_at: nil) }
  scope :limited, -> {where(is_limited: true)}
  scope :not_limited, -> {where(is_limited: false)}

  def localize_description
    I18n.locale == :'zh-CN' ? cn_description : description
  end

  def full_name
    "#{name} #{subtitle}"
  end
end
