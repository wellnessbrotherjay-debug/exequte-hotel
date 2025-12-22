class MembershipTraining < ApplicationRecord
  belongs_to :membership_type
  belongs_to :training
end
