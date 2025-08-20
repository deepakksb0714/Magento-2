class ProductAttributesController < ApplicationController
    before_action :set_product_attribute, only: %i[show update destroy]
  
    def index
      @product_attributes = ProductAttribute.all
      render json: @product_attributes
    end
  
    def show
      render json: @product_attribute
    end
  
    def create
      product_id = params[:product_attributes].first[:product_id]
  
      # Process each attribute and pass the product_id
      product_attributes_params[:product_attributes].each do |attr_params|
        ProductAttributeService.create_product_attribute(attr_params, product_id, @current_user.id)
      end
  
      render json: { message: 'Product attributes created successfully' }, status: :created
    end
  
    def update
      if ProductAttributeService.update_product_attribute(@product_attribute, product_attribute_params, @current_user.id)
        render json: @product_attribute
      else
        render json: @product_attribute.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      if @product_attribute.destroy
        head :no_content
      else
        render json: @product_attribute.errors, status: :unprocessable_entity
      end
    end
  
    private
  
    def set_product_attribute
      @product_attribute = ProductAttribute.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'ProductAttribute not found' }, status: :not_found
    end
  
    def product_attributes_params
      # Permit the parameters for product_attributes
      params.permit(product_attributes: [:product_id, :attribute_name, :attribute_value, :attribute_unit_of_measure])
    end
  
    def product_attribute_params
      # Permit parameters for a single product_attribute
      params.require(:product_attribute).permit(:attribute_name, :attribute_value, :attribute_unit_of_measure)
    end
  end
  