class CustomTaxCodesController < ApplicationController
    before_action :set_custom_tax_code, only: [:show, :update, :destroy]
  
    def index
      tax_codes = CustomTaxCodeService.get_tax_codes
      render json: tax_codes
    end
  
    def show
      render json: @custom_tax_code
    end
  
    def create
      tax_code = CustomTaxCodeService.create_tax_code(custom_tax_code_params, @current_user)
      if tax_code.persisted?
        render json: tax_code, status: :created
      else
        render json: { errors: tax_code.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def update
      if CustomTaxCodeService.update_tax_code(@custom_tax_code.id, custom_tax_code_params, @current_user)
        render json: @custom_tax_code
      else
        render json: { errors: @custom_tax_code.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def destroy
      CustomTaxCodeService.delete_tax_code(@custom_tax_code.id)
      head :no_content
    end
  
    private
  
    def set_custom_tax_code
      @custom_tax_code = CustomTaxCodeService.find_tax_code(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "CustomTaxCode not found" }, status: :not_found
    end
  
    def custom_tax_code_params
      params.permit(:tax_code_type, :entity_id, :code, :description)
    end
  end
  