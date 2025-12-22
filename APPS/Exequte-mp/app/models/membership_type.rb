class MembershipType < ApplicationRecord
  monetize :price_cents
  validates :name, presence: true, uniqueness: true
  validates :cn_name, presence: true, uniqueness: true
  validates :duration, presence: true
  validates :duration, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  has_many :memberships
  has_many :users, through: :memberships
  has_many :membership_trainings
  has_many :trainings, through: :membership_trainings, source: :training
  accepts_nested_attributes_for :membership_trainings
  default_scope -> { where(destroyed_at: nil) }
  scope :active, -> {where(active: true)}
  scope :classpack, -> {where(is_class_pack: true)}
  scope :not_classpack, -> {where(is_class_pack: false)}
  scope :trial, -> {where(is_trial: true)}
  scope :not_trial, -> {where(is_trial: false)}
  scope :with_trainings, -> { includes(:trainings) }
  scope :is_limited, -> {where(is_limited: true)}
  scope :is_not_limited, -> {where(is_limited: false)}

  def standard_hash
    {
      id: id,
      name: localize_name,
      duration: duration,
      price: price.to_i,
      vouchers: vouchers,
      is_class_pack: is_class_pack,
      bookings_per_day: bookings_per_day,
      is_trial: is_trial,
      unlimited: unlimited?
    }
  end

  def unlimited?
    if !bookings_per_day || bookings_per_day == -1
      return true
    else
      return false
    end
  end

end
