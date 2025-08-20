class UserMailer < ApplicationMailer
  default from: 'deepakksb0714@gmail.com'

  def account_enabled(user)
    @user = user
    @company_name = get_company_name(user) || 'scalarhubio'

    # Log the company name we're using
    Rails.logger.info("Using company name: #{@company_name} for user #{user.id}")

    # Create a dynamic login URL based on company name
    company_subdomain = @company_name.to_s.downcase.gsub(/\s+/, '')
    @login_url = "https://#{company_subdomain}.scalarhub.ai"

    Rails.logger.info("Generated login URL: #{@login_url}")

    mail(
      to: user.email,
      subject: "Your Account Has Been Enabled"
    )
  end

  def get_company_name(user)
    begin
      # Check if user has associated entity roles
      user_entity_role = UserEntityRole.find_by(user_id: user.id)
  
      if user_entity_role.nil?
        Rails.logger.warn("No user entity role found for user #{user.id}")
        return nil
      end
  
      # Extract the first key from entity_permission_attribute hash
      company_name = user_entity_role.entity_permission_attribute&.keys&.first
  
      if company_name.present?
        Rails.logger.info("Found company name: #{company_name}")
        return company_name
      else
        Rails.logger.warn("No company name found in entity_permission_attribute for user #{user.id}")
        return nil
      end
    rescue => e
      Rails.logger.error("Error getting company name: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
    end
  
    return nil
  end
end
