class LocationAttributeService
  def self.create_location_attribute(params, location_id, user_id)
    LocationAttribute.new(params).tap do |location_attribute|
      location_attribute.location_id = location_id
      location_attribute.created_by_id = user_id
      location_attribute.updated_by_id = user_id
      location_attribute.save
    end
  end

  def self.create_multiple_location_attributes(attributes_params, location_id, user_id)
    attributes_params.each do |params|
      create_location_attribute(params, location_id, user_id)
    end
  end

  def self.update_location_attribute(location_attribute, params, user_id)
    location_attribute.assign_attributes(params)
    location_attribute.updated_by_id = user_id
    location_attribute.save
  end

  def self.update_multiple_location_attributes(attributes_params, location_id, user_id)
    attributes_params.each do |params|
      location_attribute = LocationAttribute.find_by(location_id: location_id, attribute_name: params[:attribute_name])
      if location_attribute
        update_location_attribute(location_attribute, params, user_id)
      else
        create_location_attribute(params, location_id, user_id)
      end
    end
  end
end
