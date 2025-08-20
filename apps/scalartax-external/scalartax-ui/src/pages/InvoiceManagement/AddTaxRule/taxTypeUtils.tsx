import { useState, useEffect } from "react";

export interface SubTaxType {
  value: string;
  label: string;
}

export interface RateType {
  value: string;
  label: string;
}

export interface JurisdictionType {
  value: string;
  label: string;
}

export interface RegionType {
  value: string;
  label: string;
}

export const useTaxTypeHandler = (formik: any) => {
  const [availableSubTaxTypes, setAvailableSubTaxTypes] = useState<SubTaxType[]>([]);
  const [availableRateTypes, setAvailableRateTypes] = useState<RateType[]>([]);
  const [availablejurisdictionValues, setAvailableJurisdictionValues] = useState<JurisdictionType[]>([]);
  const [disableJurisdiction, setDisableJurisdiction] = useState<boolean>(false);
  const [availableRegionValues, setAvailableRegionValues] = useState<RegionType[]>([]);
  const rateTypes: RateType[] = [
    { value: "H", label: "Agricultural" },
    { value: "Alcohol", label: "Alcohol" },
    { value: "*", label: "All" },
    { value: "C", label: "Amusement" },
    { value: "A", label: "Automobile Rental" },
    { value: "AutomobileSales", label: "Automobile Sales" },
    { value: "E", label: "Commercial Real Property Rental." },
    { value: "N", label: "Construction" },
    { value: "D", label: "Digital" },
    { value: "F", label: "Food" },
    { value: "FuelIncreased", label: "Fuel - Increased" },
    { value: "FuelReduced", label: "Fuel - Reduced" },
    { value: "General", label: "General" },
    { value: "L", label: "Linen Rental" },
    { value: "Lodging", label: "Lodging" },
    { value: "LMP", label: "Lodging Marketplace" },
    { value: "Lodging2", label: "Lodging2" },
    { value: "Luxury", label: "Luxury" },
    { value: "I", label: "Manufacturing" },
    { value: "M", label: "Medical" },
    { value: "Occupancy", label: "Occupancy" },
    { value: "Parking", label: "Parking" },
    { value: "P", label: "Prepared Food And Beverage" },
    { value: "Reduced", label: "Reduced" },
    { value: "R", label: "Rental" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "X", label: "Services" },
    { value: "S", label: "Soft Drinks" },
    { value: "Tobacco", label: "Tobacco" },
    { value: "V", label: "Vapor" },
  ];

  const rateTypesforCu: RateType[] = [
    { value: "H", label: "Agricultural" },
    { value: "Alcohol", label: "Alcohol" },
    { value: "C", label: "Amusement" },
    { value: "AutomobileSales", label: "Automobile Sales" },
    { value: "E", label: "Commercial Real Property Rental." },
    { value: "D", label: "Digital" },
    { value: "F", label: "Food" },
    { value: "FuelIncreased", label: "Fuel - Increased" },
    { value: "FuelReduced", label: "Fuel - Reduced" },
    { value: "G", label: "General" },
    { value: "Luxury", label: "Luxury" },
    { value: "I", label: "Manufacturing" },
    { value: "M", label: "Medical" },
    { value: "P", label: "Prepared Food And Beverage" },
    { value: "Reduced", label: "Reduced" },
    { value: "X", label: "Services" },
  ]

  const handleTaxTypeChange = (taxType: string): void => {
    let subTaxTypes: SubTaxType[] = [];

    switch (taxType) {
      case "Consumer Use":
        subTaxTypes = [{ value: "consumerUse", label: "Consumer Use" }];
        break;
      case "Rent To Own":
        subTaxTypes = [{ value: "rentToOwn", label: "Rent To Own" }];
        break;
      case "Sales": // Sales
        subTaxTypes = [
          { value: "deliveryFee", label: "Delivery Fee" },
          { value: "S", label: "Sales" },
          { value: "SS", label: "Supplementary Sales Tax" },
        ];
        break;
      case "All": // Sales and Use
        subTaxTypes = [];
        break;
      case "Use":
        subTaxTypes = [
          { value: "deliveryFee", label: "Delivery Fee" },
          { value: "remoteSeller", label: "Remote Seller" },
          { value: "sellersUse", label: "Sellers Use" },
        ];
        break;
      default:
        subTaxTypes = []; // Default for other cases
        break;
    }

    setAvailableSubTaxTypes(subTaxTypes);

    // Clear sub-tax type if no options are available
    if (!subTaxTypes.length) {
      formik.setFieldValue("taxSubType", "");
    }
  };

  const handleSubTaxTypeChange = (taxType: string, subTaxType: string): void => {
    let applicableRateTypes: RateType[] = [];

    if (taxType === "Consumer Use") {
      if (subTaxType === "consumerUse") {
        applicableRateTypes = rateTypesforCu
      }
    }
    else if (taxType === "All") {
      applicableRateTypes = rateTypes
    }
    else if (taxType === "Rent To Own") {
      if (subTaxType === "rentToOwn") {
        applicableRateTypes = rateTypes.filter((rate) => rate.value === "G");
      }
    }
    else if (taxType === "Sales") {
      if (subTaxType === "deliveryFee") {
        applicableRateTypes = rateTypes.filter((rate) => rate.value === "G");
      } else if (subTaxType === "S") {
        applicableRateTypes = rateTypes;
      } else if (subTaxType === "SS") {
        applicableRateTypes = rateTypes.filter(
          (rate) => rate.value === "G" || rate.value === "V"
        );
      }
    } else if (taxType === "Use") {
      if (subTaxType === "deliveryFee" || subTaxType === "remoteSeller") {
        applicableRateTypes = rateTypes.filter((rate) => rate.value === "G");
      }
      else if (subTaxType === "sellersUse") {
        applicableRateTypes = rateTypes;
      }
    }

    setAvailableRateTypes(applicableRateTypes);

    // Reset rate type field if no applicable rate types
    if (!applicableRateTypes.length) {
      formik.setFieldValue("rateType", "");
    }
  };

  const handleRateTypeChange = (taxType: string, subTaxType: string, rateType: string): void => {
    let jurisdictionValues: JurisdictionType[] = [];
    let disableJurisdiction = false;

    if (taxType === "Consumer Use") {
      if (subTaxType === "consumerUse") {
        switch (rateType) {
          case "C":
          case "E":
          case "D":
            jurisdictionValues = [
              { value: "state", label: "State" },
              { value: "city", label: "City" },
              { value: "country", label: "Country" },
              { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
            ];
            disableJurisdiction = true;
            break;
          case "AutomobileSales":
          case "F":
          case "H":
          case "general":
          case "I":
          case "P":
          case "G":
          case "Reduced":
            jurisdictionValues = [
              { value: "state", label: "State" },
              { value: "city", label: "City" },
              { value: "country", label: "Country" },
              { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
            ];
            break;
          case "Alcohol":
          case "X":
            jurisdictionValues = [
              { value: "state", label: "State" },
              { value: "city", label: "City" }
            ];
            break;
          case "FuelIncreased":
            jurisdictionValues = [
              { value: "city", label: "City" },
            ];
            disableJurisdiction = true;
            break;
          case "FuelReduced":
          case "M":
            jurisdictionValues = [
              { value: "state", label: "State" },
              { value: "country", label: "Country" },
            ];
            break;
          case "Luxury":
            jurisdictionValues = [
              { value: "state", label: "State" }
            ];
            disableJurisdiction = true;
            break;
          default:
            break;
        }
      }
    }
    else if (taxType === "RentToOwn" && subTaxType === "rentToOwn" && rateType === "G") {
      jurisdictionValues = [{ value: "state", label: "State" }];
      disableJurisdiction = true;
    }
    else if (taxType === "Sales") {
      switch (subTaxType) {
        case "deliveryFee":
          if (rateType === "G") {
            jurisdictionValues = [{ value: "state", label: "State" }];
            disableJurisdiction = true;
          }
          break;
        case "SS":
          if (rateType === "G") {
            jurisdictionValues = [{ value: "state", label: "State" }, { value: "city", label: "City" }]
          }
          else if (rateType === "V") {
            jurisdictionValues = [{ value: "city", label: "City" }];
            disableJurisdiction = true;
          }
          break;
        case "S":
          switch (rateType) {
            case "C":
            case "AutomobileSales":
            case "E":
            case "N":
            case "D":
            case "F":
            case "H":
            case "G":
            case "L":
            case "Lodging":
            case "I":
            case "M":
            case "P":
            case "Reduced":
            case "R":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "city", label: "City" },
                { value: "country", label: "Country" },
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
              ];
              break;
            case "Alcohol":
            case "LMP":
            case "X":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "city", label: "City" },
                { value: "country", label: "Country" },
              ];
              break;
            case "*":
              jurisdictionValues = [
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
              ];
              break;
            case "A":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "city", label: "City" },
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
              ];
              break;
            case "Tobacco":
              jurisdictionValues = [
                { value: "city", label: "City" },
              ];
              break;
            case "FuelReduced":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "country", label: "Country" },
              ];
              break;
            case "Lodging2":
            case "V":
              jurisdictionValues = [
                { value: "city", label: "City" },
                { value: "state", label: "State" }
              ];
              break;
            case "Parking":
            case "S":
            case "Luxury":
            case "FuelIncreased":
              jurisdictionValues = [
                { value: "state", label: "State" }
              ];
              disableJurisdiction = true;
              break;
            case "Restaurant":
            case "Occupancy":
              jurisdictionValues = [
                { value: "city", label: "City" },
                { value: "country", label: "Country" },
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" }
              ];
              break;

            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    else if (taxType === "Use") {
      switch (subTaxType) {
        case "deliveryFee":
          if (rateType === "G") {
            jurisdictionValues = [{ value: "state", label: "State" }];
            disableJurisdiction = true;
          }
          break;
        case "remoteSeller":
          if (rateType === "G") {
            jurisdictionValues = [{ value: "state", label: "State" }];
            disableJurisdiction = true;
          }
          break;
        case "sellersUse":
          switch (rateType) {
            case "AutomobileSales":
            case "C":
            case "N":
            case "D":
            case "F":
            case "H":
            case "G":
            case "L":
            case "Lodging":
            case "I":
            case "M":
            case "P":
            case "Reduced":
            case "R":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "city", label: "City" },
                { value: "country", label: "Country" },
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
              ];
              break;
            case "Alcohol":
              jurisdictionValues = [{ value: "state", label: "State" },
              { value: "city", label: "City" },]
              break;
            case "LMP":
            case "X":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "city", label: "City" },
                { value: "country", label: "Country" },
              ];
              break;
            case "*":
            case "E":
              jurisdictionValues = [{ value: "state", label: "State" }];
              disableJurisdiction = true;
              break;
            case "A":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "city", label: "City" },
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
              ];
              break;
            case "Tobacco":
              jurisdictionValues = [
                { value: "city", label: "City" },
              ];
              break;
            case "FuelReduced":
              jurisdictionValues = [
                { value: "state", label: "State" },
                { value: "country", label: "Country" },
              ];
              break;
            case "Lodging2":
            case "V":
              jurisdictionValues = [
                { value: "city", label: "City" },
                { value: "state", label: "State" }
              ];
              break;
            case "Parking":
            case "S":
            case "Luxury":
            case "FuelIncreased":
              jurisdictionValues = [
                { value: "state", label: "State" }
              ];
              disableJurisdiction = true;
              break;
            case "Restaurant":
            case "Occupancy":
              jurisdictionValues = [
                { value: "city", label: "City" },
                { value: "country", label: "Country" },
                { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" }
              ];
              break;

            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    else if (taxType === "All") {
      switch (rateType) {
        case "C":
        case "*":
        case "AutomobileSales":
        case "E":
        case "N":
        case "D":
        case "F":
        case "H":
        case "G":
        case "L":
        case "Lodging":
        case "I":
        case "M":
        case "P":
        case "Reduced":
        case "R":
          jurisdictionValues = [
            { value: "state", label: "State" },
            { value: "city", label: "City" },
            { value: "country", label: "Country" },
            { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
          ];
          break;
        case "LMP":
          jurisdictionValues = [
            { value: "state", label: "State" },
            { value: "city", label: "City" },
            { value: "country", label: "Country" },
          ];
          break;
        case "Alcohol":
        case "X":
          jurisdictionValues = [
            { value: "state", label: "State" },
            { value: "city", label: "City" },
            { value: "country", label: "Country" },
          ];
          break;
        case "A":
          jurisdictionValues = [
            { value: "state", label: "State" },
            { value: "city", label: "City" },
            { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" },
          ];
          break;
        case "FuelIncreased":
        case "Tobacco":
          jurisdictionValues = [
            { value: "city", label: "City" },
          ];
          disableJurisdiction = true;
          break;
        case "FuelReduced":
          jurisdictionValues = [
            { value: "state", label: "State" },
            { value: "country", label: "Country" },
          ];
          break;
        case "Lodging2":
        case "V":
          jurisdictionValues = [
            { value: "city", label: "City" },
            { value: "state", label: "State" }
          ];
          break;
        case "Parking":
        case "S":
        case "Luxury":
          jurisdictionValues = [
            { value: "state", label: "State" }
          ];
          disableJurisdiction = true;
          break;
        case "Restaurant":
        case "Occupancy":
          jurisdictionValues = [
            { value: "city", label: "City" },
            { value: "country", label: "Country" },
            { value: "specialTaxableJurisdiction", label: "Special Taxable Jurisdiction" }
          ];
          break;
        default:
          break;
      }
    }

    setAvailableJurisdictionValues(jurisdictionValues);
    setDisableJurisdiction(disableJurisdiction);

    if (!availableRateTypes.length) {
      formik.setFieldValue("rateType", "");
    }

  };


    return {
      availableSubTaxTypes,
      availableRateTypes,
      availablejurisdictionValues,
      disableJurisdiction,
      handleTaxTypeChange,
      handleSubTaxTypeChange,
      handleRateTypeChange,
    };


}
