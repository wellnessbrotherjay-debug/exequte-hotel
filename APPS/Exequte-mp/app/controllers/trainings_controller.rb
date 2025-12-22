class TrainingsController < ApplicationController
  def show
    @training = Training.find(params[:id])
    @training.reload_photo_blob
  end

  def new
    @training = Training.new
  end

  def create
    @training = Training.new(permited_params)
    if @training.save!
      redirect_to @training
    else
      render :new
    end
  end

  private

  def permited_params
    params.require(:training).permit(:name, :cn_name, :subtitle, :cn_subtitle, :description, :cn_description, :capacity, :duration, :calories, :class_type_id, :photo, :late_booking_minutes)
  end
end
