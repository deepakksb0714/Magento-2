require 'httparty'

class GeocodingService
  include HTTParty
  # base_uri ENV['GOOGLE_GEOCODING_URL']
  base_uri 'https://maps.googleapis.com'
  
  def initialize(coordinates, api_key)
    @coordinates = coordinates
    @api_key = api_key
  end
  
  def geocode
    # Use Google Maps Geocoding API to convert lat/lng to address
    latlng = "#{@coordinates[:latitude]},#{@coordinates[:longitude]}"
    
    options = {
      query: {
        latlng: latlng,
        key: @api_key
      }
    }
    
    response = self.class.get("/maps/api/geocode/json", options)
    
    if response.success? && response["status"] == "OK" && response["results"].any?
      # Process the response to match the format expected by the frontend
      formatted_response = format_geocoding_response(response)
      return OpenStruct.new(
        success?: true,
        parsed_response: formatted_response
      )
    else
      return OpenStruct.new(
        success?: false,
        error: response["error_message"] || "Geocoding failed"
      )
    end
  end
  
  private
  
  def format_geocoding_response(response)
    result = response["results"][0]
    address_components = result["address_components"]
    
    # Extract address components
    street_number = find_component(address_components, "street_number")
    route = find_component(address_components, "route")
    locality = find_component(address_components, "locality")
    administrative_area = find_component(address_components, "administrative_area_level_1")
    country = find_component(address_components, "country")
    postal_code = find_component(address_components, "postal_code")
    
    # Build address lines
    address_line = [street_number, route].compact.join(" ")
    
    # Format the response to match what the frontend expects
    {
      "result" => {
        "formattedAddress" => address_line,
        "addressLines" => [address_line],
        "locality" => locality,
        "administrativeArea" => administrative_area&.slice(0,2), # Get state abbreviation
        "administrativeAreaName" => administrative_area,
        "countryCode" => country&.slice(0,2), # Get country code (e.g., "US")
        "countryName" => country,
        "postalCode" => postal_code
      },
      "status" => response["status"]
    }
  end
  
  def find_component(components, type)
    component = components.find { |c| c["types"].include?(type) }
    component ? component["long_name"] : nil
  end
end