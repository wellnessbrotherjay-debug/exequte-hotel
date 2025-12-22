Rails.application.routes.draw do
  ActiveAdmin.routes(self)
  devise_for :users
  devise_scope :user do
    get '/users/sign_in', to: redirect('/')
  end
  root to: 'pages#home'
  get "wx_token", to: "pages#wx_token"


  resources :training_sessions, only: %i[new create show]
  resources :workouts, only: %i[new create show]
  resources :info_items, only: %i[new create show]
  resources :trainings, only: %i[new create show]

  #helper methods for the workout backend
  namespace :admin do
    resources :workouts do
      resources :exercises, only: [:index]
      resources :exercise_workouts, only: [:edit, :update, :destroy]
    end
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do

      # PAGES
      post 'pages', to: "pages#make_strings"

      # COUPONS
      get 'coupons', to: "coupons#use_coupon"
      # USERS
      resources :users, only: %i[index show update] do
        collection do
          post :wx_login
          get :info
          get :instructors
        end
        member do
          get :instructor
          post :avatar
          put :process_wx_info
        end
      end

      # TRAINING_SESSIONS
      resources :training_sessions, only: [:index, :show] do
        resources :bookings, only: [:create] do
          collection do
            # get :attendance_list
          end
        end
        member do
          put :add_user_to_queue
          put :cancel
          put :change_capacity
          get :session_attendance
        end
        collection do
          get :dates_list
          get :instructor_sessions
          get :admin_sessions
          get :current
          get :current_hrm
          get :current_switch_block
          get :sessions
        end
      end

      # BOOKINGS
      resources :bookings, only: %i[index show destroy] do
        member do
          put :cancel
        end
        collection do
          put :take_attendance
        end
      end

      # MEMBERSHIP_TYPES
      resources :membership_types, only: [:index] do
        resources :memberships, only: [:create]
      end

      # MEMBERSHIPS
      resources :memberships, only: [:destroy]

      # BANNERS
      resources :banners, only: [:index]

      # INFOS
      resources :infos, only: [:index]

      # SETTINGS
      resources :settings, only: [:index]

      # WORKOUTS
      resources :workouts, only: [:index, :show] do
        member do
          get :show_all
        end
      end

      # HRM
      resources :hrms, only: [:index, :show] do
        collection do
          get :get_data
          get :get_graph
          get :get_data_graph
        end
      end

      # WECHAT PAYMENT NOTIFICATIONS
      post "memberships/notify", to: 'memberships#payment_confirmed', format: :xml
      post "bookings/notify", to: 'bookings#payment_confirmed', format: :xml
    end
  end

  # sidekiq dashboard
  require "sidekiq/web"
  authenticate :user, lambda { |u| u.admin } do
    mount Sidekiq::Web => '/sidekiq'
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
