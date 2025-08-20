class SLNexusService
  def self.create_nexuses(nexuses_params,current_user)
    SLNexus.transaction do
      nexuses_params.each do |record_params|
        record_params[:created_by_id] = current_user.id
        record_params[:updated_by_id] = current_user.id
        SLNexus.create!(record_params)
      end
    end
  end

  def self.update_nexus(nexus, nexuses_params,current_user)
    nexuses_params[:updated_by_id] = current_user.id
    nexus.update!(nexuses_params)
  end
end
