class TransactionRulesController < ApplicationController
  load_and_authorize_resource except: [:create, :update]
  before_action :set_transaction_rule, only: [:show]
  
  def create
    ActiveRecord::Base.transaction do
      rule_params = transaction_rule_params[:transaction_rule]
      operations_params = transaction_rule_params[:operations]

      # Create Transaction Rule
      transaction_rule = TransactionRuleService.create_transaction_rule(
        rule_params.merge(
          created_by_id: @current_user.id,
          updated_by_id: @current_user.id
        )
      )

      created_operations = []
      operations_params.each do |operation_param|
        created_conditions = []
        operation_param[:conditions]&.each do |condition_param|
          condition_data = condition_param.merge(transaction_rule_id: transaction_rule.id)
          condition = ConditionService.create_condition(condition_data)
          created_conditions << condition
        end

        created_allocations = []
        operation_param[:allocations]&.each do |allocation_param|
          address_id = nil
          if allocation_param[:address_line1]
            # Create or find the external address
            address_data = allocation_param.slice(:country, :address_line1, :address_line2, :city, :state, :zip_code)
            puts"address_data------#{address_data}"
            Rails.logger.debug "address_data: #{address_data.inspect}"

            address = ExternalAddress.create!(address_data)
            address_id = address.id
          end

          allocation_data = allocation_param.except(:country, :address_line1, :address_line2, :city, :state, :zip_code)
                                            .merge(transaction_rule_id: transaction_rule.id, address_id: address_id)
          allocation = AllocationService.create_allocation(allocation_data)
          created_allocations << allocation
        end

        created_operations << { conditions: created_conditions, allocations: created_allocations }
      end

      render json: {
        success: true,
        transaction_rule: transaction_rule,
        operations: created_operations
      }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { success: false, error: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :internal_server_error
  end

  # UPDATE
  def update
    ActiveRecord::Base.transaction do
      transaction_rule = TransactionRule.find_by(id: params[:id])

      if transaction_rule
        updated_rule = TransactionRuleService.update_transaction_rule(
          transaction_rule,
          transaction_rule_params[:transaction_rule].merge(updated_by_id: @current_user.id)
        )

        updated_operations = []
        operations_params = transaction_rule_params[:operations]
        operations_params.each do |operation_param|
          updated_conditions = []
          condition_ids_to_delete = []

          operation_param[:conditions]&.each do |condition_param|
            if condition_param[:id].present?
              condition = Condition.find_by(id: condition_param[:id])
              if condition
                updated_condition = ConditionService.update_condition(condition, condition_param)
                updated_conditions << updated_condition
              else
                raise ActiveRecord::RecordNotFound, "Condition with ID #{condition_param[:id]} not found"
              end
            else
              new_condition = ConditionService.create_condition(condition_param.merge(transaction_rule_id: transaction_rule.id))
              updated_conditions << new_condition
            end
          end

          if operation_param[:conditions_ids_to_delete].present?
            operation_param[:conditions_ids_to_delete].each do |condition_id|
              condition_to_delete = Condition.find_by(id: condition_id)
              condition_to_delete&.destroy
              condition_ids_to_delete << condition_id
            end
          end

          updated_allocations = []
          allocation_ids_to_delete = []

          operation_param[:allocations]&.each do |allocation_param|
            address_id = allocation_param[:address_id] # Check if address_id is provided
          
            # If address_id is present, update the existing address
            if address_id.present? && !address_id.strip.empty? 
              address = ExternalAddress.find_by(id: address_id)
              if address
                address_data = allocation_param.slice(:country, :address_line1, :address_line2, :city, :state, :zip_code)
                address.update!(address_data) # Update the existing address
              else
                raise ActiveRecord::RecordNotFound, "Address with ID #{address_id} not found"
              end
            elsif allocation_param[:address_line1] # If no address_id but address data is provided, create a new address
              address_data = allocation_param.slice(:country, :address_line1, :address_line2, :city, :state, :zip_code)
              address = ExternalAddress.create!(address_data)
              address_id = address.id
            end
          
            if allocation_param[:id].present? 
              allocation = Allocation.find_by(id: allocation_param[:id])
              if allocation
                updated_allocation = AllocationService.update_allocation(
                  allocation,
                  allocation_param.except(:country, :address_line1, :address_line2, :city, :state, :zip_code)
                                  .merge(address_id: address_id)
                )
                updated_allocations << updated_allocation
              else
                raise ActiveRecord::RecordNotFound, "Allocation with ID #{allocation_param[:id]} not found"
              end
            else
              new_allocation = AllocationService.create_allocation(
                allocation_param.except(:country, :address_line1, :address_line2, :city, :state, :zip_code)
                               .merge(transaction_rule_id: transaction_rule.id, address_id: address_id)
              )
              updated_allocations << new_allocation
            end
          end
          if operation_param[:allocations_ids_to_delete].present?
            operation_param[:allocations_ids_to_delete].each do |allocation_id|
              allocation_to_delete = Allocation.find_by(id: allocation_id)
              allocation_to_delete&.destroy
              allocation_ids_to_delete << allocation_id
            end
          end

          updated_operations << {
            conditions: updated_conditions,
            allocations: updated_allocations,
            conditions_deleted: condition_ids_to_delete,
            allocations_deleted: allocation_ids_to_delete
          }
        end

        render json: {
          success: true,
          transaction_rule: updated_rule,
          operations: updated_operations
        }, status: :ok
      else
        render json: { success: false, error: 'Transaction Rule not found' }, status: :not_found
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { success: false, error: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { success: false, error: e.message }, status: :internal_server_error
  end
  

# INDEX - Get all Transaction Rules
def index
  transaction_rules = TransactionRule.includes(:conditions, allocations: [:address]).all

  render json: {
    success: true,
    transaction_rules: transaction_rules.as_json(include: {
      conditions: {}, # Directly associated with TransactionRule
      allocations: {  # Directly associated with TransactionRule
        include: {
          address: {} # Associated with Allocations
        }
      }
    })
  }, status: :ok
end


  # SHOW - Get a single Transaction Rule by ID
  def show
    render json: {
      success: true,
      transaction_rule: @transaction_rule.as_json(include: {
        conditions: {}, # Directly associated with TransactionRule
        allocations: {  # Directly associated with TransactionRule
          include: {
            address: {} # Associated with Allocations
          }
        }
      })
    }, status: :ok
  end
  

  # DELETE - Delete a Transaction Rule by ID
  def destroy
    transaction_rule = TransactionRule.find_by(id: params[:id])

    if transaction_rule
      transaction_rule.destroy
      render json: {
        success: true,
        message: "Transaction Rule with ID #{params[:id]} has been successfully deleted."
      }, status: :ok
    else
      render json: {
        success: false,
        error: "Transaction Rule with ID #{params[:id]} not found."
      }, status: :not_found
    end
  end

  private

  def set_transaction_rule
    @transaction_rule = TransactionRule.find(params[:id])
    Rails.logger.info("Transaction Rule: #{@transaction_rule.inspect}")
  rescue ActiveRecord::RecordNotFound
    render json: { success: false, error: 'Transaction Rule not found' }, status: :not_found
  end

  def transaction_rule_params
    params.permit(
      transaction_rule: [
        :id, :name, :entity_id, :effective_date, :expiration_date, :rule_type, 
        :allocate_tax_on_single_line, :ignore_rule_on_error, :inactive, 
        :created_by_id, :updated_by_id, document_types: [],
      ],
      operations: [
        {
          conditions: [:id, :field, :operator, values: [], address_types: []],
          conditions_ids_to_delete: [],
          allocations: [
            :id, :tax_code, :location_id, :address_id, :percentage, 
            :country, :address_line1, :address_line2, :city, :state, :zip_code
          ],
          allocations_ids_to_delete: []
        }
      ]
    )
  end
end
