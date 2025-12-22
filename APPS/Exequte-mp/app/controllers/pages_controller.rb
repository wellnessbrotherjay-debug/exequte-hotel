class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home, :wx_token ]

  def home
  end


  def wx_token
    WechatNotifier.set_token if params[:again].present?
    token = WechatNotifier.get_token
    render plain: token
  end

end
