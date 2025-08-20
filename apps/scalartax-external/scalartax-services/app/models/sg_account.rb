class SgAccount < ApplicationRecord

    establish_connection :secondary
    validates :name, presence: true
    before_create :set_custom_id

    private
    
    def set_custom_id
        self.id = ApplicationRecord.generate_alphanumeric_id('GAC')
    end

end
