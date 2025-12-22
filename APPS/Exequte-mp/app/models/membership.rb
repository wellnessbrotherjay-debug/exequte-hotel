class Membership < ApplicationRecord
  include WxPayable
  validates :name, presence: true
  validates :cn_name, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  monetize :price_cents
  belongs_to :membership_type
  belongs_to :user
  has_many :bookings
  has_many :training_sessions, through: :bookings
  default_scope -> { where(destroyed_at: nil) }
  scope :settled, -> {where(payment_status: "paid")}
  scope :classpack, -> {where(is_class_pack: true)}
  scope :not_classpack, -> {where(is_class_pack: false)}
  scope :trial, -> {where(is_trial: true)}
  scope :not_trial, -> {where(is_trial: false)}
  scope :is_limited, -> {where(is_limited: true)}
  scope :is_not_limited, -> {where(is_limited: false)}


  def booking_hash
    h = standard_hash
    h[:start_date] = DateTimeService.date_d_m_y(start_date)
    h[:end_date] = DateTimeService.date_d_m_y(end_date)
    h
  end

  def booking_hash_limited(sessions_left)
    h = standard_hash
    h[:start_date] = DateTimeService.date_d_m_y(start_date)
    h[:end_date] = DateTimeService.date_d_m_y(end_date)
    h[:sessions_left] = sessions_left
    h
  end
  def standard_hash
    {
      id: id,
      name: localize_name,
      price: price.to_i,
      start_date: DateTimeService.date_m_d_y(start_date),
      start_date_locale: localize_start_date,
      end_date: DateTimeService.date_m_d_y(end_date),
      end_date_locale: localize_end_date,
      smoothie: smoothie,
      vouchers: vouchers,
      is_class_pack: is_class_pack,
      bookings_per_day: bookings_per_day ? bookings_per_day : -1,
      unlimited: unlimited?,
      is_trial: is_trial
    }
  end

  def settled?
    payment_status == "paid"
  end

  def change_end_date(days)
    self.end_date = self.end_date.ago(-days.days)
  end

  def use_voucher!
    self.vouchers -= 1
    save
  end

  def localize_start_date
    I18n.locale == :'zh-CN' ? DateTimeService.date_m_d_y_zh(start_date)  : DateTimeService.date_m_d_y(start_date)
  end

  def localize_end_date
    I18n.locale == :'zh-CN' ? DateTimeService.date_m_d_y_zh(end_date)  : DateTimeService.date_m_d_y(end_date)
  end
  def return_voucher!
    self.vouchers += 1
    save
  end

  def unlimited?
    if !bookings_per_day || bookings_per_day == -1
      return true
    else
      return false
    end
  end



  # def bookings_left?
  #   begin
  #     if self.unlimited?
  #       return -1
  #     else
  #       puts "=====user bookings======"
  #       if user.bookings && user.bookings.today
  #         puts "====#{user.bookings.today.size}===="
  #         puts "===== left : #{self.bookings_per_day - user.bookings.today.size} "
  #         return self.bookings_per_day - user.bookings.today.size
  #       else
  #         puts "===== no bookings today,can still book: #{self.bookings_per_day}"
  #         return self.bookings_per_day
  #       end
  #     end
  #   end
  # rescue => e
  #   puts "====something went wrong, return unlimited bookings"
  #   puts e
  #   return -1
  # end
end
