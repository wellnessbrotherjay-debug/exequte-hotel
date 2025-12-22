class ClassType < ApplicationRecord
  monetize :price_1_cents, :price_2_cents, :price_3_cents, :price_4_cents, :price_5_cents, :price_6_cents, :price_7_cents
  validates :name, presence: true, uniqueness: true
  validates :kind, presence: true, uniqueness: true, inclusion: {in: [1, 2, 3]}
  validates :cancel_before, presence: true
  validates :cancel_before, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  has_many :trainings
  default_scope -> { where(destroyed_at: nil) }

end
