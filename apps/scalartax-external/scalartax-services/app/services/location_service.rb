class LocationService
  def self.create_locations_with_attributes(locations_params, current_user)
    created_locations = []

    Location.transaction do
      locations_params.each do |location_data|
        location_params = location_data.except(:location_attributes)
        attributes_params = location_data[:location_attributes]
       
        # Check if this location is being set as default
        if location_params[:is_default] == true
          # Update all existing locations for this entity to not be default
          Location.where(entity_id: location_params[:entity_id]).update_all(is_default: false)
        end

        location = Location.new(location_params)
        location.created_by_id = current_user.id
        location.updated_by_id = current_user.id
        
        if location.save
          created_locations << { location: location, attributes: attributes_params }
        else
          raise ActiveRecord::Rollback
        end
      end
    end

    created_locations.each do |data|
      LocationAttributeService.create_multiple_location_attributes(data[:attributes], data[:location].id, current_user.id)
    end

    created_locations.map { |data| data[:location] }
  rescue ActiveRecord::RecordInvalid => e
    raise ActiveRecord::Rollback, e.message
  end

  def self.update_location_with_attributes(location, location_params, current_user)
    updated_location_data = nil

    Location.transaction do
      # Check if this location is being set as default
      if location_params[:is_default] == true
        # Update all existing locations for this entity to not be default
        Location.where(entity_id: location.entity_id).where.not(id: location.id).update_all(is_default: false)
      end

      location.updated_by_id = current_user.id
      if location.update(location_params.except(:location_attributes))
        updated_location_data = { location: location, attributes: location_params[:location_attributes] }
      else
        raise ActiveRecord::Rollback
      end
    end

    if updated_location_data
      LocationAttributeService.update_multiple_location_attributes(
        updated_location_data[:attributes], 
        updated_location_data[:location].id, 
        current_user.id
      )
    end

    updated_location_data[:location]
  rescue ActiveRecord::RecordInvalid => e
    raise ActiveRecord::Rollback, e.message
  end
end