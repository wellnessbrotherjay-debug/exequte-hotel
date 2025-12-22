module Api
  module V1
    class MembershipTypesController < Api::BaseController
      def index
        begin
          #if new user / no bookings were made before, show all class-packs (including trials)
          is_existing_user = current_user.bookings.active.settled.with_ts.any?
          @membership_types = is_existing_user ? MembershipType.active.not_trial : MembershipType.active
          if (params[:session_id])
            @training_session = TrainingSession.find(params[:session_id])
            if @training_session && @training_session.is_limited
              @training = @training_session.training
              membership_collection = []
              @membership_types.with_trainings.each do | b |
                b.trainings.each do | t |
                  if (@training.id == t.id)
                    membership_collection.append(b)
                  end
                end
              end
              render_success(membership_collection.map(&:standard_hash))
            else
              render_success(@membership_types.is_not_limited.map(&:standard_hash))
            end
          else
          render_success(@membership_types.is_not_limited.map(&:standard_hash))
          end
        rescue => e
          puts ">>something went wrong, return all membership_types"
          @membership_types = MembershipType.active.is_not_limited.
          render_success(@membership_types.map(&:standard_hash))
        end
      end
    end
  end
end
