class ExemptionCertificateService
  require 'aws-sdk-s3'
  require 'tempfile'
  require 'digest'

  def initialize(exemption_certificate_params, current_user)
    @exemption_certificate_params = exemption_certificate_params
    Rails.logger.debug "Customer ID: #{@exemption_certificate_params[:customer_id]}"
    @current_user = current_user
    @tax_exemption_params = @exemption_certificate_params.delete(:tax_exemption)
    Rails.logger.info"tax_exemption_params #{@tax_exemption_params}"
    @external_address_params = @exemption_certificate_params.delete(:external_address)
    Rails.logger.info"external_address_params #{@external_address_params}"
    @file_params = @exemption_certificate_params.delete(:file)
  end

  def create_exemption_certificate_with_related_records
    ActiveRecord::Base.transaction do
      # tax_exemption = create_tax_exemption
      # external_address = create_external_address
      file_metadata = create_file_metadata

      exemption_certificate = ExemptionCertificate.new(@exemption_certificate_params)
      # exemption_certificate.tax_exemption = tax_exemption
      # exemption_certificate.external_address = external_address
      exemption_certificate.file_metadata = file_metadata
      exemption_certificate.created_by_id = @current_user.id
      exemption_certificate.updated_by_id = @current_user.id
      exemption_certificate.updated_by_id = @current_user.id
      # Save original entity_id and account_id, and their hashed versions
      exemption_certificate.entity_id = @exemption_certificate_params[:entity_id]
      exemption_certificate.encrypted_entity_id = hash_data(@exemption_certificate_params[:entity_id])
      exemption_certificate.account_id = @exemption_certificate_params[:account_id]
      exemption_certificate.encrypted_account_id = hash_data(@exemption_certificate_params[:account_id])

      attach_file_to_exemption_certificate(exemption_certificate)

      if exemption_certificate.save
        { success: true, exemption_certificate: exemption_certificate }
      else
        { success: false, errors: exemption_certificate.errors.full_messages }
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors.full_messages }
  rescue Aws::S3::Errors::ServiceError => e
    { success: false, errors: ["Failed to upload file: #{e.message}"] }
  rescue StandardError => e
    { success: false, errors: [e.message] }
  end

  def update_exemption_certificate_with_related_records(exemption_certificate, current_user)
    ActiveRecord::Base.transaction do
      # Update existing records or create new ones if they don't exist
      update_or_create_tax_exemption(exemption_certificate)
      update_or_create_external_address(exemption_certificate)
      
      # Only update file metadata if a valid file is provided
      update_file_metadata(exemption_certificate) if valid_file_params?
  
      # Update the exemption certificate attributes
      exemption_certificate.assign_attributes(@exemption_certificate_params.except(:id))
      exemption_certificate.updated_by_id = current_user.id
  
      # Update the hashed IDs if they changed
      if @exemption_certificate_params[:entity_id].present? && exemption_certificate.entity_id != @exemption_certificate_params[:entity_id]
        exemption_certificate.entity_id = @exemption_certificate_params[:entity_id]
        exemption_certificate.encrypted_entity_id = hash_data(@exemption_certificate_params[:entity_id])
      end
  
      if @exemption_certificate_params[:account_id].present? && exemption_certificate.account_id != @exemption_certificate_params[:account_id]
        exemption_certificate.account_id = @exemption_certificate_params[:account_id]
        exemption_certificate.encrypted_account_id = hash_data(@exemption_certificate_params[:account_id])
      end
  
      # Handle file update only if a valid file is provided
      update_attached_file(exemption_certificate) if valid_file_params?
  
      if exemption_certificate.save
        { success: true, exemption_certificate: exemption_certificate }
      else
        { success: false, errors: exemption_certificate.errors.full_messages }
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors.full_messages }
  rescue Aws::S3::Errors::ServiceError => e
    { success: false, errors: ["Failed to upload file: #{e.message}"] }
  rescue StandardError => e
    Rails.logger.error("Update failed: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    { success: false, errors: [e.message] }
  end


  private

   # Check if file parameters contain actual content
   def valid_file_params?
    @file_params.present? && 
    @file_params['name'].present?
  end

  def create_file_metadata
    return nil unless @file_params.present?

    FileMetadata.create!(
      name: @file_params[:name],
      size: @file_params[:size],
      mime_type: @file_params[:type]
    )
  rescue StandardError => e
    nil
  end

  def attach_file_to_exemption_certificate(exemption_certificate)
    return unless @file_params.present?

    begin
      decoded_content = Base64.decode64(@file_params['content'])

      # Use the original filename
      filename = @file_params['name']

      # Attach the file using Active Storage
      exemption_certificate.file_attachment.attach(
        io: StringIO.new(decoded_content),
        filename: filename,
        content_type: @file_params['type']
      )

      # Set the custom key for S3 storage
      exemption_certificate.file_attachment.blob.update(key: generate_s3_key(exemption_certificate, filename))
    rescue StandardError => e
      Rails.logger.error("Failed to attach file: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      raise e
    end
  end

  def generate_s3_key(exemption_certificate, filename)
    hashed_account_id = hash_data(exemption_certificate.account_id)
    hashed_entity_id = hash_data(exemption_certificate.entity_id)
    hashed_customer_id = hash_data(exemption_certificate.customer_id)
    date_string = Time.now.strftime("%d-%m-%Y")

    short_account_id = hashed_account_id[0...8]
    short_entity_id = hashed_entity_id[0...8]
    short_customer_id = hashed_customer_id[0...8]

    # Truncate the filename if it's too long
    max_filename_length = 64
    truncated_filename = filename.length > max_filename_length ? "#{filename[0...max_filename_length - 3]}..." : filename

    "#{short_account_id}/#{short_entity_id}/exempt_certificate/#{short_customer_id}_#{date_string}_#{truncated_filename}"
  end

  def hash_data(data)
    Digest::SHA256.hexdigest(data.to_s)
  end

  def create_tax_exemption
    return nil unless @tax_exemption_params

    TaxExemption.create!(@tax_exemption_params.merge(id: SecureRandom.uuid))
  rescue StandardError => e
    nil
  end

  def create_external_address
    return nil unless @external_address_params

    ExternalAddress.create!(@external_address_params.merge(id: SecureRandom.uuid))
  rescue StandardError => e
    nil
  end

  
  def update_or_create_tax_exemption(exemption_certificate)
    return unless @tax_exemption_params

    if exemption_certificate.tax_exemption
      # Update existing tax exemption
      exemption_certificate.tax_exemption.update!(@tax_exemption_params)
    else
      # Create new tax exemption and associate it
      tax_exemption = create_tax_exemption
      exemption_certificate.tax_exemption = tax_exemption if tax_exemption
    end
  end

  def update_or_create_external_address(exemption_certificate)
    return unless @external_address_params

    if exemption_certificate.external_address
      # Update existing external address
      exemption_certificate.external_address.update!(@external_address_params)
    else
      # Create new external address and associate it
      external_address = create_external_address
      exemption_certificate.external_address = external_address if external_address
    end
  end

  def update_file_metadata(exemption_certificate)
    return unless valid_file_params?

    if exemption_certificate.file_metadata
      # Update existing file metadata
      exemption_certificate.file_metadata.update!(
        name: @file_params[:name],
        size: @file_params[:size],
        mime_type: @file_params[:type]
      )
    else
      # Create new file metadata and associate it
      file_metadata = create_file_metadata
      exemption_certificate.file_metadata = file_metadata if file_metadata
    end
  end

  def update_attached_file(exemption_certificate)
    begin
      # Only proceed if we have valid file parameters
      return unless valid_file_params?
      
      # Create a new blob directly instead of purging and re-attaching
      decoded_content = Base64.decode64(@file_params['content'])
      filename = @file_params['name']
      content_type = @file_params['type']
      
      # Create a new blob with custom key
      blob = ActiveStorage::Blob.create_and_upload!(
        io: StringIO.new(decoded_content),
        filename: filename,
        content_type: content_type,
        key: generate_s3_key(exemption_certificate, filename)
      )
      
      # Remove existing file attachment if present
      exemption_certificate.file_attachment.purge if exemption_certificate.file_attachment.attached?
      
      # Create a new attachment with the new blob
      exemption_certificate.file_attachment.attach(blob)
      
      Rails.logger.info "File updated successfully: #{filename}, key: #{blob.key}"
    rescue StandardError => e
      Rails.logger.error("Failed to update attached file: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      raise e
    end
  end
end