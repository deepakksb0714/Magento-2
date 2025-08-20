class TaxRulesController < ApplicationController
    before_action :find_tax_rule, only: %i[show update destroy]
  
    # GET /tax_rules
    def index
      tax_rules = TaxRule.all
      render json: tax_rules
    end
  
    # GET /tax_rules/:id
    def show
      render json: @tax_rule
    end
  
    # POST /tax_rules
    def create
      tax_rule = TaxRuleService.create_tax_rule(tax_rule_params, @current_user)
      if tax_rule.persisted?
        render json: tax_rule, status: :created
      else
        render json: tax_rule.errors, status: :unprocessable_entity
      end
    end
  
      # POST /tax_rules/import
      def import
        tax_rules = params.require(:tax_rules).map { |tax_rule| tax_rule.permit(permitted_tax_rule_attributes) }
        created_tax_rules = []
        errors = []
      
        tax_rules.each do |tax_rule_data|
          tax_rule = TaxRuleService.create_tax_rule(tax_rule_data, @current_user)
          if tax_rule.persisted?
            created_tax_rules << tax_rule
          else
            errors << { data: tax_rule_data, errors: tax_rule.errors.full_messages }
          end
        end
      
        if errors.empty?
          render json: { success: true, tax_rules: created_tax_rules }, status: :created
        else
          render json: { success: false, created: created_tax_rules, errors: errors }, status: :unprocessable_entity
        end
      end


    # PUT/PATCH /tax_rules/:id
    def update
      updated_tax_rule = TaxRuleService.update_tax_rule(@tax_rule, tax_rule_params, @current_user)
      if updated_tax_rule.errors.empty?
        render json: updated_tax_rule
      else
        render json: updated_tax_rule.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /tax_rules/:id
    def destroy
      @tax_rule.destroy
      head :no_content
    end
  
    private
  
    def tax_rule_params
      params.permit(
        :name, :entity_id, :rule_type, :process_code, :tax_type_group, :tax_sub_type, :country,
        :region, :jurisdiction_type, :juris_code, :jurisdiction_name, :is_all_juris, :tax_code,
        :tariff_code, :entity_use_code, :tax_type, :rate_type, :value, :threshold,
        :cap, :is_pro, :effective_date, :expiration_date, :description, :rate, :source, :cap_applied_value, :cap_option, :threshold_applied_value, :tax_entire_amount, options: {}
      )
    end

    # A helper method to define permitted attributes
def permitted_tax_rule_attributes
  [
    :name, :entity_id, :rule_type, :process_code, :tax_type_group, :tax_sub_type, :country,
    :region, :jurisdiction_type, :juris_code, :jurisdiction_name, :is_all_juris, :tax_code,
    :tariff_code, :entity_use_code, :tax_type, :rate_type, :value, :threshold,
    :cap, :is_pro, :effective_date, :expiration_date, :description, :rate, :source,
    :cap_applied_value, :cap_option, :threshold_applied_value, :tax_entire_amount, options: {}
  ]
end
  
    def find_tax_rule
      @tax_rule = TaxRule.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'TaxRule not found' }, status: :not_found
    end
  end
  
 