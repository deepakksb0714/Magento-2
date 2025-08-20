class ProductService
  def self.create_products_with_attributes(products_params, current_user)
    created_products = []

    Product.transaction do
      products_params.each do |product_data|
        product_params = product_data.except(:product_attributes)
        attributes_params = product_data[:product_attributes]

        product = Product.new(product_params)
        product.created_by_id = current_user.id
        product.updated_by_id = current_user.id
        if product.save
          created_products << { product: product, attributes: attributes_params }
        else
          raise ActiveRecord::Rollback
        end
      end
    end

    created_products.each do |data|
      ProductAttributeService.create_multiple_product_attributes(data[:attributes], data[:product].id, current_user.id)
    end

    created_products.map { |data| data[:product] }
  rescue ActiveRecord::RecordInvalid => e
    raise ActiveRecord::Rollback, e.message
  end

  def self.update_product_with_attributes(product, product_params, current_user)
    updated_product_data = nil

    Product.transaction do
      product.updated_by_id = current_user.id
      if product.update(product_params.except(:product_attributes))
        updated_product_data = { product: product, attributes: product_params[:product_attributes] }
      else
        raise ActiveRecord::Rollback
      end
    end

    if updated_product_data
      ProductAttributeService.update_multiple_product_attributes(
        updated_product_data[:attributes], 
        updated_product_data[:product].id, 
        current_user.id
      )
    end

    updated_product_data[:product]
  rescue ActiveRecord::RecordInvalid => e
    raise ActiveRecord::Rollback, e.message
  end
end
