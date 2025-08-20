class TemplateService
    def initialize(template_params, current_user)
      @template_params = template_params
      @file_params = template_params[:transaction_file] # Correctly access the file from params
      @current_user = current_user
    end

    def create_template_with_file
        # ActiveRecord::Base.transaction do
        # Initialize the template with the provided params
        template = Template.new(
          template_name: @template_params[:template_name],
          mapped_columns: @template_params[:mapped_columns]
        )
        # Assign the user_id (ensure it comes from current_user if needed)
        template.user_id = @current_user.id

        # Attach the file if present
        # attach_file_to_template(template)

        # Attempt to save the template
        if template.save
          { success: true, template: }
        else
          Rails.logger.error("Failed to save template: #{template.errors.full_messages}")
          { success: false, errors: template.errors.full_messages }
        end
    end
rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error("ActiveRecord::RecordInvalid: #{e.record.errors.full_messages}")
      { success: false, errors: e.record.errors.full_messages }
rescue StandardError => e
      Rails.logger.error("Unexpected Error: #{e.message}")
      { success: false, errors: [e.message] }
    end

    private

def attach_file_to_template(template)
    
      if @file_params.is_a?(ActionDispatch::Http::UploadedFile)
        # Log to verify the uploaded file's details
        Rails.logger.info "Uploaded file details: #{@file_params.inspect}"
        decoded_content = @file_params.read
        filename = @file_params.original_filename
        content_type = @file_params.content_type
      else
        decoded_content = Base64.decode64(@file_params[:content])
        filename = @file_params[:name]
        content_type = @file_params[:type]
      end

      template.transaction_file.attach(
        io: StringIO.new(decoded_content),
        filename:,
        content_type:
      )
rescue StandardError => e
      Rails.logger.error("Failed to attach file: #{e.message}")
      raise e
    
end
