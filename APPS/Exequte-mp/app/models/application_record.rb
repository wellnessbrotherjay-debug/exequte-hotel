class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  # +1 so that when it is created it is already 1 day old because you can use it on the day of creation
  def days_since_created
    (DateTime.now.midnight - created_at_mndt).to_i + 1
  end

  def localize_name
    return unless name && cn_name

    I18n.locale == :'zh-CN' ? cn_name : name
  end

  def created_at_mndt
    created_at.midnight.to_datetime
  end

  def localize(attr)
    return unless self.attributes.keys.include?(attr) && self.attributes.keys.include?('cn_' + attr)

    localized = self.send :"#{I18n.locale == :'zh-CN' ? 'cn_' + attr : attr}"
    localized unless localized == ""
  end
end
