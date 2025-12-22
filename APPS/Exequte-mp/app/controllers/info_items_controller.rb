class InfoItemsController < ApplicationController

  def new
    @info_item = InfoItem.new
  end

  def create
    @info_item = InfoItem.new(permitted_params)
    p @info_item
    update_from_pattern! if @info_item.info_item_pattern.present?
    p @info_item
    if @info_item.save
      redirect_to @info_item
    else
      render :new
    end
  end

  def show
    @info_item = InfoItem.find(params[:id])
  end

  private

  def update_from_pattern!
    @info_item_pattern = @info_item.info_item_pattern
    p @info_item_pattern
    @info_item.title ||= @info_item_pattern.title
    @info_item.italic ||= @info_item_pattern.italic
    @info_item.margin_bottom ||= @info_item_pattern.margin_bottom
    @info_item.margin_top ||= @info_item_pattern.margin_top
    @info_item.margin_left ||= @info_item_pattern.margin_left
    @info_item.font_size ||= @info_item_pattern.font_size
    @info_item.position ||= @info_item_pattern.position
    @info_item.placement = @info_item_pattern.placement if @info_item.placement.blank?
    @info_item.text_align = @info_item_pattern.text_align if @info_item.text_align.blank?
    @info_item.text_transform = @info_item_pattern.text_transform if @info_item.text_transform.blank?
  end

  def permitted_params
    params.require(:info_item).permit(:title, :item_text, :cn_item_text, :margin_bottom, :font_size, :placement, :position, :info_id, :info_item_pattern_id, :note, :margin_top, :margin_left, :text_align, :text_transform, :italic)
  end
end

#<InfoItemPattern id: 1, margin_bottom: 20, font_size: 28, placement: "after photo 1", position: nil, note: "Pattern for rules items", created_at: "2021-02-27 17:44:20", updated_at: "2021-02-27 17:44:20">
