class CustomerService
  def initialize(customer_params,current_user, external_address_params, contact_params)
    @customer_params = customer_params
    @address_params = external_address_params
    @contact_params = contact_params
    @entity_id = @customer_params.delete(:entity_id)
    @current_user = current_user
  end

  def create_customer_with_address_and_contact
     ActiveRecord::Base.transaction do
      address = ExternalAddress.create!(@address_params)
      contact = Contact.create!(@contact_params)
      created_by_id = @current_user.id
      updated_by_id = @current_user.id
      customer = Customer.new(@customer_params.merge(entity_id: @entity_id, address_id: address.id, contact_id: contact.id,created_by_id: created_by_id,updated_by_id: updated_by_id))
      if customer.save
        customer.reload
        { success: true, customer: customer }
      else
        { success: false, errors: customer.errors }
      end
  end
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors }
  end

  def update_customer_with_address_and_contact(customer)
    ActiveRecord::Base.transaction do
      customer.external_address.update!(@address_params)
      customer.contact.update!(@contact_params) if @contact_params
      updated_by_id = @current_user.id
      update_params = @customer_params.merge(updated_by_id: updated_by_id)

      if customer.update(update_params)
        { success: true, customer: customer }
      else
        { success: false, errors: customer.errors }
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors }
  end
end
