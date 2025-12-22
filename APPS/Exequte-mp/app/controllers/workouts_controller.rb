# frozen_string_literal: true

class WorkoutsController < ApplicationController

  def new
    @workout = Workout.new
  end

end

