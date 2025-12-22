module Api
  module V1
    class HrmsController < Api::BaseController
      skip_before_action :authenticate_api_key!, only: [:index, :show]
      skip_before_action :authenticate_user_from_token!, only: [:index, :show]
      before_action :find_hrm, only: %i[show cancel destroy]

      def index
        @hrm = Hrm.all
        render_success(@hrm.map(&:show_hash_blocks))
      end

      def show
        render_success(@hrm.show_hash_blocks)
      end

      def find_hrm
        @hrm = Hrm.find(params[:id])
      end

      def get_age(user)
        return nil if user.birthday.nil? # Return nil if there's no birthdate
        birthdate = user.birthday.to_date
        current_date = Date.today
        age = current_date.year - birthdate.year
        if current_date.month < birthdate.month || (current_date.month == birthdate.month && current_date.day < birthdate.day)
          age -= 1
        end
        age
      end

      def get_data
        bookingId = params[:bookingId]
        force = params[:force]
        @booking = Booking.find(bookingId)
        start_timestamp = @booking.training_session.begins_at - 8.hours
        end_timestamp = @booking.training_session.ends_at - 8.hours
        bandId = @booking.hrm.id
        # Create an instance of HrmService
        hrm_service = HrmService.new
        # Call the fetch_heart_rate_data method
        gender = current_user.gender.present? && ["Male", "Female"].include?(current_user.gender) ? current_user.gender : "Female"
        weight = current_user.current_weight || 60
        age = get_age(current_user) || 30
        puts "gender: #{gender},weight: #{weight}, age:#{age}"
        puts "start_timestamp: #{start_timestamp},end_timestamp: #{end_timestamp}"

        heart_rate_data = hrm_service.fetch_heart_rate_data(
          bandId,
          start_timestamp,
          end_timestamp,
          gender,
          weight,
          age
        )

        if heart_rate_data
          render_success(heart_rate_data)
        else
          render_error('Failed to retrieve heart rate data', :unprocessable_entity)
        end
      end

      def get_graph
        bookingId = params[:bookingId]
        force = params[:force]
        @booking = Booking.find(bookingId)
        start_timestamp = @booking.training_session.begins_at - 8.hours
        end_timestamp = @booking.training_session.ends_at - 8.hours
        bandId = @booking.hrm.id
        # Create an instance of HrmService
        hrm_service = HrmService.new
        # Call the fetch_heart_rate_data method
        gender = current_user.gender.present? && ["Male", "Female"].include?(current_user.gender) ? current_user.gender : "Female"
        weight = current_user.current_weight || 60
        age = get_age(current_user) || 30
        puts "gender: #{gender},weight: #{weight}, age:#{age}"
        puts "start_timestamp: #{start_timestamp},end_timestamp: #{end_timestamp}"

        heart_rate_data = hrm_service.fetch_heart_rate_graph(
          bandId,
          start_timestamp,
          end_timestamp,
          gender,
          weight,
          age
        )

        if heart_rate_data
          render_success(heart_rate_data)
        else
          render_error('Failed to retrieve heart rate data', :unprocessable_entity)
        end
      end

      def get_data_graph_old
        bookingId = params[:bookingId]
        force = params[:force]
        booking = Booking.find(bookingId)
        start_timestamp = booking.training_session.begins_at - 8.hours
        end_timestamp = booking.training_session.ends_at - 8.hours
        bandId = booking.hrm.id
        # Create an instance of HrmService
        hrm_service = HrmService.new
        # Call the fetch_heart_rate_data method
        gender = current_user.gender.present? && ["Male", "Female"].include?(current_user.gender) ? current_user.gender : "Female"
        weight = current_user.current_weight || 60
        age = get_age(current_user) || 30
        avatar_url = current_user.avatar.service_url if current_user.avatar.attached?

        puts "gender: #{gender},weight: #{weight}, age:#{age}"
        puts "start_timestamp: #{start_timestamp},end_timestamp: #{end_timestamp}"

        # Check if heart rate data already exists for this booking and user (unless flag force = true, in that case force refresh)
        heart_rate_data = HeartRateData.find_by(booking_id: booking.id)
        if heart_rate_data.nil? || force == "true"
          puts "calling api"
          heart_rate_data = hrm_service.fetch_heart_rate_all(
            bandId,
            start_timestamp,
            end_timestamp,
            gender,
            weight,
            age
          )

          puts "calling combined pic api"
          request_payload = {
            ranking: '1', #@todo ranking
            avg_bpm: heart_rate_data['hrm_data']['avg_hr'],
            max_bpm: heart_rate_data['hrm_data']['max_hr'],
            calories: heart_rate_data['hrm_data']['calories_burned'],
            name: current_user.workout_name,
            skills: current_user.sports, #todo do skills in user
            points: 200, #todo do points in session booking.training_session.points
            workout_name: booking.training_session.name,
            workout_coach: booking.training_session.instructor,
            workout_date: booking.training_session.localize_date_short,
            hrmzonegraph: heart_rate_data['hrm_zone_graph'],  # Assuming this field exists in HeartRateData
            avatar_img: avatar_url,  # Replace with the actual avatar URL or use @booking.avatar_url if available
            bpmgraph: heart_rate_data['hrm_graph']  # Assuming this field exists in HeartRateData
          }

          hrm_combined_picture = ''
          begin
            hrm_combined_picture = hrm_service.get_combined_picture(request_payload)
          rescue => e
            puts  "something went wrong fetching picture"
          end

          puts "api called"

          if heart_rate_data["error"]
            puts "HRM api returned error, not saving in DB"
            puts "#{heart_rate_data["error"]}"
          else
            heart_rate_data_attributes = {
              hrm_data_raw: heart_rate_data['hrm_data_raw'],
              hrm_data: heart_rate_data['hrm_data'],
              hrm_graph: heart_rate_data['hrm_graph'],
              hrm_zone_graph: heart_rate_data['hrm_zone_graph'],
              hrm_combined_graph: hrm_combined_picture,
            }
            # Create and associate HeartRateData with Booking
            heart_rate_data = booking.create_heart_rate_data!(heart_rate_data_attributes)
            booking.save!
          end
        end

        if heart_rate_data
          render_success(heart_rate_data)
        else
          render_error('hrm_data_error', :unprocessable_entity)
        end
      end

      def get_data_graph
        bookingId = params[:bookingId]
        force = params[:force]
        booking = Booking.find(bookingId)
        start_timestamp = booking.training_session.begins_at - 8.hours
        end_timestamp = booking.training_session.ends_at - 8.hours
        bandId = booking.hrm.id
        # Create an instance of HrmService
        hrm_service = HrmService.new
        # Call the fetch_heart_rate_data method
        gender = current_user.gender.present? && ["Male", "Female"].include?(current_user.gender) ? current_user.gender : "Female"
        weight = current_user.current_weight || 60
        age = get_age(current_user) || 30
        avatar_url = current_user.avatar.service_url if current_user.avatar.attached?
        name =  current_user.workout_name
        skills =  current_user.sports #todo do skills in user
        points =  200 #todo do points in session booking.training_session.points
        workout_name =  booking.training_session.name
        workout_coach =  booking.training_session.instructor.name
        workout_date =  booking.training_session.localize_date_short
        avatar_img =  avatar_url
        ranking = 1 #todo update with ranking logic

        puts "gender: #{gender},weight: #{weight}, age:#{age}"
        puts "start_timestamp: #{start_timestamp},end_timestamp: #{end_timestamp}"

        # Check if heart rate data already exists for this booking and user (unless flag force = true, in that case force refresh)
        heart_rate_data = HeartRateData.find_by(booking_id: booking.id)
        if heart_rate_data.nil? || force == "true"
          puts "calling api"
          heart_rate_data = hrm_service.fetch_heart_rate_all_with_pic(
            bandId,
            start_timestamp,
            end_timestamp,
            gender,
            weight,
            age,
            ranking,
            name,
            skills,
            points,
            workout_name,
            workout_coach,
            workout_date,
            avatar_img
          )


          if heart_rate_data["error"]
            puts "HRM api returned error, not saving in DB"
            puts "#{heart_rate_data["error"]}"
          else
            heart_rate_data_attributes = {
              hrm_data_raw: heart_rate_data['hrm_data_raw'],
              hrm_data: heart_rate_data['hrm_data'],
              hrm_graph: heart_rate_data['hrm_graph'],
              hrm_zone_graph: heart_rate_data['hrm_zone_graph'],
              hrm_combined_graph: heart_rate_data['hrm_combined_graph'],
            }
            # Create and associate HeartRateData with Booking
            heart_rate_data = booking.create_heart_rate_data!(heart_rate_data_attributes)
            booking.save!
          end
        end

        # Select only the desired keys
        selected_keys = ['hrm_combined_graph', 'hrm_data']
        filtered_heart_rate_data = heart_rate_data.slice(*selected_keys)
        if heart_rate_data
          render_success(filtered_heart_rate_data)
        else
          render_error('hrm_data_error', :unprocessable_entity)
        end
      end

    end
  end
end
