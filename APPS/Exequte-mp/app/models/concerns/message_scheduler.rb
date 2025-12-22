require 'sidekiq/api'
require_relative 'message_scheduler/wx_booking'
# module Concerns
module MessageScheduler
  extend ActiveSupport::Concern

  def self.included base
    case base.name
    when "Booking"
      base.send :include, WxBooking
    when "Chat"
      base.send :include, WxChat
    when "Review"
      base.send :include, WxReview
    when "User"
      base.send :include, WxUser
    when "MessageStatus"
      base.send :include, WxMessageStatus
    end
    super
  end

  # INSTANCE METHODS HERE
  def notify(tag)
    puts ("INSIDE NOTIFY (scheduler)")
    class_name = self.model_name.singular
    wx_notes = self.send("#{class_name}_#{tag}")
    wx_notes.each do |x|
      wx_params = self.send(x)
      next if wx_params.blank?
      next if schedule_exists?(x, wx_params.except(:deliver_at))


      timed = wx_params[:deliver_at]
      obj_hash = {id: self.id, model: self.model_name.name}

      if timed
        if Rails.env == "development"
          wx_params[:deliver_at] = Time.now + 1.minutes
        end
        WechatWorker.perform_at(wx_params[:deliver_at], x, obj_hash, wx_params)
      else
        WechatWorker.perform_async(x, obj_hash, wx_params)
      end
    end
    return true
  end

  def notify_new
    puts "INSIDE NOTIFY NEW"
    notify("new")
  end

  def notify_update
    notify("update")
  end

  def scheduled_set
    Sidekiq::ScheduledSet.new.entries.select do |x|
      obj = x.item["args"][1]
      obj["model"] == self.class.name && obj["id"] == self.id
    end
  end

  def queue_set
    Sidekiq::Queue.new.entries.select do |x|
      obj = x.item["args"][1]
      obj["model"] == self.class.name && obj["id"] == self.id
    end
  end

  def schedule_exists?(action, wx_params)
    entries =  Sidekiq::ScheduledSet.new.entries.select do |x|
      next if x.item["args"][2].nil?
      h = x.item["args"][2].except("deliver_at")
      h.symbolize_keys!
      wx_params.symbolize_keys!

      (x.item["args"][0] == action) && ( h == wx_params)
    end
    entries.length > 0
  end

  def scheduled_notifications
    entries = scheduled_set

    entries.map! do |x|
      note_params = x.item["args"][2]
      model_params = x.item["args"][1]
      action = x.item["args"][0]
      deliv_time = x.at.in_time_zone("Beijing")
      {delivery_time: deliv_time, notification_params: note_params,
       action: action, model_params: model_params}
    end
  end

  def queued_notifications
    entries = queue_set

    entries.map! do |x|
      note_params = x.item["args"][]
      {delivery_time: "Immediately", notification_params: note_params}
    end
  end

  class << self
    def all_scheduled_notifications
      entries = Sidekiq::ScheduledSet.new.entries.select do |x|
        obj = x.item["args"][1]
        obj["model"] == self.class.name
      end

      entries.map! do |x|
        note_params = x.item["args"][2]
        model_params = x.item["args"][1]
        action = x.item["args"][0]
        deliv_time = x.at.in_time_zone("Beijing")
        {delivery_time: deliv_time, notification_params: note_params,
         action: action, model_params: model_params}
      end
    end
  end
end
# end
