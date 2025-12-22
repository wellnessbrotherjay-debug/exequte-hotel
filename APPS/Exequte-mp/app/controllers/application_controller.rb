class ApplicationController < ActionController::Base

  before_action :set_locale
  USERS_PER_PAGE  = 20.freeze
  # respond_to :json

  # Devise stub: login disabled, so this is a no-op to keep controllers happy
  def authenticate_user!
  end

  def destroy_admin_user_session_path
    session[:current_admin] = nil
    return "/"
  end

  private
  def per_param
    params[:per] || USERS_PER_PAGE
  end

  def offset_param
    return 0 unless params[:page].present?
    params[:page].to_i * USERS_PER_PAGE
  end

  def set_locale
    I18n.locale = params[:locale] || session[:locale] || I18n.default_locale

    if request.headers['X-API-Lang'].present? && request.headers['X-API-Lang'].to_sym.in?(I18n.available_locales)
      I18n.locale = request.headers['X-API-Lang']
    end
    session[:locale] = I18n.locale
  end
end
