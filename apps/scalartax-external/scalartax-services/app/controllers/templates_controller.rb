class TemplatesController < ApplicationController
  before_action :set_template, only: [:download]
  def create
    # Ensure these params are permitted
    template_params = params.require(:template).permit(:template_name, :mapped_columns, :user_id, :transaction_file)

    # Now call the TemplateService with the permitted params
    template_service = TemplateService.new(template_params, @current_user)
    result = template_service.create_template_with_file

    if result[:success]
      render json: { message: "Operation completed successfully." }, status: :ok
    else
      render json: { error: "There was an error processing your request." }, status: :unprocessable_entity
    end
    
  end

  def index
    @templates = Template.all
    render json:  @templates, status: :ok
  end

  # GET /tem[lates/1/download
  def download
    if @template.transaction_file.attached?
      attachment = @template.transaction_file
      begin
        # Ensure the binary content is downloaded correctly
        send_data attachment.blob.download,
                  filename: attachment.blob.filename.to_s,
                  type: attachment.blob.content_type,
                  disposition: 'attachment',
                  charset: 'binary' # Important for handling binary data correctly
  
        Rails.logger.info "Download completed successfully"
      rescue StandardError => e
        # Log the error for debugging purposes
        Rails.logger.error "Error during file download: #{e.message}"
        render json: { error: 'Internal server error' }, status: :internal_server_error
      end
    else
      render json: { error: 'File attachment not found' }, status: :not_found
    end
  end
  
  
  

  private

  def set_template
    @template = Template.find(params[:id])
  end

end
