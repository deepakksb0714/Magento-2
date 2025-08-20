class AddressesController < ApplicationController
  include Rainbow
  
  def validate_address
    @address = params[:address]
    address_params = {
      addressLines: @address[:addressLines],
      administrativeArea: @address[:administrativeArea],
      locality: @address[:locality],
      postalCode: @address[:postalCode],
      regionCode: @address[:regionCode]
    }
    
    # service = AddressValidationService.new(address_params, ENV['GOOGLE_API_KEY'])
    service = AddressValidationService.new(address_params, 'AIzaSyD2d-LSaT4Ie2yV17PISdI2xziv2ao9aSg')
    response = service.validate
    
    if response['responseId']
      render json: { response: response.parsed_response, isAddressValid: true }, status: :ok
    else
      render json: { error: 'Address validation failed', isAddressValid: false }, status: :unprocessable_entity
    end
  end
  
  def validate_coordinates
    @coordinates = params[:coordinates]
    coordinates_params = {
      latitude: @coordinates[:latitude],
      longitude: @coordinates[:longitude]
    }
    
    # Create a new service for geocoding coordinates to addresses
    service = GeocodingService.new(coordinates_params, 'AIzaSyD2d-LSaT4Ie2yV17PISdI2xziv2ao9aSg')
    response = service.geocode
    
    if response && response.success?
      render json: { 
        response: { 
          result: { 
            address: response.parsed_response["result"],
            geocodeStatus: response.parsed_response["status"] 
          } 
        }, 
        isAddressValid: true 
      }, status: :ok
    else
      render json: { 
        error: 'Coordinates validation failed', 
        isAddressValid: false 
      }, status: :unprocessable_entity
    end
  end
end