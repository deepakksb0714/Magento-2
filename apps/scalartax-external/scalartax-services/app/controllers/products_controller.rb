class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]
  before_action :filter_products_by_entity, only: [:index, :show, :update]

  # GET /products
    def index
      if @products.present?
         render json: @products.to_json(include: :product_attributes)
      else
         render json: [], status: :ok
      end
    end

  # GET /products/1
  def show
    if @product.entity_id != @entity_id
      render json: { message: 'No products found for the specified entity' }, status: :not_found
    else
      render json: @product.to_json(include: :product_attributes)
    end
  end

  # POST /products
  def create
    products_params = params.require(:products).map do |product|
      product.permit(:product_code, :product_group, :category, :description, :tax_code, :entity_id, product_attributes: [:attribute_name, :attribute_value, :attribute_unit_of_measure])
    end

    # Ensure all products have the correct entity_id
    products_params.each do |product|
      product[:entity_id] = @entity_id
    end

    created_products = ProductService.create_products_with_attributes(products_params, @current_user)

    if created_products.present?
      render json: { message: 'Products created successfully', products: created_products }, status: :created
    else
      render json: { errors: 'Failed to create products' }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /products/1
  def update
    if @product.entity_id != @entity_id
      render json: { message: 'No products found for the specified entity' }, status: :not_found
      return
    end

    product_params = params.require(:product).require(:products).first.permit(
      :product_code, :product_group, :category, :description, :tax_code, :entity_id,
      product_attributes: [:attribute_name, :attribute_value, :attribute_unit_of_measure]
    )

    updated_product = ProductService.update_product_with_attributes(@product, product_params, @current_user)

    if updated_product
      render json: updated_product.to_json(include: :product_attributes)
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /products/1
  def destroy
    if @product.entity_id != @entity_id
      render json: { message: 'No products found for the specified entity' }, status: :not_found
      return
    end

    if @product.destroy
      render json: { message: 'Product deleted successfully' }, status: :ok
    else
      render json: { errors: 'Failed to delete product' }, status: :unprocessable_entity
    end
  end

  private

  def set_product
    @product = Product.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Product not found' }, status: :not_found
  end

  def filter_products_by_entity
    @products = Product.includes(:product_attributes).where(entity_id: @entity_id)
  rescue ActiveRecord::RecordNotFound
    @products = []
  end
end
