

export interface NexusDetail {
    nexus_type: string;
    nexus_id: string;
    sourcing: string;
    flat_rate: string;
    has_local_nexus: boolean;
}

export interface Region {
    id: string;
    name: string;
    jurisdiction_type: string;
    code: string;
    nexus_details: NexusDetail[];
}

  
export interface CurrentRegion {
  id: string;
  name: string;
  nexus_id: string;
  code: string;
  nexus_type: string;
}
  export interface County {
    id: string;
    name: string;
    jurisdiction_type: string;
    effective_date: string | null;
    expiration_date: string | null
    cities: City[];
  }
  
  export interface City {
    id: string;
    jurisdiction_type: string;
    effective_date: string | null;
    expiration_date: string | null
    name: string;
  }