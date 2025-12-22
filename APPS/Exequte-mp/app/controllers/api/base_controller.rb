module Api
  class BaseController < ApplicationController
    before_action :authenticate_api_key!
    before_action :authenticate_user_from_token!
    skip_before_action :authenticate_user!
    skip_before_action :verify_authenticity_token
    ParamsSchemaInvalid = Class.new(StandardError)

    rescue_from ActiveRecord::RecordNotFound,       with: :not_found
    rescue_from ActionController::ParameterMissing, with: :parameter_missing
    rescue_from ParamsSchemaInvalid,                with: :render_exception_schema_invalid

    private

    def not_found
      render json: { error: { message: I18n.t('errors.general.resource_not_found'), code: 404 } }, status: 404
    end

    def parameter_missing
      render_error I18n.t('errors.general.parameter_missing')
    end

    def render_exception_schema_invalid(exception)
      render_error exception.message, StatusCodes::SCHEMA_INVALID
    end

    def render_error(text, code = nil)
      render json: { error: { message: text, code: code } }, status: 422
    end

    def render_success(data)
      render json: { data: data }, status: 200
    end

    def current_user
      token = request.headers['X-Auth-Token']&.split(' ')&.last
      claims = TokenService.decode(token) if token
      # @current_user ||= User.includes(:bookings, :memberships, bookings: [:training_session]).find_by(id: claims[0]['user']) if claims
      @current_user ||= User.find_by(id: claims[0]['user']) if claims
    end

    def authenticate_user_from_token!
      current_user || invalid_authentication
    end

    def invalid_authentication
      render json: { error: { message: I18n.t('errors.failure.unauthenticated'), code: nil } }, status: :unauthorized
    end

    def authenticate_api_key!
      unless request.headers['API-key'] == Rails.application.credentials.api_key
        return render json: { error: { message: I18n.t('errors.failure.invalid_api_key'), code: nil } }, status: :unauthorized
      end
    end

    def issue_jwt_token(user)
      TokenService.encode('user' => user.id)
    end
  end
end
