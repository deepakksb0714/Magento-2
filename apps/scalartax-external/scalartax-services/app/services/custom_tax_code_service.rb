class CustomTaxCodeService
    def self.create_tax_code(params, current_user)
      CustomTaxCode.create(params.merge(created_by_id: current_user.id, updated_by_id: current_user.id))
    end
  
    def self.get_tax_codes
      CustomTaxCode.all
    end
  
    def self.find_tax_code(id)
      CustomTaxCode.find(id)
    end
  
    def self.update_tax_code(id, params, current_user)
      tax_code = CustomTaxCode.find(id)
      tax_code.update(params.merge(updated_by_id: current_user.id))
      tax_code
    end
  
    def self.delete_tax_code(id)
      tax_code = CustomTaxCode.find(id)
      tax_code.destroy
    end
end
  
  