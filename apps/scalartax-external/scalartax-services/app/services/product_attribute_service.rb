class ProductAttributeService
    def self.create_product_attribute(params, product_id, user_id)
      ProductAttribute.new(params).tap do |product_attribute|
        product_attribute.product_id = product_id
        product_attribute.created_by_id = user_id
        product_attribute.updated_by_id = user_id
        product_attribute.save
      end
    end
  
    def self.create_multiple_product_attributes(attributes_params, product_id, user_id)
      attributes_params.each do |params|
        create_product_attribute(params, product_id, user_id)
      end
    end
  
    def self.update_product_attribute(product_attribute, params, user_id)
      product_attribute.assign_attributes(params)
      product_attribute.updated_by_id = user_id
      product_attribute.save
    end
  
    def self.update_multiple_product_attributes(attributes_params, product_id, user_id)
      attributes_params.each do |params|
        product_attribute = ProductAttribute.find_by(product_id: product_id, attribute_name: params[:attribute_name])
        if product_attribute
          update_product_attribute(product_attribute, params, user_id)
        else
          create_product_attribute(params, product_id, user_id)
        end
      end
    end
  end
  