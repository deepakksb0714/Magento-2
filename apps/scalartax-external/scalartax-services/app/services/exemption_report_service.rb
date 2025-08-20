class ExemptionReportService
  def self.generate_report(report_params)
    Rails.logger.info "Generating Exemption Report with params: #{report_params.inspect}"

    query = Transaction
      .joins(:line_items)
      .joins("LEFT JOIN internal_addresses AS transaction_dest_addresses ON transactions.destination_address_id = transaction_dest_addresses.id")
      .joins("LEFT JOIN internal_addresses AS transaction_origin_addresses ON transactions.origin_address_id = transaction_origin_addresses.id")
      .joins("LEFT JOIN internal_addresses AS line_item_dest_addresses ON line_items.destination_address_id = line_item_dest_addresses.id")
      .joins("LEFT JOIN internal_addresses AS line_item_origin_addresses ON line_items.origin_address_id = line_item_origin_addresses.id")
      .distinct

    # Date filtering
    query = apply_date_filters(query, report_params)

    # Apply basic and exemption filters
    query = apply_basic_filters(query, report_params)
    query = apply_exemption_filters(query, report_params)

    Rails.logger.info "Final SQL Query: #{query.to_sql}"
    
    data = query.select(
      'DISTINCT transactions.id',
      'transactions.total_amount',
      'transactions.total_discount',
      'transactions.total_exempt',
      'transactions.total_taxable',
      'transactions.total_tax',
      'transactions.transaction_type',
      'transactions.entity_use_code',
      'transactions.certificate_id',
      'transactions.has_nexus',
      'transactions.date',
      'transactions.locked',
      'transactions.code',
      'transactions.created_at',
      'transactions.updated_at',
      
      # Transaction destination address details
      'transaction_dest_addresses.address_line1 AS dest_street',
      'transaction_dest_addresses.address_line2 AS dest_street2',
      'transaction_dest_addresses.city AS dest_city',
      'transaction_dest_addresses.region AS dest_region',
      'transaction_dest_addresses.country AS dest_country',
      'transaction_dest_addresses.postal_code AS dest_postal_code',

      # Transaction origin address details
      'transaction_origin_addresses.address_line1 AS origin_street',
      'transaction_origin_addresses.address_line2 AS origin_street2',
      'transaction_origin_addresses.city AS origin_city',
      'transaction_origin_addresses.region AS origin_region',
      'transaction_origin_addresses.country AS origin_country',
      'transaction_origin_addresses.postal_code AS origin_postal_code',

      # Line-item destination address details
      'line_item_dest_addresses.address_line1 AS line_item_dest_street',
      'line_item_dest_addresses.address_line2 AS line_item_dest_street2',
      'line_item_dest_addresses.city AS line_item_dest_city',
      'line_item_dest_addresses.region AS line_item_dest_region',
      'line_item_dest_addresses.country AS line_item_dest_country',
      'line_item_dest_addresses.postal_code AS line_item_dest_postal_code',

      # Line-item origin address details
      'line_item_origin_addresses.address_line1 AS line_item_origin_street',
      'line_item_origin_addresses.address_line2 AS line_item_origin_street2',
      'line_item_origin_addresses.city AS line_item_origin_city',
      'line_item_origin_addresses.region AS line_item_origin_region',
      'line_item_origin_addresses.country AS line_item_origin_country',
      'line_item_origin_addresses.postal_code AS line_item_origin_postal_code',

      # Line item details
      'line_items.quantity AS total_line_quantity',
      'line_items.line_amount AS total_line_amount',
      'line_items.tax AS total_line_tax',
      'line_items.item_code AS total_line_item_code',
      'line_items.taxable_amount AS taxable_amount',
      'line_items.discount_amount AS discount_amount',
      'line_items.tax_code AS total_line_tax_code',
      'line_items.line_number AS total_line_line_number',
      'line_items.entity_use_code AS line_item_entity_use_code'
    )
    
    data = data.order('transactions.id')
    format_report_data(data)
  end

  private

  def self.apply_date_filters(query, report_params)
    case report_params[:date_option]
    when 'previous_month'
      start_date = 1.month.ago.beginning_of_month
      end_date = 1.month.ago.end_of_month
      query.where(date: start_date..end_date)
    when 'current_month'
      start_date = Time.current.beginning_of_month
      end_date = Time.current.end_of_month
      query.where(date: start_date..end_date)
    when 'custom_date', 'other_range'  # Add 'other_range' here
      if report_params[:custom_date_from].present? && report_params[:custom_date_to].present?
        query.where(date: report_params[:custom_date_from]..report_params[:custom_date_to])
      else
        query
      end
    else
      query
    end
  end

  def self.apply_basic_filters(query, report_params)
    query = query.where(entity_id: report_params[:entity_id]) if report_params[:entity_id].present?
  
    # Filtering based on Level Name
    if report_params[:Level].present? && report_params[:region_or_city].present?
      case report_params[:Level]
      when 'State', 'County'
        query = query.where("transaction_dest_addresses.region = ?", report_params[:region_or_city])
        Rails.logger.info "Filtering transactions where destination region is #{report_params[:region_or_city]}"
      when 'City'
        query = query.where("transaction_dest_addresses.city = ?", report_params[:region_or_city])
        Rails.logger.info "Filtering transactions where destination city is #{report_params[:region_or_city]}"
      end
    end
  
    if report_params[:include_locked_transactions_only].present?
      if report_params[:include_locked_transactions_only] == true
        query = query.where(locked: true)
        Rails.logger.info "Filtering for locked transactions only"
      else
        Rails.logger.info "Including both locked and unlocked transactions"
      end
    end
  
    query
  end
  

  def self.apply_exemption_filters(query, report_params)
    # First filter for transactions with total_exempt > 0
    query = query.where('transactions.total_exempt > 0')
  
    entity_based = report_params[:entity_and_use_based_exemption].to_s == "true"
    product_based = report_params[:product_based_exemptions].to_s == "true"
    has_nexus = report_params[:no_nexus_jurisdictions_based_exemptions].to_s == "true" # Corrected parameter name
  
    Rails.logger.info "Applying Exemption Filters - Entity: #{entity_based}, Product: #{product_based}, Has Nexus: #{has_nexus}"
  
    case [entity_based, product_based, has_nexus]
    when [true, false, false]
      query = query.where("line_items.entity_use_code IS NOT NULL OR transactions.certificate_id IS NOT NULL")
      Rails.logger.info "Filtering for entity_use_code or certificate_id presence"
  
    when [false, true, false]
      query = query.where("line_items.tax_code IS NOT NULL")
      Rails.logger.info "Filtering for tax_code presence"
  
    when [false, false, true]
      query = query.where("transactions.has_nexus IS NOT NULL") # Fixed the table reference for has_nexus
      Rails.logger.info "Filtering for transactions.has_nexus presence"
  
    when [true, true, false]
      query = query.where("line_items.entity_use_code IS NOT NULL OR transactions.certificate_id IS NOT NULL OR line_items.tax_code IS NOT NULL")
      Rails.logger.info "Filtering for entity_use_code, certificate_id, or tax_code presence"
  
    when [true, false, true]
      query = query.where("line_items.entity_use_code IS NOT NULL OR transactions.certificate_id IS NOT NULL OR transactions.has_nexus IS NOT NULL")
      Rails.logger.info "Filtering for entity_use_code, certificate_id, or transactions.has_nexus presence"
  
    when [false, true, true]
      query = query.where("line_items.tax_code IS NOT NULL OR transactions.has_nexus IS NOT NULL")
      Rails.logger.info "Filtering for tax_code or transactions.has_nexus presence"
  
    when [true, true, true]
      query = query.where("line_items.entity_use_code IS NOT NULL OR transactions.certificate_id IS NOT NULL OR line_items.tax_code IS NOT NULL OR transactions.has_nexus IS NOT NULL")
      Rails.logger.info "Filtering for entity_use_code, certificate_id, tax_code, or transactions.has_nexus presence"
  
    else
      Rails.logger.info "No exemptions selected - skipping report generation"
      return nil
    end
  
    query
  end
  


  def self.format_report_data(data)
    result = []
    transaction_map = {}

    data.each do |row|
      unless transaction_map[row.id]
        transaction_map[row.id] = {
          id: row.id,
          total_amount: row.total_amount,
          total_discount: row.total_discount,
          total_exempt: row.total_exempt,
          total_taxable: row.total_taxable,
          total_tax: row.total_tax,
          transaction_type: row.transaction_type,
          entity_use_code: row.entity_use_code,
          certificate_id: row.certificate_id,
          has_nexus: row.has_nexus,
          date: row.date,
          code: row.code,
          created_at: row.created_at,
          updated_at: row.updated_at,
          
          destination_address: {
            street: row.dest_street,
            street2: row.dest_street2,
            city: row.dest_city,
            region: row.dest_region,
            country: row.dest_country,
            postal_code: row.dest_postal_code
          },
          origin_address: {
            street: row.origin_street,
            street2: row.origin_street2,
            city: row.origin_city,
            region: row.origin_region,
            country: row.origin_country,
            postal_code: row.origin_postal_code
          },
          line_items: []
        }
      end

      transaction_map[row.id][:line_items] << {
        line_amount: row.total_line_amount,
        taxable_amount: row.taxable_amount,
        tax: row.total_line_tax,
        item_code: row.total_line_item_code,
        tax_code: row.total_line_tax_code,
        line_number: row.total_line_line_number,
        discount_amount: row.discount_amount,
        quantity: row.total_line_quantity,
        entity_use_code: row.line_item_entity_use_code,

        destination_address: {
          street: row.line_item_dest_street,
          street2: row.line_item_dest_street2,
          city: row.line_item_dest_city,
          region: row.line_item_dest_region,
          country: row.line_item_dest_country,
          postal_code: row.line_item_dest_postal_code
        },
        origin_address: {
          street: row.line_item_origin_street,
          street2: row.line_item_origin_street2,
          city: row.line_item_origin_city,
          region: row.line_item_origin_region,
          country: row.line_item_origin_country,
          postal_code: row.line_item_origin_postal_code
        }
      }
    end
    
    transaction_map.values
  end
end