class ExemptionReportsController < ApplicationController
    before_action :authenticate_request
  
    def exemption_report
      begin
        report_params = params.permit(
          :report_category, :report_name, :report_instantly, :include_locked_transactions_only,
          :compress_your_report_into_a_zip_file, :date_type, :compress_zip_file, :is_favorite, 
          :entity, :document_code_from, :document_code_to, :sort_by, :country, :preview, :pdf, :xlsx, 
          :transaction_type, :status, :customer_id, :reason, :date_option, :custom_date_from, :custom_date_to,
          :entity_id, :document_code, :customer_code, :exempt_cert_status, :level, :tax_type, 
          :ecms_cert_id, :avacert_id, :issuing_country, :issuing_region, :exemption_no, 
          :exemption_no_type, :eff_date, :end_date, :company_code, :cert_type, :business_type, 
          :business_type_desc, :exemption_reason, :exempt_reason_desc, :customer_name, 
          :address_1, :address_2, :address_3, :city, :region, :postal_code, :cert_status, 
          :review_status, :last_trans_date, :applied, :created_date, :modified_date, 
          :invoice_po_no, :entity_and_use_based_exemption, :product_based_exemptions, 
          :no_nexus_jurisdictions_based_exemptions
        )
    
        report_data = ExemptionReportService.generate_report(report_params)
    
        render json: {
          data: report_data || [],
          meta: {
            totalPages: calculate_total_pages(report_data),
            currentPage: params[:page] || 1,
            totalRecords: report_data&.length || 0
          }
        }
      rescue => e
        render json: {
          data: [],
          meta: {
            totalPages: 1,
            currentPage: 1,
            totalRecords: 0
          },
          error: "Failed to generate exemption report: #{e.message}"
        }, status: :internal_server_error
      end
    end
    
  
    private
  
    def calculate_total_pages(data)
      return 1 if data.blank?
      
      per_page = 10 # or whatever your pagination size is
      (data.length.to_f / per_page).ceil
    end
  end  