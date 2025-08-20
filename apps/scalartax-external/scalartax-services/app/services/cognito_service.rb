require 'uri'
require 'net/http'
require 'openssl'

class CognitoService
  def initialize(jwt_token, company_name)
    @jwt_token = jwt_token
    @company_name = company_name
  end

  def create_user(user)
    uri = URI('https://api.scalarhub.ai/users')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    request = Net::HTTP::Post.new(uri)
  
    # Define request_body before logging
    request_body = {
      companyName: @company_name,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      preferred_username: user.username
    }
  
    # Log the request body before converting to JSON
    Rails.logger.info "CognitoService#create_user - Request Body: #{request_body.inspect}"
  
    request.body = request_body.to_json
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "Bearer #{@jwt_token}"
  
    response = http.request(request)
  
    # Log the response status and body
    Rails.logger.info "CognitoService#create_user - Response Code: #{response.code}, Response Body: #{response.body}"
  
    response.is_a?(Net::HTTPSuccess)
  rescue => e
    Rails.logger.error "CognitoService#create_user - Error: #{e.message}"
    false
  end
  

  def update_user(user)
    uri = URI("https://api.scalarhub.ai/users/#{URI.encode_www_form_component(user.email)}")
    
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    
    request = Net::HTTP::Put.new(uri)
    request.body = {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      status: user.status,
    }.to_json
    
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "Bearer #{@jwt_token}"
        
    response = http.request(request)
    
    if response.is_a?(Net::HTTPSuccess)
      # Parse the response to check if email verification is required
      response_body = JSON.parse(response.body)
      if response_body["emailVerificationRequired"] == true
        # Return info that verification is needed
        return { success: true, verification_required: true }
      else
        return { success: true, verification_required: false }
      end
    else
      Rails.logger.error "CognitoService#update_user - Error: #{response.body}"
      return { success: false, message: "Update failed: #{response.body}" }
    end
    
  rescue => e
    Rails.logger.error "CognitoService#update_user - Error: #{e.message}"
    return { success: false, message: e.message }
  end
  


  def delete_user(user)
    uri = URI("https://api.scalarhub.ai/users/#{URI.encode_www_form_component(user.email)}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Delete.new(uri)
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "Bearer #{@jwt_token}"

    response = http.request(request)

    response.is_a?(Net::HTTPSuccess)
  rescue => e
    Rails.logger.info "Error: #{e.message}"
    false
  end
end
