class ImportTransactionsService
    class ImportError < StandardError; end
    
    def initialize(transactions_params, current_user, entity_id)
      @transactions_params = transactions_params
      @current_user = current_user
      @errors = []
      @successful_transactions = []
      @entity_id = entity_id
      first_object = @transactions_params[0]

      # Ensure the parameters are permitted before accessing
      first_object.permit!
      
      origin_location_code = first_object["originLocationCode"]
      destination_location_code = first_object["destinationLocationCode"]
      
      
      # Fetching the locations from the database
      @origin_location = Location.find_by(id: origin_location_code)&.as_json&.deep_symbolize_keys if origin_location_code.present?
      
      return unless destination_location_code.present?

      @destination_location = Location.find_by(id: destination_location_code)&.as_json&.deep_symbolize_keys
      
    end
    
    def process_batch
      # location_code = @transactions_params.f
      ActiveRecord::Base.transaction do
        @transactions_params.each_with_index do |raw_data, index|
          
            # Map the incoming data to your custom format
            transaction_data = map_transaction_data(raw_data)
            
            Rails.logger.info("Mapped Data: #{transaction_data}")
            items = transaction_data[:lineItems] 
            discount = transaction_data[:total_discount]
            customer_code = transaction_data[:customer_code]
            global_address = transaction_data[:address]
            global_address2 = transaction_data[:address2]
            global_override_tax = ''
            tax_service = CalculateTaxService.new(transaction_data, @entity_id)
            items_tax_data = tax_service.calculate
            if items_tax_data[:error]
              
              Rails.logger.error("Error calculating tax: #{items_tax_data[:error]}")
              
              return
            end
            # Use the existing TransactionService to create the transaction
            result = TransactionService.new(transaction_data, items_tax_data, @current_user).process
            
            if result[:response]
              @successful_transactions << result[:response]
            else
              @errors << { index:, error: result[:error] }
            end
        rescue StandardError => e
            Rails.logger.error("Failed to process transaction at index #{index}: #{e.message}")
            @errors << { index:, error: e.message }
          
        end
        
        raise ActiveRecord::Rollback if @errors.present?
      end
      
      {
        data: @successful_transactions,
        errors: @errors
      }
    end
    
    private
    
    def map_transaction_data(raw_data)
      # Initialize Ship From and Ship To addresses by formatting raw data
      origin_address = format_address(raw_data[:originAddress])
      destination_address = format_address(raw_data[:destinationAddress])
    
      # Check if both origin and destination addresses are nil or empty
      if origin_address.nil? || origin_address.empty? || destination_address.nil? || destination_address.empty?
        # If so, use the location-based addresses
        origin_address = format_address(@origin_location)
        destination_address = format_address(@destination_location)
      end
      entity_id = Entity.find_by(name: raw_data[:entityCode])&.id
      customer_id = Customer.find_by(customer_code: raw_data[:"customer code"])&.id
      certificate_id = ExemptionCertificate.find_by(code: raw_data[:"certificate code"], customer_id:)&.id

      {
        type: raw_data[:type],
        process_code: raw_data[:processCode],
        code: raw_data[:"document code"],
        date: convert_excel_date(raw_data[:date]),
        customer_id:,
        certificate_id:,
        vendor_code: raw_data[:"vendor code"],
        address: {
          "Ship From" => origin_address,
          "Ship To" => destination_address,
          "origin_coordinates" => raw_data[:originCoordinates],
          "destination_coordinates" => raw_data[:destinationCoordinates]
        },
        lineItems: [
          {
            item_code: raw_data[:"Line item code"] || raw_data[:"item code"],
            line_number: raw_data[:"line number"],
            line_amount: raw_data[:"line amount"] || raw_data[:"Line tax amount by types"],
            quantity: raw_data[:"Line quantity"] || raw_data[:quantity] || 1,
            tax_override_amount: raw_data[:"Line tax override tax amount"],
            tax_date: convert_excel_date(raw_data[:"Line tax override tax date"]),
            tax_override_reason: raw_data[:"Line tax override reason"],
            tax_included: raw_data[:"Line tax included"],
            tax_code: raw_data[:"Line tax code"],
            rev_account: raw_data[:"Line revenue account"],
            ref1: raw_data[:"Line ref1"],
            ref2: raw_data[:"Line ref2"],
            entity_use_code: raw_data[:"Entity use code"],
            exempt_no: raw_data[:"Line exemption code"],
            description: raw_data[:"Line description"]
          }
        ],
        entity_id:,
        total_discount: raw_data[:"Document discount"],
        location_code: raw_data[:"location code"],
        entity_use_code: raw_data[:"Entity use code"],
        exempt_no: raw_data[:"Exemption number"],
        description: raw_data[:"Document description"],
        sales_person_code: raw_data[:"Salesperson code"],
        reference_code: raw_data[:"Reference code"],
        purchase_order: raw_data[:"Purchase order number"],
        currency_code: raw_data[:"Document currency code"],
        exchange_rate_effective_date: convert_excel_date(raw_data[:"Document exchange rate effective date"]),
        exchange_rate: raw_data[:"Document exchange rate"],
        exchange_rate_currency_code: raw_data[:"Document exchange rate currency code"]
      }
    end           
    
    def format_address(address)
      # Return nil if the address is nil or empty
      return nil if address.nil? || address.empty?
      
      # Otherwise, return the formatted address
      {
        country: address[:country],
        address_line1: address[:AddressLine1]&.strip || address[:line1]&.strip,
        address_line2: address[:addressLine2]&.strip || address[:line2]&.strip,
        address_line3: address[:addressLine3]&.strip || address[:line3]&.strip,
        city: address[:city]&.strip,
        region: address[:region]&.strip,
        postal_code: address[:postal_code]&.to_s&.strip || address[:postalCode]&.to_s&.strip,
        location_code: address[:locationCode]
      }
    end      
          
    def convert_excel_date(excel_date)
      return nil unless excel_date

      # Excel dates are number of days since 1900-01-01
      base_date = Date.new(1900, 1, 1)
      (base_date + excel_date.to_i - 2).to_s # Subtract 2 to account for Excel's date system
    end
    
    def validate_transaction_data(data)
      required_fields = [
        :company_code,
        :document_type,
        :process_code,
        :document_code,
        :transaction_date,
        :customer_code
      ]
      
      missing_fields = required_fields.select { |field| data[field].nil? || data[field].to_s.empty? }
      
      raise ImportError, "Missing required fields: #{missing_fields.join(', ')}" if missing_fields.any?
    end
  end
