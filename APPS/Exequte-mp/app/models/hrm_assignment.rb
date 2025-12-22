class HrmAssignment < ApplicationRecord
  belongs_to :hrm
  belongs_to :training_session

  # You can have a method to assign an HRM
  def assign_hrm
    update(assigned: true)
  end

  # You can have a method to unassign an HRM
  def unassign_hrm
    update(assigned: false)
  end

  def show_hash
    # hrm_assignments.each do |hrm_assignment|
    #   hrm = Hrm.find(hrm_assignment.hrm_id)
    #   booking = training_session.bookings.find_by(hrm_assignment: hrm_assignment)
    #   li do
    #     "#{hrm.name} (Assigned to: #{booking.user.full_name if booking})"
    #   end
    # end
    # {
    #   id: id,
    #   name: name.presence || ""
    # }
  end
end
