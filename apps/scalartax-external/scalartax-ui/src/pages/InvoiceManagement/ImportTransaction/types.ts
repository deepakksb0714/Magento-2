// types.ts
export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface Data {
  uploadData?: any;
  importSettings?: any;
  requiredColumns?: any;
  attributes?: any;
  optionalColumns?: any;
  reviewData?: any;
}

export interface EntityLocation {
  id: string;
  location_code: string;
  entity_id: string;
  address_type_id: string;
}

export interface PrimaryEntity {
  id: any;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}

export type ExtraColumnsSection = {
  [key: string]:
    | string[]
    | {
        [key: string]: {
          [key: string]: string[];
        };
      };
};
