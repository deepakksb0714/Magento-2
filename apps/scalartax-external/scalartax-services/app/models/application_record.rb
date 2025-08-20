class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  
  def self.generate_alphanumeric_id(prefix)
    require 'securerandom'
  
    # Get the current timestamp in the format YYYYMMDDHHMMSS
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
  
    # Generate a UUID and remove hyphens, take the first 26 characters
    base_id = SecureRandom.uuid.delete('-')[0, 26]
  
    # Generate a random alphanumeric string of length 5
    random_suffix = SecureRandom.alphanumeric(5)
  
    # Combine prefix, timestamp, base ID, and random suffix
    alphanumeric_id = "#{prefix}#{timestamp}#{base_id}#{random_suffix}"
  
    # Ensure the length is exactly 32 characters
    alphanumeric_id.ljust(32, '0')[0, 32]
  end
end
