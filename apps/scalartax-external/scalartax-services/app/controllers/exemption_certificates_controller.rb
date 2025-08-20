require 'prawn'
require 'open-uri'
class ExemptionCertificatesController < ApplicationController
  before_action :set_exemption_certificate, only: [:show, :update, :destroy, :download]
  before_action :filter_exemption_certificate_entity, only: [:index, :show, :update]

  # GET /exemption_certificates
  def index
    render json: @exemption_certificates, status: :ok
  end

  # GET /exemption_certificates/1
  def show
    render json: @exemption_certificate, status: :ok
  end

  # POST /exemption_certificates
  def create
    service = ExemptionCertificateService.new(exemption_certificate_params, @current_user)
    result = service.create_exemption_certificate_with_related_records

    if result[:success]
      render json: result[:exemption_certificate], status: :created
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /exemption_certificates/1
  def update
    service = ExemptionCertificateService.new(exemption_certificate_params, @current_user)
    result = service.update_exemption_certificate_with_related_records(@exemption_certificate, @current_user)

    if result[:success]
      render json: result[:exemption_certificate], status: :ok
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  # DELETE /exemption_certificates/1
  def destroy
    begin
      ActiveRecord::Base.transaction do
        # First, destroy the exemption certificate
        @exemption_certificate.destroy!

        # Then, destroy the associated records if they exist
        @exemption_certificate.tax_exemption&.destroy
        @exemption_certificate.external_address&.destroy
      end

      render json: { message: 'Exemption certificate deleted successfully' }, status: :ok
    rescue ActiveRecord::RecordNotDestroyed => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /exemption_certificates/1/download
  def download
    attachment = @exemption_certificate.file_attachment
    if attachment&.blob
      begin
        send_data attachment.blob.download,
                  filename: attachment.blob.filename.to_s,
                  type: attachment.blob.content_type,
                  disposition: 'attachment'

        Rails.logger.info "Download completed successfully"
      rescue StandardError
        render json: { error: 'Internal server error' }, status: :internal_server_error
      end
    else
      render json: { error: 'File attachment or blob not found' }, status: :not_found
    end
  end

  private

  def set_exemption_certificate
    @exemption_certificate = ExemptionCertificate.find_by(id: params[:id], entity_id: @entity_id)
    render json: { error: 'Exemption certificate not found' }, status: :not_found unless @exemption_certificate
  end

  def exemption_certificate_params
    params.require(:exemption_certificate).permit(
      :id, :code, :certificate_customer_name, :entity_id, :account_id, :signed_date, :description, :business_type, :tax_type, :tax_type_id, :comment,
      :expiration_date, :document_exists, :is_valid, :verified, :certificate_labels,
      :purchase_order_number, :exemption_limit, :exempt_percentage, :ecm_status, :customer_id, :effective_date, :exemption_reason, :regions, :regions_data,
      file: [:name, :size, :type, :content, { file: [:path] }]
    )
  end

  def filter_exemption_certificate_entity
    Rails.logger.info "entity_id #{@entity_id}"
    @exemption_certificates = ExemptionCertificate.where(entity_id: @entity_id)
  rescue ActiveRecord::RecordNotFound
    @exemption_certificates = []
  end
end
