class NexusLocationService
  def initialize(entity_id, user)
    @entity_id = entity_id
    @current_user_id = user.id
  end

  def create_nexus_locations(regions)
    ActiveRecord::Base.transaction do
      regions.each do |region_params|
        region = NexusRegion.find_or_create_by!(code: region_params[:code]) do |r|
          r.name = region_params[:name]
          r.country_id = "US"
        end

        # Create NexusLocation for the region
        create_nexus_location(region.id, nil, nil, region_params)

        region_params[:counties].each do |county_params|
          county = NexusCounty.find_or_create_by!(name: county_params[:name], region_id: region.id)

          # Create NexusLocation for the county
          create_nexus_location(region.id, county.id, nil, region_params)

          county_params[:cities].each do |city_params|
            city = NexusCity.find_or_create_by!(name: city_params[:name], region_id: region.id)

            # Create NexusLocation for the city
            create_nexus_location(region.id, county.id, city.id, region_params)
          end
        end
      end
    end
  end

  def get_nexus_locations
    locations = NexusLocation.includes(:nexus_region, :nexus_county, :nexus_city)
                             .where(entity_id: @entity_id)
  
    regions_hash = {}
  
    locations.each do |location|
      region = location.nexus_region
      county = location.nexus_county
      city = location.nexus_city
  
      # Group by region
      regions_hash[region.id] ||= {
        id: region.id,
        name: region.name,
        code: region.code,
        source: location.source,
        tax_type: location.tax_type,
        flat_rate: location.flat_rate || 0,
        counties: {}
      }
  
      # Group by county if present
      next unless county

      regions_hash[region.id][:counties][county.id] ||= {
        id: county.id,
        name: county.name,
        cities: []
      }
  
      # Add cities to the county
      regions_hash[region.id][:counties][county.id][:cities] << { id: city.id, name: city.name } if city
    end
  
    {
      entity_id: @entity_id,
      regions: regions_hash.values.map do |region|
        region[:counties] = region[:counties].values # Convert counties hash to array
        region
      end
    }
  end  

  def update_nexus_location(location_id, update_params)
    location = NexusLocation.find_by(id: location_id, entity_id: @entity_id)
    return unless location

    location.update!(update_params.merge(updated_by_id: @current_user_id))
    location
  end

  def delete_nexus_location(location_id)
    location = NexusLocation.find_by(id: location_id, entity_id: @entity_id)
    location.destroy! if location
  end

  private

  def create_nexus_location(region_id, county_id, city_id, region_params)
    NexusLocation.create!(
      entity_id: @entity_id,
      region_id:,
      county_id:,
      city_id:,
      tax_type: region_params[:tax_type],
      source: region_params[:source],
      flat_rate: region_params[:flat_rate].presence || nil,
      created_by_id: @current_user_id,
      updated_by_id: @current_user_id
    )
  end
end
