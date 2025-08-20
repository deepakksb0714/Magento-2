class CustomersController < ApplicationController
  before_action :combined_before_action, only: [:index, :show, :update, :create, :destroy]

  # GET /customers
  def index
    if @customers.present?
      render json: @customers, status: :ok
    else
      render json: { error: 'No customer found for the specified entity', customers: [] }, status: :not_found
    end
  end

  # GET /customers/1
  def show
    if @customer.entity_id != @entity_id
      render json: { error: 'No customer found for the specified entity', customers: [] }, status: :not_found
    else
      render json: @customer, status: :ok
    end
  end

  # POST /customers
  def create
    customer_data = customer_params.merge(entity_id: @entity_id)
    service = CustomerService.new(customer_data, @current_user, external_address_params, contact_params)
    result = service.create_customer_with_address_and_contact

    if result[:success]
      render json: result[:customer], status: :created
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /customers/1
  def update
    if @customer.entity_id != @entity_id
      render json: { error: 'No customer found for the specified entity' }, status: :not_found
      return
    end

    service = CustomerService.new(customer_params, @current_user, external_address_params, contact_params, tax_exemption_params)
    result = service.update_customer_with_address_and_contact(@customer)

    if result[:success]
      render json: result[:customer], status: :ok
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  # DELETE /customers/1
  def destroy
    if @customer.entity_id != @entity_id
      render json: { error: 'No customer found for the specified entity' }, status: :not_found
      return
    end

    begin
      # Remove associations first
      @customer.update!(
        address_id: nil,
        contact_id: nil
      )

      # Destroy associated records in separate transactions
      ActiveRecord::Base.transaction do
        @customer.external_address&.destroy
        @customer.contact&.destroy
        @customer.tax_exemption&.destroy
      end

      # Destroy the customer record
      @customer.destroy!

      render json: { error: 'Customer deleted successfully' }, status: :ok
    rescue ActiveRecord::RecordNotDestroyed => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def combined_before_action
    set_customer if action_name.in?(%w[show update destroy])
    filter_customers_by_entity if action_name.in?(%w[index show update create])
  end

  # Set the customer based on ID
  def set_customer
    @customer = Customer.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Customer not found' }, status: :not_found
  end

  # Filter customers based on the entity ID
  def filter_customers_by_entity
    @customers = Customer.where(entity_id: @entity_id)
  rescue ActiveRecord::RecordNotFound
    @customers = []
  end

 # Strong parameters for customers
 def customer_params
  params.require(:customer).permit(
    :entity_id, :customer_name, :customer_code, :taxpayer_id, :alternate_id,
    :customer_labels, :tax_regions
  )
 end

 def contact_params
  params[:customer].require(:contact).permit(:name, :email, :phone, :fax_number)
 end

 def external_address_params
  params[:customer].require(:external_address).permit(:address_line1, :address_line2, :city, :region, :zip_code, :country)
 end

end
