class AddHrmAssignmentToBookings < ActiveRecord::Migration[6.0]
  def change
    add_reference :bookings, :hrm_assignment, foreign_key: true
  end
end
