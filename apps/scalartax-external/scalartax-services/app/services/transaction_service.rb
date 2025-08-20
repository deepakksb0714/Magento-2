class TransactionService
  class TransactionError < StandardError; end

  def initialize(params, items_tax_data, current_user, transaction = nil)
    @params = params || {}
    @items_tax_data = items_tax_data || {}
    @current_user = current_user
    @items = params&.fetch(:lineItems, [])
    @transaction = transaction
  end

  def process
    ActiveRecord::Base.transaction do
      # Create the main transaction
      transaction = save_transaction
  
      return { error: "Failed to create transaction", status: :unprocessable_entity } unless transaction
  
      # Create line items
      save_line_items(transaction)
      
      # If we get here, everything succeeded
      Rails.logger.info("Transaction processed successfully")
      { response: transaction }
    end
  rescue ActiveRecord::RecordInvalid => e
    { error: e.record.errors.full_messages.join(', '), status: :unprocessable_entity }
  rescue TransactionError => e
    Rails.logger.error("Transaction processing failed: #{e.message}")
    { error: e.message, status: :internal_server_error }
  rescue StandardError => e
    Rails.logger.error("Unexpected error in transaction processing: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    { error: "Transaction failed: #{e.message}", status: :internal_server_error }
  end  

  def update
    ActiveRecord::Base.transaction do
      # Update the main transaction
      update_transaction

      # Update or create line items
      update_line_items

      Rails.logger.info("Transaction updated successfully")
      { response: @transaction, status: :ok }
    end
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error("Validation error occurred: #{e.message}")
    Rails.logger.error("Validation errors: #{e.record.errors.full_messages}")
    { error: "Validation failed: #{e.record.errors.full_messages.join(', ')}", status: :unprocessable_entity }
  rescue TransactionError => e
    Rails.logger.error("Transaction update failed: #{e.message}")
    { error: e.message, status: :unprocessable_entity }
  rescue StandardError => e
    Rails.logger.error("Unexpected error in transaction update: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    { error: "Transaction update failed: #{e.message}", status: :internal_server_error }
  end

  private

  def save_transaction
    # Create addresses first to ensure they exist
    origin_address_id = create_address(@params.dig(:address, 'Ship From'))
    destination_address_id = create_address(@params.dig(:address, 'Ship To'))
    transaction_params = build_transaction_params(origin_address_id, destination_address_id)
    Transaction.create!(transaction_params)
    
  end

  def save_line_items(transaction)
    @items.each_with_index do |item, index|
      
        # Create addresses for line item
        origin_address_id = create_address(item.dig(:address, 'Ship From'))
        destination_address_id = create_address(item.dig(:address, 'Ship To'))

        # Fetch the corresponding tax data for the current line item
        item_tax_data = @items_tax_data[:overall_tax_breakdown][index]
        tax_amount = item_tax_data[:tax_breakdown].first[:tax_amount]

        # Build line item parameters including the tax data
        line_item_params = build_line_item_params(
          transaction,
          item,
          index,
          origin_address_id,
          destination_address_id,
          item_tax_data # Pass the item_tax_data to the method
        )

        # Create the line item record
        line_item = LineItem.create!(line_item_params)
        Rails.logger.info("Created line item for transaction #{transaction.id}")
    rescue StandardError => e
        Rails.logger.error("Error creating line item  #{e.message}")
        raise TransactionError, "Failed to create line item  #{e.message}"
      
    end
  end

  def create_address(address_params)
    return nil if address_params.blank?

    additional_addresses = address_params.dig("additionalAddresses") || []
    address_lines = additional_addresses.map { |addr| addr["addr"] }.compact
    address = InternalAddress.create!(
      address_line1: address_params[:address] || address_params[:address_line1] || address_lines[0],
      address_line2: address_params[:address_line2] || address_lines[1],
      address_line3: address_params[:address_line3] || address_lines[2],
      city: address_params[:city],
      region: address_params[:region],
      country: address_params[:country],
      postal_code: address_params[:postal_code]
    )

    Rails.logger.info("Created address with ID: #{address.id}")
    address.id
  rescue StandardError => e
    Rails.logger.error("Error creating address: #{e.message}")
    raise TransactionError, "Failed to create address: #{e.message}"
  end

  def build_transaction_params(origin_address_id, destination_address_id)
    {
      parent_transaction_id: @params[:parent_transaction_id],
      product_id: @params[:product_id],
      account_id: @params[:account_id],
      entity_id: @params[:entity_id],
      customer_id: @params[:customer_code],
      certificate_id: @params[:certificate_id],
      has_nexus: @items_tax_data&.fetch(:has_nexus, false),
      origin_address_id: origin_address_id,
      destination_address_id: destination_address_id,
      code: @params[:code],
      transaction_type: @params[:type],
      currency_code: @params[:currency_code] || 'USD',
      date: parse_date(@params[:date]),
      status: @params[:Status] || 'Pending',
      vendor_code: @params[:vendor_code],
      exchange_rate_currency_code: @params[:exchange_rate_currency_code],
      location_code: @params[:location_code],
      entity_use_code: @params[:entity_use_code],
      exempt_no: @params[:exempt_no],
      customer_vat_number: @params[:customer_vat_number],
      customer_vendor_code: @params[:customer_vendor_code],
      vendor_vat_number: @params[:vendor_vat_number],
      purchase_order: @params[:purchase_order],
      reference_code: @params[:reference_code],
      description: @params[:description],
      reconciled: @params[:reconciled] || 'No',
      sales_person_code: @params[:sales_person_code],
      tax_override_type: @params[:tax_override_type],
      tax_override_amount: (@params[:tax_override_amount].presence || 0).to_d,
      tax_override_reason: @params[:tax_override_reason],
      total_amount: @items_tax_data&.fetch(:total_amount, ''),
      total_discount: @params[:total_discount],
      total_tax: @items_tax_data&.fetch(:total_tax_amount, ''),
      total_exempt: @items_tax_data&.fetch(:total_exempt_amount, '') || 0,
      total_taxable: @items_tax_data&.fetch(:total_taxable_amount) || 0,
      total_tax_calculated: @items_tax_data&.fetch(:total_tax_amount, ''),
      adjustment_reason: @params[:adjustment_reason] || 'Not Adjusted',
      adjustment_description: @params[:adjustment_description] || 'Not Adjusted',
      locked: @params[:locked] || false,
      region: @params.dig(:address, 'Ship To', :region),
      country: @params.dig(:address, 'Ship To', :country),
      version: @params[:version] || '0',
      exchange_rate_effective_date: @params[:exchange_rate_effective_date] || '',
      exchange_rate: @params[:exchange_rate] || 1,
      is_seller_importer_of_record: @params[:is_seller_importer_of_record] || false,
      tax_date: parse_date(@params[:tax_date]),
      created_by_id: @current_user&.id,
      updated_by_id: @current_user&.id
    }
  end

  def build_line_item_params(transaction, item, index, origin_address_id, destination_address_id, item_tax_data)
    {
      transaction_id: transaction.id,
      line_number: item[:line_number],
      item_code: item[:item_code],
      description: item[:description],
      line_amount: item[:line_amount],
      quantity: item[:quantity],
      tax_override_amount: item[:tax_override_amount].to_d,
      tax_date: parse_date(@params[:tax_date]),
      tax_override_reason: item[:tax_override_reason],
      tax_included: item[:tax_included],
      discount_amount: item_tax_data.dig(:item_discount) || 0,
      tax: item_tax_data[:tax_breakdown].first[:tax_amount] || 0,
      tax_calculated: item_tax_data[:tax_breakdown].first[:tax_amount] || 0,
      taxable_amount: item_tax_data[:tax_breakdown].first[:taxable_amount] || 0,
      exempt_amount: item_tax_data[:tax_breakdown].first[:exempt_amount] || 0,
      ref1: item[:ref1],
      ref2: item[:ref2],
      rev_account: item[:rev_account],
      tax_code: item[:tax_code],
      traffic_code: item[:traffic_code],
      entity_use_code: item[:entity_use_code],
      exempt_no: item[:exempt_no],
      customer_vat_number: item[:customer_vat_number],
      origin_address_id: origin_address_id || transaction.origin_address_id,
      destination_address_id: destination_address_id || transaction.destination_address_id,
      is_item_taxable: true
    }
  end

  def update_transaction
    origin_address_id = create_or_update_address(@params.dig(:address, 'Ship From'), @transaction&.origin_address_id)
    destination_address_id = create_or_update_address(@params.dig(:address, 'Ship To'), @transaction&.destination_address_id)

    transaction_params = build_transaction_params(origin_address_id, destination_address_id)
    Rails.logger.info "transaction_params------ #{transaction_params}"
    Rails.logger.info "transaction_params------ #{@transaction}"
    # Update the transaction record
    @transaction.update!(transaction_params)
    Rails.logger.info("Transaction updated with ID: #{@transaction.id}")
  end

  def update_line_items
    Rails.logger.info("Starting line items update for transaction #{@transaction.id}")

    # Index existing line items by line_number for quick lookup
    existing_line_items = @transaction.line_items.index_by(&:line_number)
    Rails.logger.info("Starting line items update for transaction #{existing_line_items}")
    @items.each_with_index do |item, index|
      
        # Get addresses
        existing_line_item = existing_line_items[item[:line_number]]
        Rails.logger.info("Processing line_number #{item[:line_number]}: #{existing_line_item.inspect}")

        # Get or create origin and destination addresses
        origin_address_id = create_or_update_address(
          item.dig(:address, 'Ship From'),
          existing_line_item&.origin_address_id
        )
        destination_address_id = create_or_update_address(
          item.dig(:address, 'Ship To'),
          existing_line_item&.destination_address_id
        )
        # if origin_address_id.nil? || destination_address_id.nil?
        #   Rails.logger.info("Skipping line_number #{item[:line_number]} in transaction #{@transaction.id} due to missing address ID")
        #   next # Skip to the next item
        # end
        # Get tax data for the current item
        item_tax_data = @items_tax_data[:overall_tax_breakdown][index]

        # Build parameters for the line item
        line_item_params = build_line_item_params(
          @transaction,
          item,
          index,
          origin_address_id,
          destination_address_id,
          item_tax_data
        )

        # Check if the item already exists based on line_number
        line_number = item[:line_number]
        if existing_line_items[line_number].present?
          # Update the existing line item
          existing_line_items[line_number].update!(line_item_params)
          Rails.logger.info("Updated line item for line_number #{line_number} in transaction #{@transaction.id}")
        else
          # Create a new line item
          LineItem.create!(line_item_params)
          Rails.logger.info("Created new line item for line_number #{line_number} in transaction #{@transaction.id}")
        end
    rescue StandardError => e
        Rails.logger.error("Error updating line item for line_number #{item[:line_number]}: #{e.message}")
        raise TransactionError, "Failed to update line item for line_number #{item[:line_number]}: #{e.message}"
      
    end

    # Optionally, remove line items that are no longer present in @items
    existing_line_number = @items.map { |item| item[:line_number] }
    existing_line_items.each do |line_number, line_item|
      unless existing_line_number.include?(line_number)
        line_item.destroy
        Rails.logger.info("Removed line item with line_number #{line_number} from transaction #{@transaction.id}")
      end
    end
  end

  def create_or_update_address(address_params, existing_address_id = nil)
    return nil if address_params.blank?

    if existing_address_id
      address = InternalAddress.find(existing_address_id)
      additional_addresses = address_params.dig("additionalAddresses") || []
      address_lines = additional_addresses.map { |addr| addr["addr"] }.compact
      address.update!(
        address_line1: address_params[:address] || address_params[:address_line1] || address_lines[0],
        address_line2: address_params[:address2] || address_params[:address_line2] || address_lines[1],
        address_line3: address_params[:address3] || address_params[:address_line3] || address_lines[2],
        city: address_params[:city],
        region: address_params[:region],
        country: address_params[:country],
        postal_code: address_params[:postal_code]
      )
      address.id
    else
      create_address(address_params)
    end
  rescue StandardError => e
    Rails.logger.error("Error updating address: #{e.message}")
    raise TransactionError, "Failed to update address: #{e.message}"
  end

  def parse_date(tax_date)
    return Time.current unless tax_date.present?

    Date.parse(tax_date)
  rescue ArgumentError => e
    Rails.logger.error("Invalid tax date format: #{e.message}")
    Time.current
  end
end
