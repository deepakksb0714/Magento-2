class TransactionRuleService
    def self.create_transaction_rule(params)
      TransactionRule.create!(params)
    end
  
    def self.update_transaction_rule(transaction_rule, params)
      transaction_rule.update!(params)
      transaction_rule
    end
  end
  