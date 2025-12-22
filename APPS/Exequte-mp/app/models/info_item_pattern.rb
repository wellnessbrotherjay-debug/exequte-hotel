class InfoItemPattern < ApplicationRecord
  has_many :info_items
  # validates :placement, inclusion:{ in: InfoItem::PLACEMENTS }, allow_blank: true, allow_nil: true
  def full_name
    note
  end
end
