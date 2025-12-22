module Api
  module V1
    class BannersController < Api::BaseController
      def index
        @banner = Banner.where(current: true)
        render_success(@banner.map(&:standard_hash))
      end
    end
  end
end
