class ReportsController < ApplicationController
  before_action :authenticate_request

  def transaction_report
    begin
      # report_params = params.require(:report).permit(
       
      # )
      report_params = params.require(:report).permit(
        :report_category, :report_name, :report_instantly, :include_locked_transactions_only,
        :compress_your_report_into_a_zip_file, :date_type, :compress_zip_file, :is_favorite, 
        :entity, :document_code_from, :document_code_to, :sort_by, :country, :preview, :pdf, :xlsx, :transaction_type, :status, :customer_id, :reason,
        :date_option, :custom_date_from, :custom_date_to,
        :entity_id, :document_code
      )
      report_data = TransactionReportService.generate_report(report_params)
      
      # Ensure we always return an array, even if empty
      render json: {
        data: report_data || [],
        meta: {
          totalPages: calculate_total_pages(report_data),
          currentPage: params[:page] || 1,
          totalRecords: report_data&.length || 0
        }
      }
    rescue => e
      
      # Return empty data array with error message
      render json: {
        data: [],
        meta: {
          totalPages: 1,
          currentPage: 1,
          totalRecords: 0
        },
        error: "Failed to generate report: #{e.message}"
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


