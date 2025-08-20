class TransactionsController < ApplicationController
  before_action :set_transaction, only: [:show, :update]

  # POST /transactions
  def create
    service = CalculateTaxService.new(params, @entity_id)
    items_tax_data = service.calculate
  
    if items_tax_data[:error]
      render json: { error: items_tax_data[:error] }, status: items_tax_data[:status]
      return
    end
  
    begin
      result = TransactionService.new(params, items_tax_data, @current_user, nil).process
      if result[:error]
        render json: { error: result[:error] }, status: result[:status]
      else
        render json: result[:response]
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.record.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end  

  # PATCH /transactions/:id
  def update
    # calculate taxes for updated items
    service = CalculateTaxService.new(params, @entity_id)
    items_tax_data = service.calculate
    # Update the transaction and associated records
    result = TransactionService.new(params, items_tax_data, @current_user, @transaction).update

    if result[:error]
      render json: { error: result[:error] }, status: result[:status]
    else
      render json: result[:response]
    end
  end

  # POST /transactions/import
  def import
    puts "params #{params}"
    transactions_params = params["_json"] # Expecting an array of transactions data
    results = ImportTransactionsService.new(transactions_params, @current_user, @entity_id).process_batch

    if results[:errors].present?
      render json: { errors: results[:errors] }, status: :unprocessable_entity
    else
      render json: { message: 'Transactions imported successfully', data: results[:data] }, status: :ok
    end
  end

  # GET /transactions/:id
  def show
    transaction = Transaction.includes(
      :origin_address,
      :destination_address,
      line_items: [:origin_address, :destination_address]
    ).find(params[:id])

    transformed_transaction = transaction.as_json(include: {
                                                    origin_address: {},
                                                    destination_address: {},
                                                    line_items: {}
                                                  }).tap do |json|
      json["line_items"] = transaction.line_items.map do |item|
        item.as_json.except("origin_address", "destination_address").merge(
          "address" => {
            "Ship From" => format_address(item.origin_address),
            "Ship To" => format_address(item.destination_address)
          }
        )
      end
    end

    render json: transformed_transaction
  end

  # GET /transactions
  def index
    transactions = Transaction.includes(
      :origin_address,
      :destination_address,
      line_items: [:origin_address, :destination_address]
    ).where(entity_id: @entity_id)

    transformed_transactions = transactions.map do |transaction|
      transaction.as_json(include: {
                            origin_address: {},
                            destination_address: {},
                            line_items: {}
                          }).tap do |json|
        json["line_items"] = transaction.line_items.map do |item|
          item.as_json.except("origin_address", "destination_address").merge(
            "address" => {
              "Ship From" => format_address(item.origin_address),
              "Ship To" => format_address(item.destination_address)
            }
          )
        end
      end
    end

    render json: transformed_transactions
  end

  private

  def transaction_params
     params.require(:transaction).permit(:code, :type, :date, :customer_code, :vendor_code, :entity_id, :total_discount, :location_code, :entity_use_code, :exempt_no, :customer_vat_number, :vendor_vat_number, :description, :status, address_attributes: [:address, :address2, :address3, :city, :region, :country, :postal_code], line_items_attributes: [:item_code, :description, :line_amount, :quantity, :tax_override_amount, :tax_date, :tax_override_reason, :tax_included, :tax_code, :traffic_code])
  end

  def format_address(address)
    return {} unless address

    {
      "address_line1" => address.address_line1,
      "address_line2" => address.address_line2,
      "address_line3" => address.address_line3,
      "city" => address.city,
      "region" => address.region,
      "country" => address.country,
      "postal_code" => address.postal_code,
      "id" => address.id,
      "created_at" => address.postal_code,
      "updated_at" => address.postal_code
    }
  end

  def set_transaction
    @transaction = Transaction.find_by(id: params[:id], entity_id: @entity_id)
    Rails.logger.info("Transaction--------------: #{@transaction.inspect}")
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Transaction not found' }, status: :not_found
  end
end
