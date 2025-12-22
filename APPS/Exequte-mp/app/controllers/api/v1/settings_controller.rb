module Api
  module V1
    class SettingsController < Api::BaseController
      def index
        key = params[:key]
        value = ""
        begin
          value = Settings.find_by(key: key).value
          puts "====================KEY:#{key}, VALUE:#{value}==========="
        rescue => e
          puts  "===================SETTING NOT FOUND, USING 1 as DEFAULT ========================="
        end
        render_success(value)
      end
    end
  end
end
