class AccountsController < ApplicationController
  skip_before_action :authenticate_request, except: [:show, :update, :destroy]
  before_action :set_account, only: [:show, :update, :destroy]

  # GET /accounts
  def index
    @accounts = Account.all
    render json: @accounts
  end

  # GET /accounts/1
  def show
    if @account.account_status == "Deleted"
      render json: { error: "Account not found" }, status: :not_found
      return
    end
    render json: @account
  end

  # POST /accounts
  def create
    service = AccountService.new(account_params, user_params,plan_params)
    result = service.create_account_with_user

    if result[:success]
      render json: result[:account], status: :created
    else
      render json: { errors: result[:errors].full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /accounts/1
  def update
    unless @account.account_status == "Active"
      render json: { error: "Cannot update inactive account" }, status: :unprocessable_entity
      return
    end
    if @account.update(account_params)
      render json: @account
    else
      render json: { errors: @account.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /accounts/1
  def destroy
    unless @account.account_status == "Active"
      render json: { error: "Cannot delete inactive/deleted account" }, status: :unprocessable_entity
      return
    end
    @account.update(account_status: "Deleted")
    # @account.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account
    @account = Account.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Account not found" }, status: :not_found
  end



  # Only allow a list of trusted parameters through.
  def account_params
    params.permit(:company_name, :account_status, :created_by_id, :updated_by_id, :effective_date)
  end

  def plan_params
    params.permit(:name, :billing_cycle)
  end

  def user_params
    params.permit(:username, :first_name, :last_name, :email)
  end

end
