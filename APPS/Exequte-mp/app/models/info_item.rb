class InfoItem < ApplicationRecord
  PLACEMENTS = ['before_photo_1', 'after_photo_1', 'after_address', 'after_photo_2', 'after_instructors']
  ALIGNS = ['center', 'left', 'right', 'justify']
  TRANSFORMS = ['uppercase', 'lowercase', 'capitalize']
  before_save :set_position
  belongs_to :info
  belongs_to :info_item_pattern, optional: true
  # validates :placement, inclusion:{ in: PLACEMENTS }, allow_blank: true, allow_nil: trueq
  scope :placed, -> (placement) {where(placement: placement)}

  def standard_hash
    h = {}
    self.attributes.keys.each do |a|
      value = self.send :"#{a}"
      next if a.start_with?('cn_') || (value.respond_to?('empty?') && value.empty?)
      h[a] = localize(a) ? localize(a) : h[a] = value
    end
    h
  end

  private

  def set_position
    # sets the position to the last one if position is nil
    self.position = 1 if InfoItem.placed(placement).blank?
    self.position =  InfoItem.placed(placement).pluck(:position).max + 1 || 1  if position.blank?
  end
end
