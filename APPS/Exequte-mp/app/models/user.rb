class User < ApplicationRecord
  include MessageScheduler
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable
  DAYS_TO_CALC_AVERAGE = 7
  DEFAULT_NAME = "#{Rails.application.class.module_parent} User".freeze
  ACTIVITY_LEVELS = [nil, '', 'No activity (0x weekly)', 'Light (1-2x weekly)', 'Moderate (2-3x weekly)', 'High (4-5x weekly)', 'Extreme (5+ weekly)'].freeze
  GENDERS = [nil, '', 'Male', 'Female', 'Trans / Non-binary / Other', 'Prefer not to disclose']
  TARGETS = [nil, "", "lose", "gain", "maintain"].freeze
  validates :profession_activity_level, inclusion: { in: ACTIVITY_LEVELS }
  validates :target, inclusion: { in: TARGETS}
  validates :voucher_count , numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  serialize :wx_info, Hash
  serialize :oa_info, Hash
  # Assosiations
  has_many :bookings, dependent: :destroy
  has_many :training_sessions, through: :bookings
  has_many :training_sessions_as_instructor, class_name: "TrainingSession"
  has_many :memberships, dependent: :destroy
  has_many :user_coupons, dependent: :destroy
  has_many :coupons, through: :user_coupons

  has_one_attached :instructor_photo
  has_one_attached :avatar
  before_validation :set_defaults
  default_scope do
    begin
      if connection.schema_cache.data_source_exists?(table_name)
        where(destroyed_at: nil)
      else
        all
      end
    rescue ActiveRecord::StatementInvalid, ActiveRecord::NoDatabaseError, PG::UndefinedTable
      all
    end
  end
  scope :order_by_name, -> { order('first_name ASC')}


  def token
    TokenService.encode('user' => id)
  end

  def info_hash
    standard_hash
  end

  def index_hash
    h = standard_hash
    # Add new attributes here as shown below:
    # h[:images] = images
    return h
  end

  def show_hash
    h = standard_hash
    h[:workout_name] = workout_name
    h[:emergency_name] = emergency_name
    h[:emergency_phone] = emergency_phone
    h[:birthday] = birthday
    h[:nationality] = nationality
    h[:profession] = profession
    h[:profession_activity_level] = profession_activity_level
    h[:favorite_song] = favorite_song
    h[:music_styles] = music_styles
    h[:sports] = sports
    h[:favorite_food] = favorite_food
    h[:instructor] = instructor
    h[:instructor_bio] = instructor_bio
    h[:height] = height
    h[:current_weight] = current_weight
    h[:current_body_fat] = current_body_fat
    h[:current_shapes] = current_shapes
    h[:target] = target
    h[:target_weight] = target_weight
    h[:target_body_fat] = target_body_fat
    h[:target_shapes] = target_shapes
    h[:recommended_bmr] = recommended_bmr
    h[:recommended_kcals] = recommended_kcals
    h[:carb_prot_fat] = carb_prot_fat
    h[:average_attendence] = average_attendence
    h[:attended_classes] = attended_classes
    h[:memberships] = valid_memberships.map(&:standard_hash)
    h[:avatar_url] = avatar.service_url if avatar.attached?
    h[:has_body_data] = has_body_data?
    h[:waiver_signed] = waiver_signed
    h[:waiver_signed_at] = waiver_signed_at
    h
  end

  def instructor_hash
    h = {
      first_name: first_name,
      last_name: last_name,
      bio: localize_instructor_bio
    }
    h[:image_url] = instructor_photo.service_url if instructor_photo.attached?
    h
  end

  def standard_hash
    {
      id: id,
      name: name,
      first_name: first_name,
      last_name: last_name,
      city: city,
      wechat: wechat,
      phone: phone,
      mp_email: mp_email,
      gender: gender,
      admin: admin,
      voucher_count: voucher_count,
      union_id: union_id,
      profile_filled: first_name.present?,
      has_wx_info: wx_info.present?,
      waiver_signed: waiver_signed,
      waiver_signed_at: waiver_signed_at
    }
  end

  def recommended_bmr; end

  def recommended_kcals; end

  def carb_prot_fat; end

  def attended_classes
    bookings.attended.size
  end

  def valid_memberships
    memberships.settled.where('end_date >= ? AND is_class_pack = false OR end_date >= ? AND is_class_pack = true AND vouchers > 0', DateTime.now.midnight, DateTime.now.midnight)
  end

  def prices
    {
      1 => 'price_1_cents',
      2 => calc_standard_price,
      3 => 'price_1_cents'
    }
  end

  def use_voucher!
    self.voucher_count -= 1
    save
  end

  def return_voucher!
    self.voucher_count += 1
    save
  end

  def localize_instructor_bio
    I18n.locale == :'zh-CN' ? cn_instructor_bio : instructor_bio
  end

  def full_name
    "#{first_name} #{last_name}"
  end


  def attach_avatar_from_url(url)
    avatar.attach({ io: FileDownloaderService.download(url), filename: FileDownloaderService.filename })
  end

  def self.notify_all!(banner)
    puts "INSIDE NOTIFY ALL"
    # User.where(admin: true).each do |u| # TEST MODE
    User.all.each do |u|
      obj_hash  = {id: u.id, model: u.model_name.name}
      wx_params = u.new_banner(banner)
      WechatWorker.perform_async('new_banner', obj_hash, wx_params)
    end
  end

  def bookings_today?
    self.bookings.today ? self.bookings.today.size : 0
  end

  def bookings_date?(date)
    time_range = date == DateTime.now.midnight ? Time.now..date.end_of_day : date.beginning_of_day..date.end_of_day
    puts "=====time_range:#{time_range}"
    bookings_of_date = self.bookings.with_ts.settled.active.references(:training_sessions)
                           .where('training_sessions.begins_at >= ? and training_sessions.begins_at <= ?', date.beginning_of_day, date.end_of_day)
    if bookings_of_date
      puts "======#{bookings_of_date}====="
      puts "=====how many bookngs for #{date}"
      puts "=====size: #{bookings_of_date.size}"
      return bookings_of_date.size
    else
      puts "no active bookings for selected date"
      return 0
    end
  end

  private

  def calc_standard_price
    return 'price_1_cents' if average_attendence <= 1

    return "price_#{average_attendence}_cents" if (2..6).include?(average_attendence)

    'price_7_cents'
  end

  def average_attendence

    days_to_count = days_since_created < DAYS_TO_CALC_AVERAGE ? days_since_created : DAYS_TO_CALC_AVERAGE
    attended = self.bookings.with_ts.attended

    return 0 if attended.blank?

    range = days_to_count.days.ago..DateTime.now.midnight
    count = attended.where(training_sessions: {begins_at: range}).count

    (count.fdiv(days_to_count) * 7).to_i
  end

  def has_body_data?
    profession_activity_level.present? && height.present? && current_weight.present? && target_weight.present? && current_body_fat.present? && target_body_fat.present?
  end

  def set_defaults
    self.name = DEFAULT_NAME if self.name.blank?
  end

  def age
    return nil if birthday.nil? # Return nil if there's no birthdate
    birthdate = birthday.to_date
    current_date = Date.today
    age = current_date.year - birthdate.year
    if current_date.month < birthdate.month || (current_date.month == birthdate.month && current_date.day < birthdate.day)
      age -= 1
    end
    age
  end

end
