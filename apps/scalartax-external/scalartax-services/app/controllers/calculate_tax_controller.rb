class CalculateTaxController < ApplicationController
    def calculate
      service = CalculateTaxService.new(params, @entity_id)
      result = service.calculate
  
      if result[:error]
        render json: { errors: result[:error] }, status: result[:status]
      else
        render json: result
      end
    end
  end
  