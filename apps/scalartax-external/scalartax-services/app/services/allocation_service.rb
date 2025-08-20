class AllocationService
    def self.create_allocation(params)
      Allocation.create!(params)
    end
  
    def self.update_allocation(allocation, params)
      allocation.update!(params)
      allocation
    end
  end
  