module Api
  module V1
    class WorkoutsController < Api::BaseController
      skip_before_action :authenticate_api_key!, only: [:index, :show]
      skip_before_action :authenticate_user_from_token!, only: [:index, :show]
      before_action :find_workout, only: %i[show cancel destroy]

      def index
        @workout = Workout.all
        render_success(@workout.map(&:show_hash_blocks))
      end

      def show
        render_success(@workout.show_hash_blocks)
      end

      def find_workout
        @workout = Workout.find(params[:id])
      end
    end
  end
end
