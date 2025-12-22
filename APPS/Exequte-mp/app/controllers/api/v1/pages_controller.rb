module Api
  module V1
    class PagesController < Api::BaseController
      def make_strings
        # puts "Inside make_strings"
        # p request.headers['X-API-Lang']
        # page = params["page"]
        # keys = params["keys"]
        # strings = {}
        # keys.each do |key|
        #   strings[key] = I18n.t("miniprogram.#{page}.#{key}")
        # end
        # render_success(strings)
        render_success(I18n.t("miniprogram.#{params[:page]}"))
      end
    end
  end
end
