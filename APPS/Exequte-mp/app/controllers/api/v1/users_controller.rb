module Api
  module V1
    class UsersController < Api::BaseController
      skip_before_action :authenticate_user_from_token!, only: [:wx_login]
      before_action :find_user, only: %i[show instructor update wechat_avatar avatar process_wx_info]

      def avatar
        puts "==========IN AVATAR=============="
        puts "PARAMS: #{params}"
        avatar = params[:avatar]
        puts "AVATAR: #{avatar}"
        @user.avatar.attach(avatar)
        puts  "Attached?  #{@user.avatar.attached?}"
        render_success({msg: 'Avatar uploaded'})
      end

      def process_wx_info
        # saves union_id
        # saves all wx info
        # downloads avatar
        cipher = OpenSSL::Cipher.new( "AES-128-CBC")
        cipher.decrypt
        cipher.key = Base64.decode64(@user.wx_session_key)
        cipher.iv = Base64.decode64(params[:iv])
        wx_info = JSON.parse(cipher.update(Base64.decode64(params[:encryptedData])) + cipher.final)
        @user.update(union_id: wx_info["unionId"], wx_info: wx_info)
        @user.attach_avatar_from_url(params[:userInfo][:avatarUrl]) unless @user.avatar.attached?
        render_success(@user.standard_hash)
      end

      def index
        # only for Admin user to check the users
        return render_success([]) unless current_user.admin

        @users = User.offset(offset_param).limit(per_param)
        render_success(@users.map(&:show_hash))
      end

      def show
        p @user.show_hash
        render_success(@user.show_hash)
      end

      def info
        render_success(current_user.info_hash)
      end

      def instructor
        render_success(@user.instructor_hash)
      end

      def instructors
        @instructors = User.where(instructor: true).order(created_at: :asc)
        render_success(@instructors.map(&:instructor_hash))
      end

      def update
        if @user.update(permitted_params)
          render_success({ message: 'Profile updated!', user: @user.standard_hash })
        else
          render_error({ message: 'Something went wrong' })
        end
      end

      def wx_login
        # every new user will login here and create a new user and issue an auth token
        js_code = params[:code]

        return render_error(I18n.t('errors.wechat.js_code_missing'), nil) unless js_code

        client = WechatOpenidService.new(js_code)

        return render_error(I18n.t('errors.wechat.wx_app_error')) unless client.error.nil?

        result = client.request
        puts "===========Result=============="
        p result

        return render_error(I18n.t('errors.wechat.tencent_error', nil)) if result['errcode']

        user = User.find_by(wx_open_id: result['openid'])

        options = { wx_session_key: result['session_key']}
        options[:union_id] = result['unionid'] if result['unionid'] && user&.union_id.blank?

        if user
          user.update(options)
        else
          options[:wx_open_id] = result['openid']
          options[:email] = "#{SecureRandom.hex(8)}@exequte.cn"
          options[:password] = '123456'
          default_voucher_count = 1
          begin
            default_voucher_count = Settings.find_by(key: "first_time_users_voucher_count").value
            puts "====================DEFAULT VOUCHER COUNT:#{default_voucher_count}==========="
          rescue => e
            puts  "===================SETTING NOT FOUND, USING 1 as DEFAULT ========================="
            default_voucher_count = 1
          end
          options[:voucher_count] = default_voucher_count
          user = User.create(options)
        end

        auth_token = issue_jwt_token(user)
        token = {
          auth_token: auth_token,
          expires: Rails.application.credentials.jwt_expiration_seconds.to_i.seconds.from_now.to_i * 1000
        }
        puts "==============OUTPUT================"
        puts "auth_token: #{auth_token}"
        puts "token: #{token}"
        puts "user: #{user}"
        puts "standard_hash: #{user.standard_hash}"
        response = { user: user.standard_hash, auth_token: token }
        puts "Response: #{response}"
        render_success({ user: user.standard_hash, auth_token: token })
      end

      private

      def find_user
        @user = User.find_by(id: params[:id])
      end

      def permitted_params
        params.require(:user).permit(:name, :mp_email, :city, :phone, :wechat, :gender, :first_name, :last_name, :workout_name, :emergency_name, :emergency_phone, :favorite_song, :favorite_food, :music_styles, :profession, :profession_activity_level, :sports, :birthday, :nationality, :height, :current_weight, :current_body_fat, :current_shapes, :target, :target_weight, :target_body_fat, :target_shapes, :waiver_signed, :waiver_signed_at)
      end
    end
  end
end
