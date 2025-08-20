require 'httparty'

class AddressValidationService
  include HTTParty
  # base_uri ENV['GOOGLE_ADDRESS_VALIDATOR_URL']
   base_uri 'https://addressvalidation.googleapis.com'

  def initialize(address, api_key)
    @address = address
    @api_key = api_key
  end


  def validate
    options = {
      headers: {
        'Content-Type' => 'application/json',
      },
      body: {
        address: {
          regionCode: @address[:regionCode],
          postalCode: @address[:postalCode],
          locality: @address[:locality],
          administrativeArea: @address[:administrativeArea],
          addressLines: [@address[:addressLines]].compact
        }.compact
      }.to_json
    }
    return self.class.post("/v1:validateAddress?key=#{@api_key}", options)
  end
end
