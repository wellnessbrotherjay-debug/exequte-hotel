# frozen_string_literal: true

class Hrm < ApplicationRecord
  has_many :hrm_assignments
  has_many :training_sessions, through: :hrm_assignments

  def show_hash
    {
      id: id,
      name: name,
      hub: hub,
      display_name: display_name,
      is_used: is_used
    }
  end

end
