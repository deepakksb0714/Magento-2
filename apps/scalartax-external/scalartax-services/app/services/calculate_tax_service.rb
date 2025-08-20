class CalculateTaxService
  def initialize(params, entity_id)
    @items = params[:lineItems]
    @discount = params[:total_discount].to_f   
    @global_address = params[:address]
    @global_override_tax = params[:tax_override_amount].to_f
    @customer_id = params[:customer_id]
    @entity_use_code = params[:entity_use_code]
    @certificate_id = params[:certificate_id]
    @has_nexus = false
    @entity_id = entity_id

    Rails.logger.info "entity_use_code #{@entity_use_code}"
  end
 
  def calculate
    total_amount_before_discount = @items.sum { |item| item[:line_amount].to_f }
    return { error: "Total amount of all items is zero", status: :unprocessable_entity } if total_amount_before_discount.zero?
 
    global_override_tax_ratio = @global_override_tax / total_amount_before_discount
    overall_tax_breakdown = []
    total_amount = 0
    total_tax_amount = 0
    total_taxable_amount = 0
    final_amount_for_all_items = 0
    total_exempt_amount = 0
    @items.each do |item|
      item_details = calculate_item_details(item, global_override_tax_ratio, total_amount_before_discount)
      return item_details if item_details[:error]

      total_amount += item_details[:line_amount]
      total_tax_amount += item_details[:total_item_tax_amount]
      total_taxable_amount += item_details[:breakdown][:tax_breakdown][0][:taxable_amount]
      final_amount_for_all_items += item_details[:total_item_amount_after_tax]
      total_exempt_amount += item_details[:breakdown][:tax_breakdown][0][:exempt_amount]
     
      overall_tax_breakdown << item_details[:breakdown]
    end
    {
      "overall_tax_breakdown": overall_tax_breakdown,
      "total_amount": total_amount,
      "total_tax_amount": total_tax_amount.round(2).to_s,
      "total_discount": @discount,
      "total_taxable_amount": total_taxable_amount,
      "total_exempt_amount": total_exempt_amount,
      "final_amount_for_all_items": final_amount_for_all_items.round(2).to_s,
      "has_nexus": @has_nexus
    }
  end
 
  private
 
  def calculate_item_details(item, global_override_tax_ratio, total_amount_before_discount)
    item_quantity = item[:quantity].to_f
    item_amount = item[:line_amount].to_f
    tax_included = item[:tax_included] == 'true'
    discount_included = item[:discount_added]
    entity_use_code = item[:entity_use_code].presence || @entity_use_code
    @global_override_tax = item[:tax_override_amount].presence.to_f
    tax_code = item[:tax_code]
    item_code = item[:item_code]
    tax_details = fetch_tax_details(item)
    return tax_details if tax_details[:error]

    Rails.logger.info "tax_details #{tax_details}"

    Rails.logger.info " @global_override_tax  #{@global_override_tax}"
    tax_region = tax_details[:tax_state]

    exemption_details = taxability(tax_region, entity_use_code, @certificate_id, tax_code, item_amount, item_code) 

    Rails.logger.info "exemption_details #{exemption_details}"
    
  
    if tax_included
      item_discount = calculate_discount(item_amount, total_amount_before_discount, discount_included)
      taxable_amount = item_amount
      if @global_override_tax.positive?
        item_global_override_tax = (global_override_tax_ratio * taxable_amount).round(2)
        item_amount = taxable_amount - item_global_override_tax
        taxable_amount = item_amount - item_discount
      else
        tax_amount = (item_amount * tax_details[:total_tax_rate] / 100).round(2)
        item_amount -= tax_amount
        taxable_amount = item_amount - item_discount
        Rails.logger.info "taxable_amount--- #{taxable_amount}"
      end
    else
      item_discount = calculate_discount(item_amount, total_amount_before_discount, discount_included)
      taxable_amount = (item_amount - item_discount).round(3)
    end
 
    breakdown = generate_item_tax_breakdown(item, taxable_amount, item_discount, global_override_tax_ratio, exemption_details, tax_details)
 
    {
      line_amount: item_amount,
      total_item_tax_amount: breakdown[:total_item_tax_amount],
      total_item_amount_after_tax: breakdown[:total_item_amount_after_tax],
      breakdown: {
        "line_number": item[:line_number],
        "description": item[:description],
        "item_code": item[:item_code],
        "quantity": item_quantity,
        "line_amount": item_amount,
        "taxable_amount": item[:taxable_amount],
        "item_discount": item_discount,
        "tax_breakdown": breakdown[:item_tax_breakdown],
        "item_total_tax_amount": breakdown[:total_item_tax_amount].round(2).to_s,
        "item_total_amount_after_tax": breakdown[:total_item_amount_after_tax].round(2).to_s,
        "item_total_amount_after_tax_for_total_quantity": (breakdown[:total_item_amount_after_tax] * item_quantity).round(2).to_s
      }
    }
  end  
 
  def calculate_discount(item_amount, total_amount_before_discount, discount_included)
    return 0 unless discount_included

    calculated_discount = (@discount * item_amount / total_amount_before_discount).round(2)
    [calculated_discount, item_amount].min
  end
 
  def fetch_tax_details(item)
    ship_to_zip = item.dig(:address, "Ship To", :postal_code)&.slice(0, 5) || @global_address.dig("Ship To", :postal_code)&.slice(0, 5)
    ship_from_zip = item.dig(:address, "Ship From", :postal_code)&.slice(0, 5) || @global_address.dig("Ship From", :postal_code)&.slice(0, 5)

    ship_to_sales_tax_rates = SgSalesTaxRate.find_by(zip_code: ship_to_zip)
    ship_from_sales_tax_rates = SgSalesTaxRate.find_by(zip_code: ship_from_zip)

    return { error: "#{ship_to_zip} not a valid zip code", status: :not_found } unless ship_to_sales_tax_rates
    return { error: "#{ship_from_zip} not a valid zip code", status: :not_found } unless ship_from_sales_tax_rates

    ship_to_region = item.dig(:address, "Ship To", :region) || @global_address.dig("Ship To", :region)
    ship_from_region = item.dig(:address, "Ship From", :region) || @global_address.dig("Ship From", :region)

    return { error: "Zip code #{ship_to_zip} does not belong to the state #{ship_to_region}", status: :unprocessable_entity } unless valid_region?(ship_to_region, ship_to_sales_tax_rates.zip_code)

    return { error: "Zip code #{ship_from_zip} does not belong to the state #{ship_from_region}", status: :unprocessable_entity } unless valid_region?(ship_from_region, ship_from_sales_tax_rates.zip_code)

    Rails.logger.info "Validated zip codes: Ship To - #{ship_to_zip}, Ship From - #{ship_from_zip}"

    interstate = ship_to_region != ship_from_region
   
    calculate_tax_rate(ship_to_region, ship_from_region, ship_to_sales_tax_rates, ship_from_sales_tax_rates, item, interstate)
    
  end
 
  def generate_item_tax_breakdown(item, taxable_amount, item_discount, global_override_tax_ratio, exemption_details, tax_details)
    # Convert item quantity to float for accurate calculations
    item_quantity = item[:quantity].to_f
    total_item_tax_amount = 0
    item_tax_breakdown = []
    exempt_amount = 0
  
    # If total tax rate is 0, skip tax calculation and mark the item as fully exempt
    if tax_details[:total_tax_rate] == 0
      Rails.logger.info "total_tax_rate in if #{tax_details[:total_tax_rate]}"
      item_tax_breakdown << {
        "line_number": item[:line_number],
        "description": item[:description],
        "item_code": item[:item_code],
        "quantity": item_quantity,
        "jurisdiction": nil,
        "tax_region_name": nil,
        "estimated_combined_rate": nil,
        "state_rate": nil,
        "estimated_county_rate": nil,
        "estimated_city_rate": nil,
        "estimated_special_rate": nil,
        "taxable_amount": 0,
        "exempt_amount": taxable_amount,
        "tax_amount": "0.00"
      }
      total_item_tax_amount = 0
  
    # Apply global override tax if applicable
    elsif @global_override_tax.positive?
      item_global_override_tax = (global_override_tax_ratio * taxable_amount).round(2)
      total_item_tax_amount = item_global_override_tax
      item_tax_breakdown << {
        "line_number": item[:line_number],
        "description": item[:description],
        "item_code": item[:item_code],
        "quantity": item_quantity,
        "jurisdiction": nil,
        "tax_region_name": nil,
        "estimated_combined_rate": nil,
        "state_rate": nil,
        "estimated_county_rate": nil,
        "estimated_city_rate": nil,
        "estimated_special_rate": nil,
        "taxable_amount": taxable_amount,
        "exempt_amount": 0,
        "tax_amount": item_global_override_tax.round(2).to_s
      }
  
    # Proceed with normal tax calculation
    else
 
        # Calculate default tax amount before considering exemptions
        tax_amount = (taxable_amount * tax_details[:total_tax_rate] / 100).round(2)
        if exemption_details
          case exemption_details[:status]
          when 'E', 'Exempt'
            # Fully exempt: Set all tax rates and tax amount to 0
            exempt_amount = taxable_amount
            taxable_amount = 0
            tax_amount = 0
            tax_details[:state_tax_rate] = 0
            tax_details[:county_tax_rate] = 0
            tax_details[:city_tax_rate] = 0
            tax_details[:estimated_special_rate] = 0
            tax_details[:total_tax_rate] = 0
  
          when 'P', 'No State Sales Tax', 'Taxable'
            # Partial exemption: Adjust state tax rate and recalculate tax amount
            tax_details[:state_tax_rate] = exemption_details[:rate]
            # Recalculate combined tax rate, excluding city tax if city_tax_include is false
            
            Rails.logger.info "tax_details[:total_tax_rate] #{tax_details[:total_tax_rate]}"

            tax_details[:total_tax_rate] = 
              tax_details[:state_tax_rate].to_d + 
              tax_details[:city_tax_rate].to_d + 
              tax_details[:county_tax_rate].to_d + 
              tax_details[:estimated_special_rate].to_d
          
            Rails.logger.info "tax_details[:total_tax_rate] #{tax_details[:total_tax_rate]}"
            # Recalculate tax amount with adjusted tax rates
            tax_amount = (taxable_amount * tax_details[:total_tax_rate] / 100).round(2)
  
          else
            Rails.logger.info "Unrecognized exemption status: #{exemption_details[:status]}"
          end
        else
          Rails.logger.info "No exemption details found. Proceeding with simple calculation."
        end
  
        # Accumulate total tax amount for the item
        total_item_tax_amount += tax_amount
  
        # Add tax breakdown for the item, excluding city tax if city_tax_include is false
        item_tax_breakdown << {
          "line_number": item[:line_number],
          "description": item[:description],
          "item_code": item[:item_code],
          "quantity": item_quantity,
          "jurisdiction": tax_details[:region_name],
          "tax_state": tax_details[:tax_state],
          "estimated_combined_rate": tax_details[:total_tax_rate],
          "state_rate": tax_details[:state_tax_rate],
          "estimated_county_rate": tax_details[:county_tax_rate],
          "estimated_city_rate": tax_details[:city_tax_rate],
          "estimated_special_rate": tax_details[:estimated_special_rate],
          "taxable_amount": taxable_amount,
          "exempt_amount": exempt_amount,
          "tax_amount": tax_amount.round(2).to_s
        }
      end

  
    # Calculate total item amount after adding tax
    total_item_amount_after_tax = (taxable_amount + total_item_tax_amount).round(2)
  
    {
      item_tax_breakdown:,
      total_item_tax_amount:,
      total_item_amount_after_tax:
    }
  end
  
  def exemption_details(tax_region, entity_use_code, certificate_id)
    return { status: 'T' } if entity_use_code == "Taxable"

    Rails.logger.info "entity_use_code: #{entity_use_code}"
    # Fetch the certificate
    certificate = ExemptionCertificate.find_by(id: certificate_id, entity_id: @entity_id)
    business_type = ''
  
    if certificate
      Rails.logger.info "Certificate found: #{certificate.business_type}"
      business_type = certificate.business_type
  
      # Validate certificate using the common method
      return fetch_exemption_from_global(tax_region, entity_use_code, business_type) unless valid_record_date?(certificate)
  
      # Check if the tax_region is in certificate regions
      certificate_regions = certificate.regions.to_s.split(',').select { |region| region == tax_region }
      Rails.logger.info "certificate_regions #{certificate_regions}"
      return fetch_exemption_from_global(certificate_regions, certificate.exemption_reason, certificate.business_type) unless certificate_regions.empty?
  
      Rails.logger.info "Certificate regions do not match transaction's ship-to address"
    else
      Rails.logger.info "No certificate found for certificate_id: #{certificate_id}"
    end
  
    fetch_exemption_from_global(tax_region, entity_use_code, business_type) if entity_use_code.present?
  end
  
  # Helper method to fetch exemption details from the global database
  def fetch_exemption_from_global(region, entity_use_code, business_type)
    Rails.logger.info "Fetching exemption details from global database for region '#{region}' and entity_use_code '#{entity_use_code}'"
 
    business = SgExemptReason.find_by(name: business_type)
    entity_use_code_record = SgEntityUseCode.find_by("name = ? OR code = ?", entity_use_code, entity_use_code)
    if business
          if business && entity_use_code_record
           valid_business = SgExemptReasonMatrix.exists?(
             sg_exempt_reason_id: business.id,
             entity_use_code_id: entity_use_code_record.id
           )  
           Rails.logger.info "valid business type and reason combination : #{valid_business}"
          else
           Rails.logger.info "ivalid business type and reason combination !"
           return { status: 'N' }
          end
    end
    region = SgRegion.find_by(code: region)
    if region && entity_use_code_record
      # Fetch the exemption matrix based on region and entity_use_code_id
      exemption_matrix = SgRegionExemptionMatrix
                         .where(region_id: region.id, entity_use_code_id: entity_use_code_record.id)
                         .first
 
      if exemption_matrix
        # Fetch the exemption status
        exemption_status = SgExemptionStatus.find_by(id: exemption_matrix.exemption_status_id)
 
        Rails.logger.info "Exemption status found for region '#{region.code}' and entity_use_code '#{entity_use_code}': #{exemption_status.inspect}"
 
        # Check exemption status code
        case exemption_status&.code
        when 'E'
          return { status: 'E' } # Exempt (no tax)
        when 'T'
          return { status: 'T' }
        when 'N'
          return { status: 'N' } # Exemption not allowed
        when 'P'
          # If partial_rate_id exists, fetch and return the partial rate
          if exemption_matrix.partial_rate_id
            partial_rate = SgPartialTaxRate.find_by(id: exemption_matrix.partial_rate_id)
            return { status: 'P', rate: partial_rate.rate } if partial_rate
             
           
            Rails.logger.info "No partial rate found for partial_rate_id '#{exemption_matrix.partial_rate_id}'"
           
          else
            Rails.logger.info "No partial_rate_id found for exemption matrix"
          end
        else
          Rails.logger.info "No matching exemption status for code '#{exemption_status&.code}'"
        end
      else
        Rails.logger.info "No exemption matrix found for region '#{region.code}' and entity_use_code '#{entity_use_code}'"
      end
    else
      Rails.logger.info "No region or entity use code record found for region '#{region}' and entity_use_code '#{entity_use_code}'"
    end
 
    nil # Return nil if no exemption details found
  end
 
  def fetch_product_taxability(tax_code, region, item_amount, item_code)
    return { status: 'T' } unless tax_code && region
 
    # Fetch tax_code only if item_code is present and a valid tax_code exists in Product
    if item_code
     found_tax_code = Product.find_by(product_code: item_code, entity_id: @entity_id)&.tax_code
     tax_code = found_tax_code if found_tax_code.present?
    end

    tax_code_record = SgTaxCode.find_by(tax_code:)
     
    Rails.logger.info "tax code records #{tax_code_record}"
    region_record = SgRegion.find_by(code: region)
 
    unless tax_code_record
      Rails.logger.info "Tax code #{tax_code} does not exist"
      return { status: 'T' }
    end
 
    unless region_record
      Rails.logger.info "Region #{region} does not exist"
      return { status: 'T' }
    end
 
    region_tax_code_status = SgRegionTaxCodeStatus.find_by(region_id: region_record.id, tax_code_id: tax_code_record.id)
 
    Rails.logger.info "tax code records #{region_tax_code_status.inspect}"
    unless region_tax_code_status
      Rails.logger.info "No tax status found for region #{region_record.id} and tax code #{tax_code_record.id}"
      return { status: 'T' }
    end
 
    tax_conditions = SgTaxCondition.where(region_tax_code_id: region_tax_code_status.id)
    if tax_conditions.empty?
      return {
        status: region_tax_code_status.tax_type,
        rate: region_tax_code_status.tax_rate
      }
    end
 
    applicable_condition = tax_conditions.find do |condition|
      case condition.operator
      when '=' then item_amount == condition.value
      when '>' then item_amount > condition.value
      when '>=' then item_amount >= condition.value
      when '<' then item_amount < condition.value
      when '<=' then item_amount <= condition.value
      when '!=' then item_amount != condition.value
      else
        false
      end
    end
    Rails.logger.info "applicable condition #{applicable_condition}"
    if applicable_condition
      {
        status: region_tax_code_status.tax_type,
        rate: applicable_condition.applicable_tax_rate
      }
    else
      {
        status: 'T'
      }
    end
  end
 

  private

  def taxability(tax_region, entity_use_code, certificate_id, tax_code, item_amount, item_code)  
    product_taxability = fetch_product_taxability(tax_code, tax_region, item_amount, item_code) || {}
    Rails.logger.info "entity_use_code--- #{entity_use_code}"

    Rails.logger.info "product_taxability #{product_taxability}"
    # Condition 1: If product_taxability has status 'E', return it immediately
    return product_taxability if product_taxability[:status] == 'E'

    exemption_details = exemption_details(tax_region, entity_use_code, @certificate_id) || {}
    Rails.logger.info "exemption_details #{exemption_details}"

    # Condition 2: If both have status 'P' and rate is present, return the one with the minimum rate
    if product_taxability[:status] == 'P' && exemption_details[:status] == 'P' &&
       product_taxability[:rate] && exemption_details[:rate]
   
     product_rate = sanitize_rate(product_taxability[:rate])
     exemption_rate = sanitize_rate(exemption_details[:rate])
   
     min_rate = [product_rate, exemption_rate].min
     return { status: 'P', rate: min_rate }
    end

    # Default return: If exemption_details exists, return it; otherwise, return product_taxability
    exemption_details.presence || product_taxability.presence || { status: 'T' }
  end

  def sanitize_rate(rate)
    return nil unless rate # Handle nil values

    BigDecimal(rate.to_s.delete('%')) # Remove '%' and convert to BigDecimal
  end
  
  def valid_region?(region, zip_code)
    SgSalesTaxRate.where(zip_code:, state: region).exists?
  end  
  
  def calculate_tax_rate(ship_to_region, ship_from_region, ship_to_sales_tax_rates, ship_from_sales_tax_rates, item, interstate)
    sg_region = SgRegion.find_by(code: ship_to_region)
    
    unless sg_region
      return {
        total_tax_rate: 0
      }
    end
  
    sourcing = sg_region.sourcing
    Rails.logger.info "Sourcing type: #{sourcing}, Interstate Transaction: #{interstate}"
  
    # Determine tax zip code based on sourcing rules
    sales_tax_rates = if interstate
ship_to_sales_tax_rates
                      else
(sourcing == "origin" ? ship_from_sales_tax_rates : ship_to_sales_tax_rates)
 end
    
    # Precompute tax rates to avoid redundant calculations
   
    total_tax_rate = sales_tax_rates.estimated_combined_rate

    city_tax_rate = sales_tax_rates.estimated_city_rate

    region_name = sales_tax_rates.tax_region_name
    # Determine nexus region
    nexus_region = if interstate
                   ship_to_region
                   else
                   (sourcing == "origin" ? ship_from_region : ship_to_region)
                   end
    nexus = Nexus.find_by(region_code: nexus_region, entity_id: @entity_id, jurisdiction_type: 'region')

    unless nexus && valid_record_date?(nexus)
      return {
        total_tax_rate: 0
      }
    end
    
    sg_nexus = SgNexus.find_by(id: nexus.nexus_id)
    unless sg_nexus&.nexus_type == "sales_tax"
      return {
        total_tax_rate: 0
      }
    end
  
    # Extract city information
    origin_city = item.dig(:address, "Ship From", :city) || @global_address.dig("Ship From", :city)
    destination_city = item.dig(:address, "Ship To", :city) || @global_address.dig("Ship To", :city)
    
    city_to_validate = if ship_to_region == "CA" || interstate
                         destination_city
                       else
                         sourcing == "origin" ? origin_city : destination_city
                       end
  
    city_tax_include = local_nexus_validate(sg_nexus, nexus, city_to_validate)

    if !city_tax_include && ship_to_region != "CA"
      total_tax_rate -= city_tax_rate
      Rails.logger.info "City tax rate deducted: #{city_tax_rate}" # Log before resetting
      city_tax_rate = 0
    end
       
  
    @has_nexus = true
  
    # Special tax rate calculation for California
    if !interstate && ship_to_region == "CA"
      Rails.logger.info "City tax rate  ca: #{city_tax_rate}"
      Rails.logger.info "City tax rate of  ship_to_sales_tax_rates.estimated_city_rate: #{ship_to_sales_tax_rates.estimated_city_rate}"
      total_tax_rate = sales_tax_rates.estimated_combined_rate - city_tax_rate + ship_to_sales_tax_rates.estimated_city_rate 
      Rails.logger.info "total_tax_rate after refactoring in ca if city include: #{total_tax_rate}"
      city_tax_rate = ship_to_sales_tax_rates.estimated_city_rate
      region_name = ship_to_sales_tax_rates.tax_region_name
      unless city_tax_include
        total_tax_rate -= city_tax_rate
        Rails.logger.info "City tax rate deducted in ca: #{city_tax_rate}"
        city_tax_rate = 0
      end
    end

    {
      total_tax_rate:,
      city_tax_rate:,
      state_tax_rate: sales_tax_rates.state_rate,
      county_tax_rate: sales_tax_rates.estimated_county_rate,
      estimated_special_rate: sales_tax_rates.estimated_special_rate,
      region_name:,
      tax_state: nexus_region
    }
   
    
  end   
  
  def local_nexus_validate(sg_nexus, nexus, city_to_validate)
    return true unless sg_nexus.has_local_nexus
  
    city_nexus = Nexus.find_by(name: city_to_validate, parent_nexus_id: nexus.id, entity_id: @entity_id, jurisdiction_type: 'city')
    return false unless city_nexus && valid_record_date?(city_nexus)    

    sg_nexus = SgNexus.find_by(id: city_nexus.nexus_id)
    false unless sg_nexus&.nexus_type == "sales_tax"
    
  end  
  
  def valid_record_date?(record)
    return false unless record
  
    current_date = Date.today
  
    if record.effective_date.present? && record.effective_date > current_date
      Rails.logger.info "#{record.class.name} is not yet effective (Effective Date: #{record.effective_date})"
      return false
    end
  
    if record.expiration_date.present? && record.expiration_date < current_date
      Rails.logger.info "#{record.class.name} has expired (Expiration Date: #{record.expiration_date})"
      return false
    end 
    true
  end
  
 
end
    