class Info < ApplicationRecord
  has_many :info_items, dependent: :destroy
  has_one_attached :photo_1
  has_one_attached :photo_2
  default_scope -> { where(destroyed_at: nil) }
  scope :terms, -> { where(terms: true) }
  scope :regular, -> { where(terms: false) }


  def localize(attr)
    return unless self.attributes.keys.include?(attr) && self.attributes.keys.include?('cn_' + attr)

    localized = self.send :"#{I18n.locale == :'zh-CN' ? 'cn_' + attr : attr}"
    localized unless localized == ""
  end

  def standard_hash
    h = {}
    self.attributes.keys.each do |a|
      value = self.send :"#{a}"
      next if a.start_with?('cn_') || (value.respond_to?('empty?') && value.empty?)
      h[a] = localize(a) ? localize(a) : h[a] = value
    end
    h[:image_url_1] = photo_1.service_url if photo_1.attached?
    h[:image_url_2] = photo_2.service_url if photo_2.attached?
    if info_items.present?

      h[:items] = {}
      InfoItem::PLACEMENTS.each { |x| h[:items][x] = info_items.placed(x).order(:position, created_at: :asc).map(&:standard_hash) }

    end
    h[:has_items] = info_items.present?
    h
  end



  def full_name
    title_one
  end
end
