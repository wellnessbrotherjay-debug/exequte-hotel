class Coupon < ApplicationRecord
  has_many :user_coupons

  before_validation :set_coupon_code
  validates :coupon_code, uniqueness: true
  validates :discount, presence: true, numericality: { less_than_or_equal_to: 1, greater_than_or_equal_to: 0 }
  default_scope -> { where(destroyed_at: nil) }
  scope :active, -> {where(active: true)}

  def set_coupon_code
    self.coupon_code = self.coupon_code = SecureRandom.urlsafe_base64(6).upcase if self.coupon_code.blank?
  end

  def discount_percentage
    return 0 unless discount
    discount * 100
  end

  def discount_percentage=(value)
    self.discount = value.to_f / 100.0
  end

  def total_bookings
    Booking.where(coupon: self.coupon_code)&.count || 0
  end
end
