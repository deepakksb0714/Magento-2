class ConditionService
    def self.create_condition(params)
      Condition.create!(params)
    end
  
    def self.update_condition(condition, params)
      condition.update!(params)
      condition
    end
  end
  