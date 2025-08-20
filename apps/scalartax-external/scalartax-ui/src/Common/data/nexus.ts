export const statesData = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Northern Mariana Islands',
  'Nebraska',
  'Nevada',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'U.S. Minor Outlying Islands',
  'Utah',
  'Vermont',
  'Virgin Islands',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export const disabledStatesData = [
  'American Samoa',
  'Delaware',
  'Federated States of Micronesia',
  'Marshall Islands',
  'Montana',
  'Northern Mariana Islands',
  'Palau',
  'U.S. Minor Outlying Islands',
  'Virgin Islands',
];

// Define the type for jurisdictions

interface Tax {
  name: string;
  jurisdiction?: string;
}

interface County {
  name: string;
  type: string;
  taxes: Tax[];
}

interface Jurisdictions {
  counties: County[];
}

interface JurisdictionsData {
  [state: string]: Jurisdictions;
}

export const jurisdictionsData: JurisdictionsData = {
  Alaska: {
    counties: [
      {
        name: 'Adak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Adak (City)',
          },
        ],
      },
      {
        name: 'Alakanuk',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Alakanuk (City)',
          },
        ],
      },
      {
        name: 'Aleknagik',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Aleknagik (City)',
          },
        ],
      },
      {
        name: 'Aleutians East Borough',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'False Pass (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'King Cove (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sand Point (City)',
          },
        ],
      },
      {
        name: 'Angoon',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Angoon (City)',
          },
        ],
      },
      {
        name: 'Aniak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Aniak (City)',
          },
        ],
      },
      {
        name: 'Bethel',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Bethel (City)',
          },
        ],
      },
      {
        name: 'Brevig Mission',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Brevig Mission (City)',
          },
        ],
      },
      {
        name: 'Chefornak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Chefornak (City)',
          },
        ],
      },
      {
        name: 'Chevak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Chevak (City)',
          },
        ],
      },
      {
        name: 'Clarks Point',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Clarks Point (City)',
          },
        ],
      },
      {
        name: 'Cordova',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Cordova (City)',
          },
        ],
      },
      {
        name: 'Craig',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Craig (City)',
          },
        ],
      },
      {
        name: 'Dillingham',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Dillingham (City)',
          },
        ],
      },
      {
        name: 'Diomede',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Diomede (City)',
          },
        ],
      },
      {
        name: 'Eek',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Eek (City)',
          },
        ],
      },
      {
        name: 'Elim',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Elim (City)',
          },
        ],
      },
      {
        name: 'Emmonak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Emmonak (City)',
          },
        ],
      },
      {
        name: 'Fairbanks N Star Brg',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Fairbanks (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'North Pole (City)',
          },
        ],
      },
      {
        name: 'Fort Yukon',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Fort Yukon (City)',
          },
        ],
      },
      {
        name: 'Galena',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Galena (City)',
          },
        ],
      },
      {
        name: 'Gambell',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Gambell (City)',
          },
        ],
      },
      {
        name: 'Gustavus',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Gustavus (City)',
          },
        ],
      },
      {
        name: 'Haines',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Haines Rural (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Haines (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Haines (County)',
          },
        ],
      },
      {
        name: 'Hoonah',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Hoonah (City)',
          },
        ],
      },
      {
        name: 'Hooper Bay',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Hooper Bay (City)',
          },
        ],
      },
      {
        name: 'Hydaburg',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Hydaburg (City)',
          },
        ],
      },
      {
        name: 'Juneau',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Juneau (County)',
          },
        ],
      },
      {
        name: 'Kake',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kake (City)',
          },
        ],
      },
      {
        name: 'Kenai Peninsula',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Homer (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kenai Peninsula (County)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kenai (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Seldovia (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Seward (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Soldotna (City)',
          },
        ],
      },
      {
        name: 'Ketchikan Gateway',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ketchikan Gateway (County)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ketchikan (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Saxman (City)',
          },
        ],
      },
      {
        name: 'Klawock',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Klawock (City)',
          },
        ],
      },
      {
        name: 'Kodiak Island Borough',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kodiak (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Larsen Bay (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Old Harbor (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ouzinkie (City)',
          },
        ],
      },
      {
        name: 'Kotlik',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kotlik (City)',
          },
        ],
      },
      {
        name: 'Koyuk',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Koyuk (City)',
          },
        ],
      },
      {
        name: 'Kwethluk',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kwethluk (City)',
          },
        ],
      },
      {
        name: 'Lake Peninsula Brg',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Chignik (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Newhalen (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Nondalton (City)',
          },
        ],
      },
      {
        name: 'Manokotak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Manokotak (City)',
          },
        ],
      },
      {
        name: 'Marshall',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Marshall (City)',
          },
        ],
      },
      {
        name: 'Matanuska-susitna Brg',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Houston (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Palmer (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Talkeetna Sewer and Water Service Area (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wasilla (City)',
          },
        ],
      },
      {
        name: 'Mekoryuk',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Mekoryuk (City)',
          },
        ],
      },
      {
        name: 'Mountain Village',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Mountain Village (City)',
          },
        ],
      },
      {
        name: 'Napakiak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Napakiak (City)',
          },
        ],
      },
      {
        name: 'Napaskiak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Napaskiak (City)',
          },
        ],
      },
      {
        name: 'Nenana',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Nenana (City)',
          },
        ],
      },
      {
        name: 'Newtok',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Newtok (City)',
          },
        ],
      },
      {
        name: 'North Slope Borough',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Barrow (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kaktovik (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wainwright (City)',
          },
        ],
      },
      {
        name: 'Nuiqsut',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Nuiqsut (City)',
          },
        ],
      },
      {
        name: 'Palmer',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Palmer (City)',
          },
        ],
      },
      {
        name: 'Seldovia',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Seldovia (City)',
          },
        ],
      },
      {
        name: 'Seward',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Seward (City)',
          },
        ],
      },
      {
        name: 'Shungnak',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Shungnak (City)',
          },
        ],
      },
      {
        name: 'St. George',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'St. George (City)',
          },
        ],
      },
      {
        name: 'St. Paul',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'St. Paul (City)',
          },
        ],
      },
      {
        name: 'Tanana',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Tanana (City)',
          },
        ],
      },
      {
        name: 'Unalaska',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Unalaska (City)',
          },
        ],
      },
      {
        name: 'Utqiagvik',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Utqiagvik (City)',
          },
        ],
      },
      {
        name: 'Valdez',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Valdez (City)',
          },
        ],
      },
      {
        name: 'Wrangell',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wrangell (City)',
          },
        ],
      },
      {
        name: 'Yakutat',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Yakutat (City)',
          },
        ],
      },
    ],
  },
  California: {
    counties: [
      {
        name: 'Orange',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Fountain Valley (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Garden Grove (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'La Habra (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'La Palma (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Los Alamitos (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Orange County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Placentia (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Santa Ana (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Seal Beach (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Stanton (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Westminster (City)',
          },
        ],
      },
      {
        name: 'Placer',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Loomis (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Roseville (City)',
          },
        ],
      },
      {
        name: 'Riverside',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Blythe (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Cathedral City (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Coachella (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Corona (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Hemet (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Indio (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'La Quinta (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lake Elsinore (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Menifee (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Murrieta (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Norco (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Palm Springs (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Riverside County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Riverside (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Jacinto (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Temecula (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wildomar (City)',
          },
        ],
      },
      {
        name: 'Sacramento',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Elk Grove (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Galt (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Isleton (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Rancho Cordova (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sacramento County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sacramento (City)',
          },
        ],
      },
      {
        name: 'San Benito',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Hollister (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Benito County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Juan Bautista (City)',
          },
        ],
      },
      {
        name: 'San Bernardino',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Barstow (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Chino (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Colton (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Montclair (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ontario (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Redlands (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Bernardino County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Bernardino (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Victorville (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Yucca Valley (City)',
          },
        ],
      },
      {
        name: 'San Diego',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Chula Vista (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Del Mar (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'El Cajon (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Imperial Beach (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'La Mesa (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'National City (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Oceanside (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Diego County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Solana Beach (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Vista (City)',
          },
        ],
      },
      {
        name: 'San Francisco',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Francisco County District Tax SP (Special)',
          },
        ],
      },
      {
        name: 'San Joaquin',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lathrop (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lodi (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Manteca (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Joaquin County District Tax SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Stockton (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Tracy (City)',
          },
        ],
      },
      {
        name: 'San Luis Obispo',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Arroyo Grande (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Atascadero (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Grover Beach (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Morro Bay (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Paso Robles (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Pismo Beach (City)' },
          { name: 'Sales and use tax', jurisdiction: 'San Luis Obispo (City)' },
        ],
      },
      {
        name: 'San Mateo',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Belmont (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Brisbane (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Burlingame (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Daly City (City)' },
          { name: 'Sales and use tax', jurisdiction: 'East Palo Alto (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Pacifica (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Redwood City (City)' },
          { name: 'Sales and use tax', jurisdiction: 'San Bruno (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'San Mateo County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'San Mateo (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'South San Francisco (City)',
          },
        ],
      },
      {
        name: 'Santa Barbara',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Carpinteria (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Goleta (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Guadalupe (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Lompoc (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Santa Barbara County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'Santa Barbara (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Santa Maria (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Solvang (City)' },
        ],
      },
      {
        name: 'Santa Clara',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Campbell (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Los Gatos (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Milpitas (City)' },
          { name: 'Sales and use tax', jurisdiction: 'San Jose (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Santa Clara County District Tax SP (Special)',
          },
        ],
      },
      {
        name: 'Santa Cruz',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Capitola (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Santa Cruz County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'Santa Cruz (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Scotts Valley (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Watsonville (City)' },
        ],
      },
      {
        name: 'Shasta',
        type: 'County',
        taxes: [{ name: 'Sales and use tax', jurisdiction: 'Anderson (City)' }],
      },
      {
        name: 'Siskiyou',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Dunsmuir (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Mt. Shasta (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Weed (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Yreka (City)' },
        ],
      },
      {
        name: 'Solano',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Benicia (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Fairfield (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Rio Vista (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Solano County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'Suisun City (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Vacaville (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Vallejo (City)' },
        ],
      },
      {
        name: 'Sonoma',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Cotati (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Healdsburg (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Petaluma (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Rohnert Park (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Santa Rosa (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Sebastopol (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sonoma County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'Sonoma (City)' },
        ],
      },
      {
        name: 'Stanislaus',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Ceres (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Modesto (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Oakdale (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Stanislaus County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'Turlock (City)' },
        ],
      },
      {
        name: 'Tehama',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Corning (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Red Bluff (City)' },
        ],
      },
      {
        name: 'Tulare',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Dinuba (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Exeter (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Farmersville (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Lindsay (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Porterville (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Tulare (City)' },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Tulare County District Tax SP (Special)',
          },
          { name: 'Sales and use tax', jurisdiction: 'Visalia (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Woodlake (City)' },
        ],
      },
      {
        name: 'Tuolumne',
        type: 'County',
        taxes: [{ name: 'Sales and use tax', jurisdiction: 'Sonora (City)' }],
      },
      {
        name: 'Ventura',
        type: 'County',
        taxes: [
          { name: 'Sales and use tax', jurisdiction: 'Camarillo (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Moorpark (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Oxnard (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Santa Paula (City)' },
          { name: 'Sales and use tax', jurisdiction: 'Thousand Oaks (City)' },
        ],
      },
    ],
  },
  Colorado: {
    counties: [
      {
        name: 'Colorado',
        type: 'State',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Colorado',
          },
        ],
      },
      {
        name: 'Adams',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Arvada (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Brighton (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Commerce City (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Federal Heights (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Northglenn (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Thornton (City)',
          },
        ],
      },
      {
        name: 'Arapahoe',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Aurora (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Centennial (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Cherry Hills Village (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Deer Trail (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Englewood (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Glendale (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Greenwood Village (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sheridan (City)',
          },
        ],
      },
      {
        name: 'Boulder',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Boulder (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lafayette (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Louisville (City)',
          },
        ],
      },
      {
        name: 'Broomfield Arista SP',
        type: 'Special',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Broomfield Arista SP (Special)',
          },
        ],
      },
      {
        name: 'Broomfield Flatirons Lid',
        type: 'Special',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Broomfield Flatirons Lid (Special)',
          },
        ],
      },
      {
        name: 'Broomfield',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Broomfield (City)',
          },
        ],
      },
      {
        name: 'Delta',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Delta (City)',
          },
        ],
      },
      {
        name: 'Denver',
        type: 'City',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Denver (City)',
          },
        ],
      },
      {
        name: 'Douglas',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Castle Pines North (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Castle Rock (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Littleton (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lone Tree (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Parker (City)',
          },
        ],
      },
      {
        name: 'Eagle',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Avon (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Gypsum (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Vail (City)',
          },
        ],
      },
      {
        name: 'El Paso',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Colorado Springs (City)',
          },
        ],
      },
      {
        name: 'Garfield',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Glenwood Springs (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Rifle (City)',
          },
        ],
      },
      {
        name: 'Gilpin',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Black Hawk (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Central City (City)',
          },
        ],
      },
      {
        name: 'Grand',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Winter Park (City)',
          },
        ],
      },
      {
        name: 'Gunnison',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Crested Butte (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Gunnison (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Mount Crested Butte (City)',
          },
        ],
      },
      {
        name: 'Jefferson',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Golden (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lakewood (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Westminster (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wheat Ridge (City)',
          },
        ],
      },
      {
        name: 'La Plata',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Durango (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wheat Ridge (City)',
          },
        ],
      },
      {
        name: 'Larimer',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Fort Collins (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Loveland (City)',
          },
        ],
      },
      {
        name: 'Logan',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sterling (City)',
          },
        ],
      },
      {
        name: 'Mesa',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Grand Junction (City)',
          },
        ],
      },
      {
        name: 'Moffat',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Craig (City)',
          },
        ],
      },
      {
        name: 'Montezuma County',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Cortez (City)',
          },
        ],
      },
      {
        name: 'Montrose',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Montrose (City)',
          },
        ],
      },
      {
        name: 'Ouray',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ridgway (City)',
          },
        ],
      },
      {
        name: 'Pitkin',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Aspen (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Snowmass Village (City)',
          },
        ],
      },
      {
        name: 'Prowers',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lamar (City)',
          },
        ],
      },
      {
        name: 'Pueblo',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Pueblo (City)',
          },
        ],
      },
      {
        name: 'Routt',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Steamboat Springs (City)',
          },
        ],
      },
      {
        name: 'San Miguel',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Mountain Village (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Telluride (City)',
          },
        ],
      },
      {
        name: 'Summit',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Breckenridge (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Frisco (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Silverthorne (City)',
          },
        ],
      },
      {
        name: 'Teller',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Woodland Park (City)',
          },
        ],
      },
      {
        name: 'Weld',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Dacono (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Evans (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Greeley (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Longmont (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Timnath (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Windsor (City)',
          },
        ],
      },
    ],
  },
  Idaho: {
    counties: [
      {
        name: 'Idaho',
        type: 'State',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Idaho (State)',
          },
        ],
      },
      {
        name: 'Ada',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Boise Auditorium District SP (Special)',
          },
        ],
      },
      {
        name: 'Bannock',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Lava Hot Springs (City)',
          },
        ],
      },
      {
        name: 'Blaine',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Hailey (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ketchum (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sun Valley (City)',
          },
        ],
      },
      {
        name: 'Boise',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Crouch (City)',
          },
        ],
      },
      {
        name: 'Bonner',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ponderay (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sandpoint (City)',
          },
        ],
      },
      {
        name: 'Bonneville',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Idaho Falls Auditorium District SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Irwin (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Swan Valley (City)',
          },
        ],
      },
      {
        name: 'Boundary',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Bonners Ferry (City)',
          },
        ],
      },
      {
        name: 'Custer',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Mackay (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Stanley (City)',
          },
        ],
      },
      {
        name: 'Idaho',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Riggins (City)',
          },
        ],
      },
      {
        name: 'Kootenai',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Harrison (City)',
          },
        ],
      },
      {
        name: 'Lemhi',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Salmon (City)',
          },
        ],
      },
      {
        name: 'Power',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Pocatello Chubbuck Auditorium District SP (Special)',
          },
        ],
      },
      {
        name: 'Shoshone',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Kellogg (City)',
          },
        ],
      },
      {
        name: 'Teton',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Driggs (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Victor (City)',
          },
        ],
      },
      {
        name: 'Valley',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Cascade (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Donnelly In City Sales (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Mccall (City)',
          },
        ],
      },
    ],
  },
  Wisconsin: {
    counties: [
      {
        name: 'Wisconsin',
        type: 'State',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wisconsin (State)',
          },
        ],
      },
      {
        name: 'Adams',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wisconsin Dells (City)',
          },
        ],
      },
      {
        name: 'Bayfield',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Bayfield (City)',
          },
        ],
      },
      {
        name: 'Door',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Ephraim (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Sister Bay (Special)',
          },
        ],
      },
      {
        name: 'Oneida',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Eagle River (City)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Rhinelander (City)',
          },
        ],
      },
      {
        name: 'Pepin',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Stockholm (Special)',
          },
        ],
      },
    ],
  },
  Wyoming: {
    counties: [
      {
        name: 'Wyoming',
        type: 'State',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Wyoming (State)',
          },
        ],
      },
      {
        name: 'Teton',
        type: 'County',
        taxes: [
          {
            name: 'Sales and use tax',
            jurisdiction: 'Grand Targhee Resort District SP (Special)',
          },
          {
            name: 'Sales and use tax',
            jurisdiction: 'Teton Village Resort District SP (Special)',
          },
        ],
      },
    ],
  },
};

// Define an interface for the local taxes of each state
interface StateLocalTaxes {
  [stateName: string]: string[];
}

// Define the localTaxes object using the StateLocalTaxes interface
export const localTaxes: StateLocalTaxes = {
  'New Jersey': [
    'New Jersey',
    'New Jersey Motorsports Park',
    'Adamsville',
    'Adamsville PJ',
  ],
  Alabama: [
    'Abbeville',
    'Abbeville PJ',
    'Adamsville',
    'Adamsville PJ',
    'Addison',
    'Addison PJ',
    'Akron',
    'Akron PJ',
    'Alabaster',
    'Albertville',
    'Albertville PJ',
    'Alexander City',
    'Alexander City UN',
    'Aliceville',
    'Aliceville PJ',
    'Allgood',
    'Allgood PJ',
    'Altoona',
    'Altoona PJ',
    'Andalusia',
    'Anderson',
    'Anderson PJ',
    'Anniston',
    'Anniston PJ',
    'Arab',
    'Arab PJ',
    'Ardmore',
    'Argo (Jefferson Co)',
    'Ariton',
    'Ariton PJ',
    'Arley',
    'Arley PJ',
    'Ashford',
    'Ashford PJ',
    'Ashland',
    'Ashland PJ',
    'Ashville',
    'Ashville PJ',
    'Athens',
    'Atmore',
    'Atmore PJ',
    'Attalla',
    'Auburn',
    'Autauga',
    'Autaugaville',
    'Baker Hill',
    'Baker Hill PJ',
    'Baldwin',
    'Banks',
    'Barbour',
    'Bay Minette',
    'Bay Minette PJ',
    'Bayou La Batre',
    'Bayou La Batre PJ',
    'Bear Creek',
    'Bear Creek PJ',
    'Beatrice',
    'Beatrice PJ',
    'Beaverton',
    'Beaverton PJ',
    'Belk',
    'Berry',
    'Berry PJ',
    'Bessemer',
    'Bibb',
    'Billingsley',
    'Birmingham',
    'Black',
    'Black PJ',
    'Blount',
    'Blountsville',
    'Blountsville PJ',
    'Blue Springs',
    'Boaz',
    'Boligee',
    'Boligee PJ',
    'Brantley',
    'Brantley PJ',
    'Brent',
    'Brewton',
    'Brewton PJ',
    'Bridgeport',
    'Bridgeport PJ',
    'Brighton',
    'Brighton PJ',
    'Brilliant',
    'Brilliant PJ',
    'Brookside',
    'Brookwood',
    'Brookwood PJ',
    'Brundidge',
    'Brundidge PJ',
    'Bullock',
    'Butler',
    'Butler PJ',
    'Calera',
    'Calera PJ (Shelby Co)',
    'Calhoun',
    'Camden',
    'Camden PJ',
    'Camp Hill',
    'Camp Hill PJ',
    'Carbon Hill',
    'Carbon Hill PJ',
    'Cardiff',
    'Carrollton',
    'Carrollton PJ',
    'Castleberry',
    'Castleberry PJ',
    'Cedar Bluff',
    'Center Point',
    'Centre',
    'Centreville',
    'Centreville PJ',
    'Chambers',
    'Chatom',
    'Chatom PJ',
    'Chelsea',
    'Cherokee',
    'Cherokee PJ',
    'Cherokee Ridge',
    'Chickasaw',
    'Chickasaw PJ',
    'Childersburg',
    'Childersburg PJ',
    'Chilton',
    'Choctaw',
    'Citronelle',
    'Citronelle PJ',
    'Clanton',
    'Clarke',
    'Clay',
    'Clayhatchee',
    'Clayhatchee PJ',
    'Clayton',
    'Clayton PJ',
    'Cleburne',
    'Cleveland',
    'Cleveland PJ',
    'Clio',
    'Clio PJ',
    'Coaling',
    'Coaling PJ',
    'Coffee',
    'Coffee Springs',
    'Coffeeville',
    'Coffeeville PJ',
    'Coker',
    'Coker UN',
    'Colbert',
    'Collinsville (Cherokee Co)',
    'Collinsville PJ (Cherokee Co)',
    'Columbia',
    'Columbia PJ',
    'Columbiana',
    'Conecuh',
    'Coosa',
    'Coosada',
    'Coosada PJ',
    'Cordova',
    'Cordova PJ',
    'Cottonwood',
    'Cottonwood PJ',
    'County Line',
    'Courtland',
    'Courtland PJ',
    'Covington',
    'Cowarts',
    'Crenshaw',
    'Creola',
    'Creola PJ',
    'Crossville',
    'Crossville PJ',
    'Cuba',
    'Cuba PJ',
    'Cullman',
    'Cusseta',
    'Cusseta UN',
    'Dadeville',
    'Dale',
    'Daleville',
    'Daleville PJ',
    'Dallas',
    'Daphne',
    'Dauphin Island',
    'Dauphin Island PJ',
    'Daviston',
    'Daviston PJ',
    'De Kalb',
    'Deatsville',
    'Decatur',
    'Decatur PJ',
    'Demopolis',
    'Demopolis PJ',
    'Detroit',
    'Detroit PJ',
    'Dodge City',
    'Dora',
    'Dothan',
    'Double Springs',
    'Double Springs PJ',
    'Douglas',
    'Douglas PJ',
    'Dozier',
    'Dozier PJ',
    'Dutton',
    'East Brewton',
    'East Brewton PJ',
    'Eclectic',
    'Eclectic PJ',
    'Edwardsville',
    'Edwardsville PJ UN',
    'Elba',
    'Elba PJ',
    'Elberta',
    'Elberta PJ',
    'Eldridge',
    'Eldridge PJ',
    'Elkmont',
    'Elmore',
    'Elmore PJ',
    'Emelle',
    'Enterprise',
    'Enterprise PJ',
    'Escambia',
    'Ethelsville',
    'Etowah',
    'Eufaula',
    'Eutaw',
    'Eutaw PJ',
    'Eva',
    'Evergreen (Conecuh County)',
    'Evergreen PJ',
    'Excel',
    'Excel PJ',
    'Fairfield',
    'Fairfield PJ',
    'Fairhope',
    'Fairhope UN',
    'Fairview',
    'Falkville',
    'Falkville PJ',
    'Faunsdale',
    'Faunsdale PJ',
    'Fayette',
    'Fayette PJ',
    'Five Points',
    'Five Points UN',
    'Flomaton',
    'Flomaton PJ',
    'Florala',
    'Florala PJ',
    'Florence',
    'Foley',
    'Foley PJ',
    'Forkland',
    'Forkland PJ',
    'Fort Deposit',
    'Fort Deposit UN',
    'Fort Payne',
    'Franklin',
    'Franklin PJ',
    'Frisco City',
    'Frisco City PJ',
    'Fruithurst',
    'Fulton',
    'Fulton PJ',
    'Fultondale',
    'Fultondale PJ',
    'Fyffe',
    'Fyffe PJ',
    'Gadsden',
    'Gainesville',
    'Gainesville UN',
    'Gantt',
    'Gantt PJ',
    'Garden City',
    'Gardendale',
    'Gaylesville',
    'Gaylesville PJ',
    'Geiger',
    'Geiger PJ',
    'Geneva',
    'Geneva PJ',
    'Georgiana',
    'Georgiana PJ',
    'Geraldine',
    'Geraldine PJ',
    'Gilbertown',
    'Gilbertown PJ',
    'Glen Allen',
    'Glencoe',
    'Glencoe PJ',
    'Glenwood',
    'Glenwood PJ',
    'Goldville',
    'Goldville UN',
    'Good Hope',
    'Goodwater',
    'Goodwater PJ',
    'Gordo',
    'Gordo PJ',
    'Gordon',
    'Gordon PJ',
    'Gordonville',
    'Goshen',
    'Goshen PJ',
    'Grant',
    'Grant PJ',
    'Graysville',
    'Greene',
    'Greensboro',
    'Greensboro PJ',
    'Greenville',
    'Grimes',
    'Grimes PJ',
    'Grove Hill',
    'Grove Hill PJ',
    'Guin',
    'Guin PJ',
    'Gulf Shores',
    'Gulf Shores PJ',
    'Guntersville',
    'Guntersville PJ',
    'Gurley',
    'Hackleburg',
    'Hackleburg PJ',
    'Hale',
    'Haleburg',
    'Haleyville',
    'Haleyville PJ',
    'Hamilton',
    'Hamilton PJ',
    'Hammondville',
    'Hammondville PJ',
    'Hanceville',
    'Hanceville UN',
    'Harpersville',
    'Harpersville PJ',
    'Hartford',
    'Hartford PJ',
    'Hartselle',
    'Hayden',
    'Hayden PJ',
    'Hayneville',
    'Hazel Green',
    'Headland',
    'Heath',
    'Heath PJ',
    'Heflin',
    'Helena',
    'Henagar',
    'Higdon',
    'Highland Home',
    'Highland Home PJ',
    'Hillsboro',
    'Hillsboro PJ',
    'Hobson City',
    'Hobson City PJ',
    'Hodges',
    'Hodges PJ',
    'Hokes Bluff',
    'Hokes Bluff PJ',
    'Holly Pond',
    'Holly Pond PJ',
    'Hollywood',
    'Hollywood PJ',
    'Holtville',
    'Homewood',
    'Hoover',
    'Hoover PJ',
    'Horn Hill',
    'Horn Hill PJ',
    'Hueytown',
    'Hueytown PJ',
    'Huguley',
    'Huguley UN',
    'Huntsville',
    'Hurtsboro',
    'Hurtsboro PJ',
    'Hytop',
    'Ider',
    'Ider PJ',
    'Indian Springs Village',
    'Indian Springs Village PJ',
    'Irondale',
    'Irondale PJ',
    'Jackson',
    'Jackson PJ',
    'Jacksonville',
    'Jacksonville PJ',
    'Jasper',
    'Jasper PJ',
    'Jefferson',
    'Jemison',
    'Jemison PJ',
    'La Fayette',
    'La Fayette PJ',
    'Laceys Spring',
    'Laceys Spring PJ',
    'Lamar',
    'Lanett',
    'Langston',
    'Langston PJ',
    'Leesburg',
    'Leesburg PJ',
    'Leighton',
    'Leighton PJ',
    'Lester',
    'Lester PJ',
    'Level Plains',
    'Level Plains PJ',
    'Lexington',
    'Libertyville',
    'Libertyville PJ',
    'Limestone',
    'Lincoln',
    'Lincoln PJ',
    'Linden',
    'Linden PJ',
    'Lineville',
    'Lineville PJ',
    'Lisman',
    'Lisman PJ',
    'Littleville',
    'Littleville PJ',
    'Livingston',
    'Livingston PJ',
    'Loachapoka',
    'Lockhart',
    'Lockhart PJ',
    'Lowndes',
    'Lowndesboro',
    'Lowndesboro PJ',
    'Loxley',
    'Loxley PJ',
    'Luverne',
    'Luverne PJ',
    'Lynn',
    'Lynn PJ',
    'Macon',
    'Madison',
    'Madison (Limestone Co)',
    'Madison PJ',
    'Malvern',
    'Malvern PJ',
    'Maplesville',
    'Maplesville PJ',
    'Marengo',
    'Margaret',
    'Margaret PJ',
    'Marion',
    'Marion Junction',
    'Marion Junction PJ',
    'Marshall',
    'Mathews',
    'Mathews PJ',
    'Maytown',
    'McIntosh',
    'McIntosh PJ',
    'McKenzie',
    'McKenzie PJ',
    'McMullen',
    'Mentone',
    'Mentone PJ',
    'Meridianville',
    'Midfield',
    'Midland City',
    'Midland City PJ',
    'Midway',
    'Midway PJ',
    'Millbrook',
    'Millport',
    'Millport PJ',
    'Millry',
    'Millry PJ',
    'Mobile',
    'Mon Louis Island',
    'Mon Louis Island PJ',
    'Monroe',
    'Monroeville',
    'Monroeville PJ',
    'Montevallo',
    'Montevallo PJ',
    'Montgomery',
    'Moody',
    'Moody PJ',
    'Moores Mill',
    'Moores Mill PJ',
    'Morris',
    'Morris PJ',
    'Moulton',
    'Moulton PJ',
    'Moundville',
    'Moundville PJ',
    'Mountain Brook',
    'Mountain Brook PJ',
    'Mount Vernon',
    'Mount Vernon PJ',
    'Mulga',
    'Munford',
    'Munford PJ',
    'Muscle Shoals',
    'Myrtlewood',
    'Myrtlewood PJ',
    'Nances Creek',
    'Nances Creek PJ',
    'Napier Field',
    'Napier Field PJ',
    'Natural Bridge',
    'Nauvoo',
    'Nauvoo PJ',
    'Nectar',
    'Needham',
    'Needham PJ',
    'Newbern',
    'Newbern PJ',
    'New Brockton',
    'New Brockton PJ',
    'New Hope',
    'New Market',
    'New Market PJ',
    'New Site',
    'New Site PJ',
    'Newton',
    'Newton PJ',
    'Newville',
    'Newville PJ',
    'North Courtland',
    'North Courtland PJ',
    'Northport',
    'Northport PJ',
    'Notasulga',
    'Notasulga PJ',
    'Oak Grove (Jefferson Co)',
    'Oak Hill',
    'Oak Hill PJ',
    'Oakman',
    'Oakman PJ',
    'Odenville',
    'Odenville PJ',
    'Ohatchee',
    'Ohatchee PJ',
    'Oneonta',
    'Oneonta PJ',
    'Opelika',
    'Opp',
    'Opp PJ',
    'Orange Beach',
    'Orange Beach PJ',
    'Orrville',
    'Orrville PJ',
    'Owens Cross Roads',
    'Oxford',
    'Oxford PJ',
    'Ozark',
    'Ozark PJ',
    'Paint Rock',
    'Paint Rock PJ',
    'Palmerdale',
    'Palmerdale PJ',
    'Parrish',
    'Parrish PJ',
    'Pelham',
    'Pelham PJ',
    'Pell City',
    'Pell City PJ',
    'Pennington',
    'Pennington PJ',
    'Peterman',
    'Peterman PJ',
    'Petrey',
    'Petrey PJ',
    'Phenix City',
    'Phil Campbell',
    'Phil Campbell PJ',
    'Pickens',
    'Pickensville',
    'Pickensville PJ',
    'Piedmont',
    'Piedmont PJ',
    'Pike',
    'Pike Road',
    'Pinckard',
    'Pinckard PJ',
    'Pine Apple',
    'Pine Hill',
    'Pine Hill PJ',
    'Pine Level',
    'Pine Level PJ',
    'Pisgah',
    'Pisgah PJ',
    'Pleasant Grove',
    'Pleasant Grove PJ',
    'Pleasant Hill',
    'Pleasant Hill PJ',
    'Point Clear',
    'Point Clear PJ',
    'Pollard',
    'Pollard PJ',
    'Powell',
    'Powell PJ',
    'Prattville',
    'Priceville',
    'Priceville PJ',
    'Prichard',
    'Prichard PJ',
    'Providence',
    'Ragland',
    'Ragland PJ',
    'Rainbow City',
    'Rainbow City PJ',
    'Rainsville',
    'Rainsville PJ',
    'Ranburne',
    'Ranburne PJ',
    'Red Bay',
    'Red Bay PJ',
    'Red Level',
    'Red Level PJ',
    'Redstone Arsenal',
    'Reece City',
    'Reece City PJ',
    'Reform',
    'Reform PJ',
    'Rehobeth',
    'Rehobeth PJ',
    'Repton',
    'Repton PJ',
    'Ridgeville',
    'Ridgeville PJ',
    'River Falls',
    'River Falls PJ',
    'Riverside',
    'Riverside PJ',
    'Roanoke',
    'Robertsdale',
    'Robertsdale PJ',
    'Rockford',
    'Rockford PJ',
    'Rock Mills',
    'Rock Mills PJ',
    'Rogersville',
    'Rogersville PJ',
    'Rosa',
    'Rosa PJ',
    'Russellville',
    'Russellville PJ',
    'Rutledge',
    'Rutledge PJ',
    'Saks',
    'Saks PJ',
    'Samson',
    'Samson PJ',
    'Sand Rock',
    'Sand Rock PJ',
    'Saraland',
    'Saraland PJ',
    'Sardis City',
    'Satsuma',
    'Satsuma PJ',
    'Scottsboro',
    'Scottsboro PJ',
    'Section',
    'Section PJ',
    'Selma',
    'Selma PJ',
    'Semmes',
    'Semmes PJ',
    'Sheffield',
    'Sheffield PJ',
    'Shelby',
    "Shepherd's Crossroads",
    'Shorter',
    'Shorter PJ',
    'Silverhill',
    'Silverhill PJ',
    'Sipsey',
    'Sipsey PJ',
    'Skyline',
    'Slocomb',
    'Slocomb PJ',
    'Smiths Station',
    'Smiths Station PJ',
    'Snead',
    'Snead PJ',
    'Somerville',
    'Somerville PJ',
    'Southside',
    'Southside PJ',
    'Spanish Fort',
    'Spanish Fort PJ',
    'Springville',
    'Springville PJ',
    'Spring Hill',
    'Spring Hill PJ',
    'St. Clair',
    'St. Florian',
    'St. Florian PJ',
    'Steele',
    'Steele PJ',
    'Sterrett',
    'Sterrett PJ',
    'Stevenson',
    'Stevenson PJ',
    'Stewartville',
    'Stewartville PJ',
    'Sulligent',
    'Sulligent PJ',
    'Sumiton',
    'Sumiton PJ',
    'Summerdale',
    'Summerdale PJ',
    'Sumter',
    'Susan Moore',
    'Sweet Water',
    'Sweet Water PJ',
    'Sylacauga',
    'Sylacauga PJ',
    'Sylvania',
    'Sylvania PJ',
    'Talladega',
    'Talladega PJ',
    'Talladega Springs',
    'Tallassee',
    'Tallassee PJ',
    'Tarrant',
    'Tarrant PJ',
    'Taylorsville',
    'Taylorsville PJ',
    'Tharptown',
    'Tharptown PJ',
    'Theodore',
    'Thomasville',
    'Thomasville PJ',
    'Thomaston',
    'Thomaston PJ',
    'Thorsby',
    'Thorsby PJ',
    'Tillmans Corner',
    'Town Creek',
    'Town Creek PJ',
    'Toxey',
    'Toxey PJ',
    'Trafford',
    'Trafford PJ',
    'Triana',
    'Triana PJ',
    'Trinity',
    'Trinity PJ',
    'Troy',
    'Trussville',
    'Trussville PJ',
    'Tuscaloosa',
    'Tuscaloosa PJ',
    'Tuscumbia',
    'Tuscumbia PJ',
    'Tuskegee',
    'Tuskegee PJ',
    'Twin',
    'Twin PJ',
    'Union',
    'Union Grove',
    'Union Grove PJ',
    'Union Springs',
    'Union Springs PJ',
    'Uniontown',
    'Uniontown PJ',
    'Uriah',
    'Uriah PJ',
    'Valley',
    'Valley Grande',
    'Valley Grande PJ',
    'Vance',
    'Vance PJ',
    'Verbena',
    'Vernon',
    'Vernon PJ',
    'Vestavia Hills',
    'Vestavia Hills PJ',
    'Vincent',
    'Vincent PJ',
    'Vina',
    'Vina PJ',
    'Vincent',
    'Vincent PJ',
    'Vinemont',
    'Vinemont PJ',
    'Vredenburgh',
    'Vredenburgh PJ',
    'Walnut Grove',
    'Walnut Grove PJ',
    'Warrior',
    'Warrior PJ',
    'Waterloo',
    'Waterloo PJ',
    'Watson',
    'Watson PJ',
    'Waverly',
    'Weaver',
    'Weaver PJ',
    'Webb',
    'Webb PJ',
    'Wedowee',
    'Wedowee PJ',
    'West Blocton',
    'West Blocton PJ',
    'West End-Cobb Town',
    'West End-Cobb Town PJ',
    'Westover',
    'Westover PJ',
    'Wetumpka',
    'Wetumpka PJ',
    'Whatley',
    'Whatley PJ',
    'White Hall',
    'White Hall PJ',
    'Wilsonville',
    'Wilsonville PJ',
    'Wilton',
    'Wilton PJ',
    'Winfield',
    'Winfield PJ',
    'Woodland',
    'Woodland PJ',
    'Woodstock',
    'Woodstock PJ',
    'Woodville',
    'Woodville PJ',
    'Yellow Bluff',
    'Yellow Bluff PJ',
    'York',
    'York PJ',
  ],
  // Add more states and their respective local taxes as needed
};
