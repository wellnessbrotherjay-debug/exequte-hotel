class UserCoupon < ApplicationRecord
  belongs_to :user
  belongs_to :coupon
  validates :user_id, uniqueness: {scope: :coupon_id}
  default_scope -> { where(destroyed_at: nil) }
end
