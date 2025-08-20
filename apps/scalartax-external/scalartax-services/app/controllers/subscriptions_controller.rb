class SubscriptionsController < ApplicationController
    before_action :set_plan, only: [:show, :create, :update, :destroy]
  
   # GET /subscriptions
    def index
      @subscriptions = Subscription.active
      render json: @subscriptions, status: :ok
    end

    
    def show
      @subscription = Subscription.find(params[:id])
    
      if @subscription.status == 'EXPIRED'
        render json: { message: 'Your subscription has expired.' }, status: :ok
      else
        render json: @subscription, status: :ok
      end
    end
    
  end
  