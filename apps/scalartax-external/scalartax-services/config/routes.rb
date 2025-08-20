Rails.application.routes.draw do

  scope "/:company_name/scalartax" do
    resources :users, param: :id, constraints: { id: /[^\/]+/ }
    resources :accounts
    resources :products
    resources :user_entity_roles

    resources :transactions, only: [:create, :show, :index, :update] do
      collection do
        post :import
      end
    end
    resources :entities, only: [:create, :update, :show, :destroy, :index]
    resources :customers
    post '/transaction_reports', to: 'reports#transaction_report'
    post '/exemption_reports', to: 'exemption_reports#exemption_report' 
    resources :exemption_certificates, only: [:create, :index, :show, :update, :destroy] do
      member do
        get 'download'
      end
    end
    resources :nexuses
    resources :subscriptions
    resources :plans
    resources :entitlements
    resources :locations
    resources :location_attributes
    post 'calculate', to: 'calculate_tax#calculate', as: :calculate
    resources :transaction_rules, only: [:create, :update, :show, :index, :destroy]
    resources :templates, only: [:create, :show, :index] do
      member do
        get 'download'
      end
    end
    resources :tax_rules, only: [:index, :show, :create, :update, :destroy] do
      collection do
        post :import
      end
    end
    resources :custom_tax_codes, only: [:index, :show, :create, :update, :destroy]
    resources :nexus_locations, only: [:index, :create, :update, :destroy]
  end
  post '/:company_name/scalartax/validate_address', to: 'addresses#validate_address'
  post '/:company_name/scalartax/validate_coordinates', to: 'addresses#validate_coordinates'
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
