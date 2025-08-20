class TransactionReportService
  def self.generate_report(report_params)
    query = Transaction
      .joins(:line_items)
      .joins("LEFT JOIN internal_addresses AS transaction_dest_addresses ON transactions.destination_address_id = transaction_dest_addresses.id")
      .joins("LEFT JOIN internal_addresses AS transaction_origin_addresses ON transactions.origin_address_id = transaction_origin_addresses.id")
      .joins("LEFT JOIN internal_addresses AS line_item_dest_addresses ON line_items.destination_address_id = line_item_dest_addresses.id")
      .joins("LEFT JOIN internal_addresses AS line_item_origin_addresses ON line_items.origin_address_id = line_item_origin_addresses.id")
      .distinct

    # Filtering by transaction count
    if report_params[:transaction_count].present?
      query = query.limit(report_params[:transaction_count])
    end
    if report_params[:status].present?
      case report_params[:status].downcase
      when 'committed'
        query = query.where(status: 'committed')
      when 'uncommitted'
        query = query.where("LOWER(status) IN ('uncommitted', 'uncommited')")
      when 'voided'
        query = query.where(status: 'voided')
      when 'all'
        # No filter needed for 'all'
      end
    end

    # Filtering by code (document_code_from to document_code_to)
    if report_params[:document_code_from].present? && report_params[:document_code_to].present?
      query = query.where(code: report_params[:document_code_from]..report_params[:document_code_to])
    end

    # Date filtering (keeping existing date logic)
    query = apply_date_filters(query, report_params)

    # Other existing filters
    query = apply_basic_filters(query, report_params)

    # Select fields including both origin and destination address details
    data = query.select(
      'DISTINCT transactions.id',
      'transactions.certificate_id',
      'transactions.total_amount',
      'transactions.total_discount',
      'transactions.total_exempt',
      'transactions.total_taxable',
      'transactions.total_tax',
      'transactions.transaction_type',
      'transactions.status',
      'transactions.date',
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
      'line_items.line_number AS total_line_line_number'
    )
    # Order by transaction.id to group line items for the same transaction
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
    when 'custom_date', 'other_range' 
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
    query = query.where(customer_id: report_params[:customer_id]) if report_params[:customer_id].present?
    query = query.where(exemption_reason: report_params[:exemption_reason]) if report_params[:exemption_reason].present?
    query = query.where(transaction_type: report_params[:transaction_type]) if report_params[:transaction_type].present?
    query
  end

  def self.format_report_data(data)
    result = []
    transaction_map = {}

    data.each do |row|
      unless transaction_map[row.id]
        transaction_map[row.id] = {
          id: row.id,
          certificate_id: row.certificate_id,
          total_amount: row.total_amount,
          total_discount: row.total_discount,
          total_exempt: row.total_exempt,
          total_taxable: row.total_taxable,
          total_tax: row.total_tax,
          transaction_type: row.transaction_type,
          status: row.status,
          date: row.date,
          code: row.code,
          created_at: row.created_at,
          updated_at: row.updated_at,
          
          # Transaction addresses
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
          line_items: [] # Initialize empty array for line items
        }
      end

      # Add line item to the respective transaction
      transaction_map[row.id][:line_items] << {
        line_amount: row.total_line_amount,
        taxable_amount: row.taxable_amount,
        tax: row.total_line_tax,
        item_code: row.total_line_item_code,
        tax_code: row.total_line_tax_code,
        line_number: row.total_line_line_number,
        discount_amount: row.discount_amount,
        quantity: row.total_line_quantity,

        # Line-item addresses
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
    
    # Convert the transaction_map to an array of formatted transaction data
    transaction_map.each do |_, transaction_data|
      result << transaction_data
    end

    result
  end
end