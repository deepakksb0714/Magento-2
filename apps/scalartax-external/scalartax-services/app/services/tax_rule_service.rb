class TaxRuleService
    # Create a new TaxRule record
    def self.create_tax_rule(params, current_user)
      tax_rule = TaxRule.new(params)
      tax_rule.created_by_id = current_user.id
      tax_rule.updated_by_id = current_user.id
      tax_rule.save
      tax_rule
    end
  
    # Update an existing TaxRule record
    def self.update_tax_rule(tax_rule, params, current_user)
      tax_rule.assign_attributes(params)
      tax_rule.updated_by_id = current_user.id
      tax_rule.save
      tax_rule
    end
end
  