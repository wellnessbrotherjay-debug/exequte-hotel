# frozen_string_literal: true
class HrmService

  def fetch_heart_rate_data(bandId, start_timestamp, end_timestamp, gender, weight, age)
    api_url = "https://hrm.exequte.cn"
    url = "#{api_url}/calccalories"
    request_data = {
      bandId: bandId,
      startTimestamp: start_timestamp,
      endTimestamp: end_timestamp,
      gender: gender,
      weight: weight,
      age: age
    }

    begin
      response = RestClient.post(url, request_data.to_json, content_type: :json)
      if response.code == 200
        data = JSON.parse(response)
        return {
          calories_burned: data['caloriesBurned'].to_i,
          avg_hr: data['avgHeartRate'].to_i,
          max_hr: data['maxHeartRate'].to_i,
          exercise_duration_minutes: data['exerciseDurationMinutes']
        }
      else
        puts "HTTP request failed with status code #{response.code}"
        return nil
      end
    rescue RestClient::ExceptionWithResponse => e
      puts "Error calculating calories: #{e.response}"
      return nil
    rescue StandardError => e
      puts "Error calculating calories: #{e.message}"
      return nil
    end
  end
  def fetch_heart_rate_graph(bandId, start_timestamp, end_timestamp, gender, weight, age)
    api_url = "https://hrm.exequte.cn"
    url = "#{api_url}/gethrmgraph"
    request_data = {
      bandId: bandId,
      startTimestamp: start_timestamp,
      endTimestamp: end_timestamp,
      gender: gender,
      weight: weight,
      age: age
    }

    begin
      response = RestClient.post(url, request_data.to_json, content_type: :json)
      if response.code == 200
        data = JSON.parse(response)
        return data
      else
        puts "HTTP request failed with status code #{response.code}"
        return nil
      end
    rescue RestClient::ExceptionWithResponse => e
      puts "Error calculating calories: #{e.response}"
      return nil
    rescue StandardError => e
      puts "Error calculating calories: #{e.message}"
      return nil
    end
  end


  def fetch_heart_rate_all_with_pic(bandId, start_timestamp, end_timestamp, gender, weight, age, ranking, name, skills,
                                    points, workout_name, workout_coach, workout_date, avatar_img)
    api_url = "https://hrm.exequte.cn"
    url = "#{api_url}/gethrmpic"
    request_data = {
      bandId: bandId,
      startTimestamp: start_timestamp,
      endTimestamp: end_timestamp,
      gender: gender,
      weight: weight,
      age: age,
      ranking: ranking,
      name: name,
      skills: skills,
      points: points,
      workout_name: workout_name,
      workout_coach: workout_coach,
      workout_date: workout_date,
      avatar_img: avatar_img
    }

    begin
      response = RestClient.post(url, request_data.to_json, content_type: :json)
      if response.code == 200
        data = JSON.parse(response)
        puts "#{data}"
        return data
      else
        puts "HTTP request failed with status code #{response.code}"
        return nil
      end
    rescue RestClient::ExceptionWithResponse => e
      puts "Error calculating calories: #{e.response}"
      return nil
    rescue StandardError => e
      puts "Error calculating calories: #{e.message}"
      return nil
    end
  end

  def fetch_heart_rate_all(bandId, start_timestamp, end_timestamp, gender, weight, age)
    api_url = "https://hrm.exequte.cn"
    url = "#{api_url}/gethrmdatagraph"
    request_data = {
      bandId: bandId,
      startTimestamp: start_timestamp,
      endTimestamp: end_timestamp,
      gender: gender,
      weight: weight,
      age: age
    }

    begin
      response = RestClient.post(url, request_data.to_json, content_type: :json)
      if response.code == 200
        data = JSON.parse(response)
        puts "#{data}"
        return data
      else
        puts "HTTP request failed with status code #{response.code}"
        return nil
      end
    rescue RestClient::ExceptionWithResponse => e
      puts "Error calculating calories: #{e.response}"
      return nil
    rescue StandardError => e
      puts "Error calculating calories: #{e.message}"
      return nil
    end
  end

  def get_combined_picture(requestPayload)
    api_url = "https://graph.exequte.cn"
    url = "#{api_url}/generateImage"
    begin
      response = RestClient.post(url, requestPayload.to_json, content_type: :json)
      if response.code == 200
        data = JSON.parse(response)
        puts "#{data}"
        return data
      else
        puts "HTTP request failed with status code #{response.code}"
        return nil
      end
    rescue RestClient::ExceptionWithResponse => e
      puts "Error calculating calories: #{e.response}"
      return nil
    rescue StandardError => e
      puts "Error calculating calories: #{e.message}"
      return nil
    end
  end


end
