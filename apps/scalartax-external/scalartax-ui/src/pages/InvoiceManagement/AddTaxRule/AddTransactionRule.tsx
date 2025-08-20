import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Button, Modal, Container, FormCheck, InputGroup } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { addTransactionRule as onAddaddTransactionRule } from '../../../slices/thunk';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import { getEntitiesLocations as onGetEntitiesLocations } from '../../../slices/thunk';


const AddTransactionRule = () => {

    document.title = 'ADD ADVANCED TRANSACTION RULE  | Dashboard';

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [locations, setLocations] = useState<EntityLocation[]>([]);
    interface Operation {
        id: number;
        conditions: { field: string; operator: string; values: string[] }[];
        allocations: { taxCode: string; percentage: number }[];
    }


    interface EntityLocation {
        id: string;
        location_code: string;
        entity_id: string;
        address_type_id: string;
    }


    interface RuleSet {
        id: number,
        conditions: { field: string; operator: string; values: string[] }[];
        allocations: { locationId: string }[]
    }

    interface ReportingRuleSet {
        id: number;
        allocations: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            zipCode: number;
            locationId: string;
        }[];
        conditions: {
            addressTypes: string[];
        }[];
    }

    interface MultipleAllocations {
        id: number;
        conditions: { field: string; operator: string; values: string[] }[];
        allocations: { country: string; addressLine1?: string; addressLine2?: string; city?: string; state?: string; zipCode?: number; percentage: number }[];
    }

    interface NewTransactionRule {
        name: string;
        entity_id: string;
        effectiveDate: string;
        expirationDate: string;
        ruleType: string;
        allocateTaxOnSingleLine?: boolean;
        operations?: Operation[];
        ruleSets?: RuleSet[];
        reportings?: ReportingRuleSet[];
        multipleAllocations?: MultipleAllocations[];
        documentTypes: string[];
        defaultLocationCode: string,
        ignoreRuleOnError: boolean;
        inactive: boolean;
    }

    const primaryEntity = usePrimaryEntity();
    useEffect(() => {
        if (primaryEntity) {

            formik.setFieldValue('entity_id', primaryEntity?.id);
        }
    }, [primaryEntity]);


    const selectLocationsList = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => ({
            entitiesLocationsList: invoices.entitiesLocationsList,
        })
    );

    const { entitiesLocationsList } = useSelector(selectLocationsList);
    useEffect(() => {
        dispatch(onGetEntitiesLocations());
    }, [dispatch]);

    useEffect(() => {
        if (entitiesLocationsList && primaryEntity) {
            const filteredLocations = entitiesLocationsList.filter(
                (location: EntityLocation) =>
                    location.entity_id === primaryEntity.id
            );
            setLocations(filteredLocations);
        } else {
            setLocations([]);
        }
    }, [entitiesLocationsList, primaryEntity]);

    const [formData, setFormData] = useState<NewTransactionRule>({
        name: '',
        entity_id: '',
        effectiveDate: '',
        expirationDate: '',
        ruleType: '',
        allocateTaxOnSingleLine: false,
        operations: [
            {
                id: Date.now(),
                conditions: [{ field: '', operator: '', values: [''] }],
                allocations: [{ taxCode: '', percentage: 0 }],
            },
        ],
        ruleSets: [
            {
                id: Date.now(),
                conditions: [{ field: "", operator: "", values: [""] }],
                allocations: [{ locationId: '' }],
            },
        ],
        reportings: [
            {
                id: Date.now(),
                allocations: [{ addressLine1: "", addressLine2: "", city: "", state: "", zipCode: 0, locationId: "" }],
                conditions: [{ addressTypes: ["SHIP FROM"] }],
            },
        ],
        multipleAllocations: [
            {
                id: Date.now(),
                conditions: [{ field: '', operator: '', values: [''] }],
                allocations: [{ country: '', addressLine1: "", addressLine2: "", city: "", state: "", zipCode: 0, percentage: 0 }],
            }
        ],
        defaultLocationCode: "",
        documentTypes: [],
        ignoreRuleOnError: false,
        inactive: false
    });

    const toSnakeCase = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map((item) => toSnakeCase(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                acc[snakeKey] = toSnakeCase(obj[key]);
                return acc;
            }, {} as any);
        }
        return obj; // Return the value if it's not an object or array
    };

    const formik = useFormik({
        initialValues: formData,
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            effectiveDate: Yup.date().required("Effective date is required"),
            ruleType: Yup.string().required("Rule Type is required"),
        }),
        onSubmit: (values: any) => {
            // Destructure required fields
            const { ruleType, operations, ruleSets, reportings, multipleAllocations, ...rest } = values;
            // Normalize all rule type data into `operations`
            let consolidatedOperations = [...operations];

            if (ruleType === "marketPlace") {
                consolidatedOperations = ruleSets.map((ruleSet: any) => ({
                    id: ruleSet.id,
                    conditions: ruleSet.conditions,
                    allocations: ruleSet.allocations.map((allocation: any) => ({
                        locationId: allocation.locationId,
                    })),
                }));
            } else if (ruleType === "reportingAllocation") {
                consolidatedOperations = reportings.map((reporting: any) => ({
                    id: reporting.id,
                    conditions: reporting.conditions,
                    allocations: reporting.allocations.map((allocation: any) => ({
                        addressLine1: allocation.addressLine1,
                        addressLine2: allocation.addressLine2,
                        city: allocation.city,
                        state: allocation.state,
                        zipCode: allocation.zipCode,
                        locationId: allocation.locationId,
                    })),
                }));
            } else if (ruleType === "multiplePointsOfUseAllocation") {
                consolidatedOperations = multipleAllocations.map((multipleAllocation: any) => ({
                    id: multipleAllocation.id,
                    conditions: multipleAllocation.conditions,
                    allocations: multipleAllocation.allocations.map((allocation: any) => ({
                        country: allocation.country,
                        addressLine1: allocation.addressLine1,
                        addressLine2: allocation.addressLine2,
                        city: allocation.city,
                        state: allocation.state,
                        zipCode: allocation.zipCode,
                        percentage: allocation.percentage,
                    })),
                }));
            }

            // Merge normalized data into a single structure
            const normalizedValues = {
                ...rest,
                ruleType,
                operations: consolidatedOperations,
            };

            // Convert camelCase to snake_case
            const data = toSnakeCase(normalizedValues);
            // Dispatch action and navigate
            dispatch(onAddaddTransactionRule(data));
            navigate("/tax-rules", { state: { targetTab: "Transaction rules" } });
        },
    });


    const operationsStrings = [
        'Sales order',
        'Sales invoice',
        'Purchase order',
        'Purchase invoice',
        'Return order',
        'Return invoice',
        'Inventory transfer inbound order',
        'Inventory transfer inbound invoice',
        'Reverse charge order',
        'Reverse charge invoice',
        'Inventory transfer outbound order',
        'Inventory transfer outbound invoice'
    ];

    const companyCodeOptions = [
        { label: "Company Code", value: "companyCode" },
        { label: "Customer Code", value: "customerCode" },
        { label: "Item Code", value: "itemCode" },
        { label: "Location Code", value: "locationCode" },
        { label: "Purchase Order No", value: "purchaseOrderNo" },
        { label: "Reference Code", value: "referenceCode" },
        { label: "Salesperson Code", value: "salespersonCode" },
        { label: "Ship From State", value: "shipFromState" },
        { label: "Ship To State", value: "shipToState" },
        { label: "Data Source Id", value: "dataSourceId" },
        { label: "Ref1", value: "ref1" },
        { label: "Ref2", value: "ref2" },
        { label: "Merchant Seller Id", value: "merchantSellerId" },
        { label: "Marketplace Liability Type", value: "marketplaceLiabilityType" },
        { label: "Origination Document Id", value: "originationDocumentId" },
        { label: "Origination Site", value: "originationSite" },
        { label: "Document Code", value: "documentCode" }
    ];

    const regions = {
        "AA": "AA",
        "AB": "AB",
        "AE": "AE",
        "AK": "AK",
        "AL": "AL",
        "AP": "AP",
        "AR": "AR",
        "AS": "AS",
        "AZ": "AZ",
        "BC": "BC",
        "CA": "CA",
        "CD": "CD",
        "CO": "CO",
        "CT": "CT",
        "DC": "DC",
        "DE": "DE",
        "FF": "FF",
        "FL": "FL",
        "GA": "GA",
        "GU": "GU",
        "HI": "HI",
        "IA": "IA",
        "ID": "ID",
        "IL": "IL",
        "IN": "IN",
        "KS": "KS",
        "KY": "KY",
        "LA": "LA",
        "MA": "MA",
        "MB": "MB",
        "MD": "MD",
        "ME": "ME",
        "MI": "MI",
        "MN": "MN",
        "MO": "MO",
        "MS": "MS",
        "MT": "MT",
        "MX": "MX",
        "NB": "NB",
        "NC": "NC",
        "ND": "ND",
        "NE": "NE",
        "NH": "NH",
        "NJ": "NJ",
        "NL": "NL",
        "NM": "NM",
        "NS": "NS",
        "NT": "NT",
        "NU": "NU",
        "NV": "NV",
        "NY": "NY",
        "OH": "OH",
        "OK": "OK",
        "ON": "ON",
        "OR": "OR",
        "PA": "PA",
        "PE": "PE",
        "PR": "PR",
        "QC": "QC",
        "RI": "RI",
        "SC": "SC",
        "SD": "SD",
        "SK": "SK",
        "TN": "TN",
        "TT": "TT",
        "TX": "TX",
        "UN": "UN",
        "UT": "UT",
        "VA": "VA",
        "VI": "VI",
        "VT": "VT",
        "WA": "WA",
        "WI": "WI",
        "WV": "WV",
        "WY": "WY",
        "YT": "YT"
    };

    const countries = [
        // { value: "", name: "All" },
        // { value: "AF", name: "Afghanistan" },
        // { value: "AX", name: "Aland Islands" },
        // { value: "AL", name: "Albania" },
        // { value: "DZ", name: "Algeria" },
        // { value: "AS", name: "American Samoa" },
        // { value: "AD", name: "Andorra" },
        // { value: "AO", name: "Angola" },
        // { value: "AI", name: "Anguilla" },
        // { value: "AQ", name: "Antarctica" },
        // { value: "AG", name: "Antigua and Barbuda" },
        // { value: "AR", name: "Argentina" },
        // { value: "AM", name: "Armenia" },
        // { value: "AW", name: "Aruba" },
        // { value: "AU", name: "Australia" },
        // { value: "AT", name: "Austria" },
        // { value: "AZ", name: "Azerbaijan" },
        // { value: "BS", name: "Bahamas" },
        // { value: "BH", name: "Bahrain" },
        // { value: "BD", name: "Bangladesh" },
        // { value: "BB", name: "Barbados" },
        // { value: "BY", name: "Belarus" },
        // { value: "BE", name: "Belgium" },
        // { value: "BZ", name: "Belize" },
        // { value: "BJ", name: "Benin" },
        // { value: "BM", name: "Bermuda" },
        // { value: "BT", name: "Bhutan" },
        // { value: "BO", name: "Bolivia" },
        // { value: "BA", name: "Bosnia and Herzegovina" },
        // { value: "BW", name: "Botswana" },
        // { value: "BV", name: "Bouvet Island" },
        // { value: "BR", name: "Brazil" },
        // { value: "IO", name: "British Indian Ocean Territory" },
        // { value: "BN", name: "Brunei Darussalam" },
        // { value: "BG", name: "Bulgaria" },
        // { value: "BF", name: "Burkina Faso" },
        // { value: "BI", name: "Burundi" },
        // { value: "KH", name: "Cambodia" },
        // { value: "CM", name: "Cameroon" },
        // { value: "CA", name: "Canada" },
        // { value: "IC", name: "Canary Islands" },
        // { value: "CV", name: "Cape Verde" },
        // { value: "BQ", name: "Caribbean Netherlands (Bonaire)" },
        // { value: "KY", name: "Cayman Islands" },
        // { value: "CF", name: "Central African Republic" },
        // { value: "TD", name: "Chad" },
        // { value: "CL", name: "Chile" },
        // { value: "CN", name: "China" },
        // { value: "CX", name: "Christmas Island" },
        // { value: "CC", name: "Cocos (Keeling) Islands" },
        // { value: "CO", name: "Colombia" },
        // { value: "KM", name: "Comoros" },
        // { value: "CG", name: "Congo, Republic of the" },
        // { value: "CD", name: "Congo, the Democratic Republic of the" },
        // { value: "CK", name: "Cook Islands" },
        // { value: "CR", name: "Costa Rica" },
        // { value: "CI", name: "Cote D'ivoire" },
        // { value: "HR", name: "Croatia" },
        // { value: "CU", name: "Cuba" },
        // { value: "CW", name: "Curacao" },
        // { value: "CY", name: "Cyprus" },
        // { value: "CZ", name: "Czech Republic" },
        // { value: "DK", name: "Denmark" },
        // { value: "DJ", name: "Djibouti" },
        // { value: "DM", name: "Dominica" },
        // { value: "DO", name: "Dominican Republic" },
        // { value: "EC", name: "Ecuador" },
        // { value: "EG", name: "Egypt" },
        // { value: "SV", name: "El Salvador" },
        // { value: "GQ", name: "Equatorial Guinea" },
        // { value: "ER", name: "Eritrea" },
        // { value: "EE", name: "Estonia" },
        // { value: "ET", name: "Ethiopia" },
        // { value: "FK", name: "Falkland Islands (Malvinas)" },
        // { value: "FO", name: "Faroe Islands" },
        // { value: "FJ", name: "Fiji" },
        // { value: "FI", name: "Finland" },
        // { value: "FR", name: "France" },
        // { value: "GF", name: "French Guiana" },
        // { value: "PF", name: "French Polynesia" },
        // { value: "TF", name: "French Southern Territories" },
        // { value: "GA", name: "Gabon" },
        // { value: "GM", name: "Gambia" },
        // { value: "GE", name: "Georgia" },
        // { value: "DE", name: "Germany" },
        // { value: "GH", name: "Ghana" },
        // { value: "GI", name: "Gibraltar" },
        // { value: "GR", name: "Greece" },
        // { value: "GL", name: "Greenland" },
        // { value: "GD", name: "Grenada" },
        // { value: "GP", name: "Guadeloupe" },
        // { value: "GU", name: "Guam" },
        // { value: "GT", name: "Guatemala" },
        // { value: "GG", name: "Guernsey" },
        // { value: "GN", name: "Guinea" },
        // { value: "GW", name: "Guinea-bissau" },
        // { value: "GY", name: "Guyana" },
        // { value: "HT", name: "Haiti" },
        // { value: "HM", name: "Heard Island and Mcdonald Islands" },
        // { value: "VA", name: "Holy See (Vatican City State)" },
        // { value: "HN", name: "Honduras" },
        // { value: "HK", name: "Hong Kong" },
        // { value: "HU", name: "Hungary" },
        // { value: "IS", name: "Iceland" },
        // { value: "IN", name: "India" },
        // { value: "ID", name: "Indonesia" },
        // { value: "IR", name: "Iran, Islamic Republic of" },
        // { value: "IQ", name: "Iraq" },
        // { value: "IE", name: "Ireland" },
        // { value: "IM", name: "Isle of Man" },
        // { value: "IL", name: "Israel" },
        // { value: "IT", name: "Italy" },
        // { value: "JM", name: "Jamaica" },
        // { value: "JP", name: "Japan" },
        // { value: "JE", name: "Jersey" },
        // { value: "JO", name: "Jordan" },
        // { value: "KZ", name: "Kazakhstan" },
        // { value: "KE", name: "Kenya" },
        // { value: "KI", name: "Kiribati" },
        // { value: "KP", name: "Korea, Democratic People's Republic of" },
        // { value: "KR", name: "Korea, Republic of" },
        // { value: "KW", name: "Kuwait" },
        // { value: "KG", name: "Kyrgyzstan" },
        // { value: "LL", name: "Lake Lugano, Territorial Waters of" },
        // { value: "LA", name: "Lao People's Democratic Republic" },
        // { value: "LV", name: "Latvia" },
        // { value: "LB", name: "Lebanon" },
        // { value: "LS", name: "Lesotho" },
        // { value: "LR", name: "Liberia" },
        // { value: "LY", name: "Libyan Arab Jamahiriya" },
        // { value: "LI", name: "Liechtenstein" },
        // { value: "LT", name: "Lithuania" },
        // { value: "LO", name: "Livigno" },
        // { value: "LU", name: "Luxembourg" },
        // { value: "MO", name: "Macau" },
        // { value: "MK", name: "Macedonia, the Former Yugoslav Republic of" },
        // { value: "MG", name: "Madagascar" },
        // { value: "MW", name: "Malawi" },
        // { value: "MY", name: "Malaysia" },
        // { value: "MV", name: "Maldives" },
        // { value: "ML", name: "Mali" },
        // { value: "MT", name: "Malta" },
        // { value: "MH", name: "Marshall Islands (The)" },
        // { value: "MQ", name: "Martinique" },
        // { value: "MR", name: "Mauritania" },
        // { value: "MU", name: "Mauritius" },
        // { value: "YT", name: "Mayotte" },
        // { value: "MX", name: "Mexico" },
        // { value: "FM", name: "Micronesia (Federated States Of)" },
        // { value: "MD", name: "Moldova, Republic of" },
        // { value: "MC", name: "Monaco" },
        // { value: "MN", name: "Mongolia" },
        // { value: "ME", name: "Montenegro" },
        // { value: "MS", name: "Montserrat" },
        // { value: "MA", name: "Morocco" },
        // { value: "MZ", name: "Mozambique" },
        // { value: "MM", name: "Myanmar" },
        // { value: "NA", name: "Namibia" },
        // { value: "NR", name: "Nauru" },
        // { value: "NP", name: "Nepal" },
        // { value: "NL", name: "Netherlands" },
        // { value: "NC", name: "New Caledonia" },
        // { value: "NZ", name: "New Zealand" },
        // { value: "NI", name: "Nicaragua" },
        // { value: "NE", name: "Niger" },
        // { value: "NG", name: "Nigeria" },
        // { value: "NU", name: "Niue" },
        // { value: "NF", name: "Norfolk Island" },
        // { value: "MP", name: "Northern Mariana Islands (The)" },
        // { value: "NO", name: "Norway" },
        // { value: "OM", name: "Oman" },
        // { value: "PK", name: "Pakistan" },
        // { value: "PW", name: "Palau" },
        // { value: "PS", name: "Palestinian Territory, Occupied" },
        // { value: "PA", name: "Panama" },
        // { value: "PG", name: "Papua New Guinea" },
        // { value: "PY", name: "Paraguay" },
        // { value: "PE", name: "Peru" },
        // { value: "PH", name: "Philippines" },
        // { value: "PN", name: "Pitcairn Islands" },
        // { value: "PL", name: "Poland" },
        // { value: "PT", name: "Portugal" },
        // { value: "QA", name: "Qatar" },
        // { value: "RE", name: "Reunion" },
        // { value: "RO", name: "Romania" },
        // { value: "RU", name: "Russian Federation" },
        // { value: "RW", name: "Rwanda" },
        // { value: "BL", name: "Saint Barthelemy" },
        // { value: "SH", name: "Saint Helena" },
        // { value: "KN", name: "Saint Kitts and Nevis" },
        // { value: "LC", name: "Saint Lucia" },
        // { value: "MF", name: "Saint Martin" },
        // { value: "PM", name: "Saint Pierre and Miquelon" },
        // { value: "VC", name: "Saint Vincent and the Grenadines" },
        // { value: "WS", name: "Samoa" },
        // { value: "SM", name: "San Marino" },
        // { value: "ST", name: "Sao Tome and Principe" },
        // { value: "SA", name: "Saudi Arabia" },
        // { value: "SN", name: "Senegal" },
        // { value: "RS", name: "Serbia" },
        // { value: "SC", name: "Seychelles" },
        // { value: "SL", name: "Sierra Leone" },
        // { value: "SG", name: "Singapore" },
        // { value: "SX", name: "Sint Maarten" },
        // { value: "SK", name: "Slovakia" },
        // { value: "SI", name: "Slovenia" },
        // { value: "SB", name: "Solomon Islands" },
        // { value: "SO", name: "Somalia" },
        // { value: "ZA", name: "South Africa" },
        // { value: "GS", name: "South Georgia and the South Sandwich Islands" },
        // { value: "SS", name: "South Sudan" },
        // { value: "ES", name: "Spain" },
        // { value: "LK", name: "Sri Lanka" },
        // { value: "SD", name: "Sudan" },
        // { value: "SR", name: "Suriname" },
        // { value: "SJ", name: "Svalbard and Jan Mayen" },
        // { value: "SZ", name: "Swaziland" },
        // { value: "SE", name: "Sweden" },
        // { value: "CH", name: "Switzerland" },
        // { value: "SY", name: "Syrian Arab Republic" },
        // { value: "TW", name: "Taiwan" },
        // { value: "TJ", name: "Tajikistan" },
        // { value: "TZ", name: "Tanzania, United Republic of" },
        // { value: "TH", name: "Thailand" },
        // { value: "TL", name: "Timor-leste" },
        // { value: "TG", name: "Togo" },
        // { value: "TK", name: "Tokelau" },
        // { value: "TO", name: "Tonga" },
        // { value: "TT", name: "Trinidad and Tobago" },
        // { value: "TN", name: "Tunisia" },
        // { value: "TR", name: "Turkey" },
        // { value: "TM", name: "Turkmenistan" },
        // { value: "TC", name: "Turks and Caicos Islands" },
        // { value: "TV", name: "Tuvalu" },
        // { value: "UG", name: "Uganda" },
        // { value: "UA", name: "Ukraine" },
        // { value: "AE", name: "United Arab Emirates" },
        // { value: "GB", name: "United Kingdom" },
        // { value: "XI", name: "United Kingdom (Northern Ireland)" },
        // { value: "UM", name: "United States Minor Outlying Islands (The)" },
        { value: "US", name: "United States of America" },
        // { value: "UY", name: "Uruguay" },
        // { value: "UZ", name: "Uzbekistan" },
        // { value: "VU", name: "Vanuatu" },
        // { value: "VE", name: "Venezuela" },
        // { value: "VN", name: "Vietnam" },
        // { value: "VI", name: "Virgin Islands (U.s.)" },
        // { value: "VG", name: "Virgin Islands, British" },
        // { value: "WF", name: "Wallis and Futuna" },
        // { value: "EH", name: "Western Sahara" },
        // { value: "YE", name: "Yemen" },
        // { value: "ZM", name: "Zambia" },
        // { value: "ZW", name: "Zimbabwe" }
    ];

    const handleDeleteOperation = (operationId: number) => {
        setFormData((prev) => ({
            ...prev,
            // operations: prev.operations.filter((op) => op.id !== operationId),
            operations: [...(formData.operations || [])].filter((op) => op.id !== operationId),
        }));
    };

    const handleAddOperation = () => {
        const newOperation = {
            id: Date.now(),
            conditions: [{ field: "", operator: "", values: [""] }],
            allocations: [{ taxCode: "", percentage: 0 }],
        };

        // Update both formData and formik state
        formik.setFieldValue("operations", [...(formik.values.operations || []), newOperation])
        setFormData((prev) => ({
            ...prev,
            operations: [...prev.operations || [], newOperation],
        }));
    };

    type Condition = { field: string; operator: string; values: string[] };

    const handleConditionChange = (
        operationIndex: number,
        conditionIndex: number,
        field: keyof Condition,
        value: string | string[]
    ) => {
        const updatedOperations = [...(formData.operations || [])];
        if (field === 'values' && Array.isArray(value)) {
            updatedOperations[operationIndex].conditions[conditionIndex].values = value;
        } else if (field !== 'values') {
            updatedOperations[operationIndex].conditions[conditionIndex][field] = value as string; // Explicitly cast to string for other fields
        }
        setFormData({ ...formData, operations: updatedOperations });
    };

    const handleAddCondition = (operationIndex: number) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].conditions.push({ field: '', operator: '', values: [''] });
        setFormData({ ...formData, operations: updatedOperations });
    };

    const handleDeleteCondition = (operationIndex: number, conditionIndex: number) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].conditions.splice(conditionIndex, 1);
        setFormData({ ...formData, operations: updatedOperations });
    };


    type Allocation = { taxCode: string; percentage: number };

    const handleAllocationChange = (
        operationIndex: number,
        allocationIndex: number,
        field: keyof Allocation, // Ensure `field` is typed as a valid key of Allocation
        value: string
    ) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].allocations[allocationIndex] = {
            ...updatedOperations[operationIndex].allocations[allocationIndex],
            [field]: field === 'percentage' ? parseFloat(value) : value,
        };

        setFormData((prev) => ({
            ...prev,
            operations: updatedOperations,
        }));
    };


    const handleAddAllocation = (operationIndex: number) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].allocations.push({ taxCode: '', percentage: 0 });
        setFormData({ ...formData, operations: updatedOperations });
    };

    const handleDeleteAllocation = (operationIndex: number, allocationIndex: number) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].allocations.splice(allocationIndex, 1);
        setFormData({ ...formData, operations: updatedOperations });
    };


    const handleAddValue = (operationIndex: number, conditionIndex: number) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].conditions[conditionIndex].values.push('');
        setFormData({ ...formData, operations: updatedOperations });
    };

    const handleDeleteValue = (operationIndex: number, conditionIndex: number, valueIndex: number) => {
        const updatedOperations = [...(formData.operations || [])];
        updatedOperations[operationIndex].conditions[conditionIndex].values.splice(valueIndex, 1);
        setFormData({ ...formData, operations: updatedOperations });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
        formik.setFieldValue(name, checked);
    };

    // ruleset

    const handleDeleteRuleSet = (ruleSetsId: number) => {
        setFormData((prev) => ({
            ...prev,
            // operations: prev.operations.filter((op) => op.id !== operationId),
            ruleSets: [...(formData.ruleSets || [])].filter((op) => op.id !== ruleSetsId),
        }));
    };

    const handleAddRuleSet = () => {
        const newRuleSet = {
            id: Date.now(),
            conditions: [{ field: "", operator: "", values: [""] }],
            allocations: [{ locationId: '' }],
        };

        formik.setFieldValue('ruleSets', [...(formik.values.ruleSets || []), newRuleSet]);
        setFormData((prev) => ({
            ...prev,
            ruleSets: [...prev.ruleSets || [], newRuleSet],
        }));
    };

    type Criteria = { field: string; operator: string; values: string[] };
    const handleCriteriaChange = (ruleSetIndex: number, criteriaIndex: number, field: keyof Criteria,
        value: string | string[]) => {
        const updatedruleSets = [...(formData.ruleSets || [])];
        if (field === 'values' && Array.isArray(value)) {
            updatedruleSets[ruleSetIndex].conditions[criteriaIndex].values = value;
        } else if (field !== 'values') {
            updatedruleSets[ruleSetIndex].conditions[criteriaIndex][field] = value as string; // Explicitly cast to string for other fields
        }
        setFormData({ ...formData, ruleSets: updatedruleSets });
    };

    // Add a new criteria
    const handleAddCriteria = (ruleSetIndex: number) => {
        const updatedruleSets = [...(formData.ruleSets || [])];
        updatedruleSets[ruleSetIndex].conditions.push({ field: '', operator: '', values: [''] });
        setFormData({ ...formData, ruleSets: updatedruleSets });
    };

    // Delete a criteria
    const handleDeleteCriteria = (ruleSetIndex: number, criteriaIndex: number) => {
        const updatedruleSets = [...(formData.ruleSets || [])];
        updatedruleSets[ruleSetIndex].conditions.splice(criteriaIndex, 1);
        setFormData({ ...formData, ruleSets: updatedruleSets });
    };

    const handleRSAddValue = (ruleSetIndex: number, criteriaIndex: number) => {
        const updatedRuleSets = [...(formData.ruleSets || [])];
        updatedRuleSets[ruleSetIndex].conditions[criteriaIndex].values.push('');
        setFormData({ ...formData, ruleSets: updatedRuleSets });
    };

    const handleRSDeleteValue = (ruleSetIndex: number, criteriaIndex: number, valueIndex: number) => {
        const updatedRuleSets = [...(formData.ruleSets || [])];
        updatedRuleSets[ruleSetIndex].conditions[criteriaIndex].values.splice(valueIndex, 1);
        setFormData({ ...formData, ruleSets: updatedRuleSets });
    };

    const handleLocationCodeChange = (ruleSetIndex: number, newLocationCode: string) => {
        const updatedRuleSets = [...(formData.ruleSets || [])];

        // Ensure allocations array exists and update the locationCode
        if (updatedRuleSets[ruleSetIndex]?.allocations?.length > 0) {
            updatedRuleSets[ruleSetIndex].allocations[0].locationId = newLocationCode;
        } else {
            // Handle cases where allocations array might be missing or empty
            updatedRuleSets[ruleSetIndex].allocations = [{ locationId: newLocationCode }];
        }

        setFormData((prev) => ({
            ...prev,
            ruleSets: updatedRuleSets,
        }));
    };

    // reportings rulesets
    const handleAddReportings = () => {
        const newReporting = {
            id: Date.now(),
            allocations: [{ addressLine1: "", addressLine2: "", city: "", state: "", zipCode: 0, locationId: "" }],
            conditions: [{ addressTypes: ["SHIP FROM"] }],
        };

        formik.setFieldValue('reportings', [...(formik.values.reportings || []), newReporting]);
        setFormData((prev) => ({ ...prev, reportings: [...(prev.reportings || []), newReporting] }));
    };


    const handleDeleteReportings = (reportingId: number) => {
        setFormData((prev) => ({
            ...prev,
            reportings: [...(formData.reportings || [])].filter((op) => op.id !== reportingId),
        }));
    }

    const handleAddAddress = (reportingIndex: number) => {
        const updatedreportings = [...(formData.reportings || [])];
        updatedreportings[reportingIndex].allocations.push({ addressLine1: "", addressLine2: "", city: "", state: "", zipCode: 0, locationId: "", });
        setFormData({ ...formData, reportings: updatedreportings });
    };

    const handleDeleteAddress = (reportingIndex: number, addressConditionIndex: number) => {
        const updatedreportings = [...(formData.reportings || [])];
        updatedreportings[reportingIndex].allocations.splice(addressConditionIndex, 1);
        setFormData({ ...formData, reportings: updatedreportings });
    }

    type AddressCondition = { addressLine1: string; addressLine2: string; city: string; state: string, zipCode: number, locationId: string };

    const handleAddressChange = (reportingIndex: number, addressconditionIndex: number, field: keyof AddressCondition, value: string) => {
        const updatedReportings = [...(formData.reportings || [])];
        updatedReportings[reportingIndex].allocations[addressconditionIndex] = { ...updatedReportings[reportingIndex].allocations[addressconditionIndex], [field]: value, }

        setFormData((prev) => ({ ...prev, reportings: updatedReportings }));
    }

    const handleAddressTypeChange = (reportingId: any, addressType: any) => {
        setFormData((prev: any) => {
            const updatedReportings = prev.reportings.map((reporting: any) => {
                if (reporting.id === reportingId) {
                    const updatedConditions = reporting.conditions.map((condition: any) => {
                        const updatedAddressTypes = condition.addressTypes.includes(addressType)
                            ? condition.addressTypes.filter((type: any) => type !== addressType) // Remove addressType
                            : [...condition.addressTypes, addressType]; // Add addressType
                        return { ...condition, addressTypes: updatedAddressTypes };
                    });
                    return { ...reporting, conditions: updatedConditions };
                }
                return reporting;
            });
            return { ...prev, reportings: updatedReportings };
        });

        formik.setFieldValue('reportings', formik.values.reportings.map((reporting: any) => {
            if (reporting.id === reportingId) {
                const updatedConditions = reporting.conditions.map((condition: any) => {
                    const updatedAddressTypes = condition.addressTypes.includes(addressType)
                        ? condition.addressTypes.filter((type: any) => type !== addressType) // Remove addressType
                        : [...condition.addressTypes, addressType]; // Add addressType
                    return { ...condition, addressTypes: updatedAddressTypes };
                });
                return { ...reporting, conditions: updatedConditions };
            }
            return reporting;
        }));
    };
    const handleDefaultLocationCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            defaultLocationCode: e.target.value,
        }));
    };

    //multipleAllocations

    const handleMultipleDeleteOperation = (multipleAllocationIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            multipleAllocations: [...(formData.multipleAllocations || [])].filter((op) => op.id !== multipleAllocationIndex),
        }));
    };

    const handleMultipleAddOperation = () => {
        const newMultipleAllocation = {
            id: Date.now(),
            conditions: [{ field: '', operator: '', values: [''] }],
            allocations: [{ country: '', addressLine1: "", addressLine2: "", city: "", state: "", zipCode: 0, percentage: 0 }],
        };

        // Update both formData and Formik state
        formik.setFieldValue('multipleAllocations', [...(formik.values.multipleAllocations || []), newMultipleAllocation]);
        setFormData((prev) => ({ ...prev, multipleAllocations: [...prev.multipleAllocations || [], newMultipleAllocation] }));
    };

    const handleMultipleConditionChange = (
        multipleAllocationIndex: number,
        conditionIndex: number,
        field: keyof Condition,
        value: string | string[]
    ) => {
        const updatedMultipleAllocations = [...(formData.multipleAllocations || [])];
        if (field === 'values' && Array.isArray(value)) {
            updatedMultipleAllocations[multipleAllocationIndex].conditions[conditionIndex].values = value;
        } else if (field !== 'values') {
            updatedMultipleAllocations[multipleAllocationIndex].conditions[conditionIndex][field] = value as string; // Explicitly cast to string for other fields
        }
        setFormData({ ...formData, multipleAllocations: updatedMultipleAllocations });
    };

    const handleMultipleAddCondition = (multipleAllocationIndex: number) => {
        const updatedMultipleConditions = [...(formData.multipleAllocations || [])];
        updatedMultipleConditions[multipleAllocationIndex].conditions.push({ field: '', operator: '', values: [''] });
        setFormData({ ...formData, multipleAllocations: updatedMultipleConditions });
    };

    const handleMultipleDeleteCondition = (multipleAllocationIndex: number, conditionIndex: number) => {
        const updatedMultipleConditions = [...(formData.multipleAllocations || [])];
        updatedMultipleConditions[multipleAllocationIndex].conditions.splice(conditionIndex, 1);
        setFormData({ ...formData, multipleAllocations: updatedMultipleConditions });
    };

    const handleMultipleAddValue = (multipleAllocationIndex: number, conditionIndex: number) => {
        const updatedMultipleAllocations = [...(formData.multipleAllocations || [])];
        updatedMultipleAllocations[multipleAllocationIndex].conditions[conditionIndex].values.push('');
        setFormData({ ...formData, multipleAllocations: updatedMultipleAllocations });
    };

    const handleMultipleDeleteValue = (multipleAllocationIndex: number, conditionIndex: number, valueIndex: number) => {
        const updatedMultipleAllocations = [...(formData.multipleAllocations || [])];
        updatedMultipleAllocations[multipleAllocationIndex].conditions[conditionIndex].values.splice(valueIndex, 1);
        setFormData({ ...formData, multipleAllocations: updatedMultipleAllocations });
    };

    type MultipleAllocation = { country: string; addressLine1: string; addressLine2: string; city: string; state: string; zipCode: number; percentage: number };

    const handleMultipleAllocationChange = (
        multipleAllocationIndex: number, allocationIndex: number, field: keyof MultipleAllocation, value: string
    ) => {
        const updatedMultipleAllocations = [...(formData.multipleAllocations || [])];
        updatedMultipleAllocations[multipleAllocationIndex].allocations[allocationIndex] = {
            ...updatedMultipleAllocations[multipleAllocationIndex].allocations[allocationIndex],
            [field]: field === 'percentage' ? parseFloat(value) : value,
        };

        setFormData((prev) => ({ ...prev, multipleAllocations: updatedMultipleAllocations }));
    };

    const handleMultipleAddAllocation = (multipleAllocationIndex: number) => {
        const updatedMultipleAllocations = [...(formData.multipleAllocations || [])];
        updatedMultipleAllocations[multipleAllocationIndex].allocations.push({ country: '', addressLine1: "", addressLine2: "", city: "", state: "", zipCode: 0, percentage: 0 });
        setFormData({ ...formData, multipleAllocations: updatedMultipleAllocations });
    };

    const handleMultipleDeleteAllocation = (multipleAllocationIndex: number, allocationIndex: number) => {
        const updatedMultipleAllocations = [...(formData.multipleAllocations || [])];
        updatedMultipleAllocations[multipleAllocationIndex].allocations.splice(allocationIndex, 1);
        setFormData({ ...formData, multipleAllocations: updatedMultipleAllocations });
    };

    const handleMultipleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
        formik.setFieldValue(name, checked);
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb pageTitle="Add advanced Transaction rule" title="Add advanced transaction rule" />
                    <Card>
                        <Card.Body>
                            <Form onSubmit={formik.handleSubmit}>
                                {/* Name and Description */}
                                <Row className='mb-3'>

                                    <Col md={6}>
                                        <div className="mt-4">
                                            <Form.Group>
                                                <Form.Label htmlFor='name'>Name
                                                    <span className="text-danger">*</span>
                                                </Form.Label>

                                                <Form.Control
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={formik.touched.name && !!formik.errors.name}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.name ? String(formik.errors.name) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col xl={3}>
                                        <div className="mt-4">
                                            <Form.Group>
                                                <Form.Label htmlFor="effectiveDate">
                                                    EFFECTIVE
                                                    <span className="text-danger">*</span>
                                                </Form.Label>
                                                <input
                                                    id="effectiveDate"
                                                    name="effectiveDate"
                                                    type="date"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.effectiveDate}
                                                />
                                            </Form.Group>
                                            {formik.touched.effectiveDate && formik.errors.effectiveDate && (
                                                <div className="text-danger">{formik.errors.effectiveDate ? String(formik.errors.effectiveDate) : ''}</div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col xl={3}>
                                        <div className="mt-4">
                                            <Form.Group>
                                                <Form.Label htmlFor="expirationDate">
                                                    EXPIRATION
                                                </Form.Label>
                                                <input
                                                    id="expirationDate"
                                                    name="expirationDate"
                                                    type="date"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.expirationDate}
                                                />
                                            </Form.Group>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mt-4">
                                            <Form.Group>
                                                <Form.Label htmlFor="ruleType">Rule Type<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    id="ruleType"
                                                    name="ruleType"
                                                    value={formik.values.ruleType}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={formik.touched.ruleType && !!formik.errors.ruleType}
                                                >
                                                    <option>Select Rule Type</option>
                                                    <option value="bundledItemsAllocation">Bundled items allocation</option>
                                                    <option value="marketPlace">Marketplace</option>
                                                    <option value="reportingAllocation">Reporting location</option>
                                                    <option value="multiplePointsOfUseAllocation">Multiple points of use allocation</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.ruleType ? String(formik.errors.ruleType) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </Col>
                                </Row>

                                {
                                    formik.values.ruleType === "bundledItemsAllocation" && (
                                        <>
                                            <div>
                                                <p className='mt-4 ps-0' style={{ fontSize: "16px" }}>
                                                    Split bundled items into multiple lines to allocate tax across multiple tax codes</p>
                                            </div>
                                            <hr />
                                            <div className='mt-4'>
                                                <h3 style={{ fontSize: "16px" }}>Define conditions and results</h3>
                                                <p className='ps-0' style={{ fontSize: "16px" }}>Use conditions in the WHEN section to determine when bundled items should be separated. Rules can have multiple operations.</p>
                                                <p className='ps-0'>Only apply this rule to selected document types</p>
                                            </div>
                                            <Form.Group className="mb-3">
                                                <div>
                                                    {operationsStrings.map((operation) => (
                                                        <FormCheck
                                                            inline
                                                            key={operation}
                                                            type="checkbox"
                                                            label={operation}
                                                            value={operation}
                                                            checked={formData.documentTypes.includes(operation)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setFormData((prev) => {
                                                                    const selected = new Set([...prev.documentTypes]);

                                                                    if (selected.has(value)) {
                                                                        selected.delete(value);
                                                                    } else {
                                                                        selected.add(value);
                                                                    }

                                                                    const updateddocumentTypes = Array.from(selected);

                                                                    formik.setFieldValue("documentTypes", updateddocumentTypes);
                                                                    return {
                                                                        ...prev,
                                                                        documentTypes: updateddocumentTypes, // Ensure a new reference
                                                                    };
                                                                });
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Form.Group>

                                            <div className='mt-4'>

                                                <div className='d-flex align-items-center justify-content-start'>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="allocateTaxOnSingleLine"
                                                        checked={formData.allocateTaxOnSingleLine}
                                                        onChange={handleInputChange}
                                                    /><p style={{ fontSize: "16px" }}>Return allocated tax on a single line instead of creating multiple lines</p>
                                                </div>

                                                {formData.operations?.map((operation, operationIndex) => (
                                                    <div key={operation.id} className="border p-3 mb-4">
                                                        <div className='d-flex justify-content-between mb-2'>
                                                            <h2>Operations</h2>
                                                            <Link to="#" className='fs-3 fw-bold' onClick={() => handleDeleteOperation(operation.id)}>
                                                                <i className='las la-solid la-trash me-1 '></i> Delete Operation
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <h4>WHEN</h4>
                                                            <p className="ps-0" style={{ fontSize: "16px" }}>Set the conditions that trigger the rule</p>
                                                            {operation.conditions.map((condition, conditionIndex) => (
                                                                <div key={conditionIndex} className="mb-4">
                                                                    {/* Field and Operator Row */}
                                                                    <Row className="align-items-start">
                                                                        <Col md={2}>
                                                                            <Form.Group>
                                                                                <Form.Label htmlFor="field" className="small mb-1">Field</Form.Label>
                                                                                <Form.Select
                                                                                    id="field"
                                                                                    name="field"
                                                                                    value={condition.field}
                                                                                    onChange={(e) => handleConditionChange(operationIndex, conditionIndex, 'field', e.target.value)}
                                                                                    className="form-control-sm"
                                                                                >
                                                                                    <option value="description">Description</option>
                                                                                    <option value="item_code">Item Code</option>
                                                                                    <option value="tax_code">Tax Code</option>
                                                                                    <option value="ship_from_state">Ship From State</option>
                                                                                    <option value="ship_to_state">Ship To State</option>
                                                                                    <option value="entity_use_code">Entity Use Code</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col md={2}>
                                                                            <Form.Group>
                                                                                <Form.Label className="small mb-1">Operator</Form.Label>
                                                                                <Form.Select
                                                                                    value={condition.operator}
                                                                                    onChange={(e) => handleConditionChange(operationIndex, conditionIndex, 'operator', e.target.value)}
                                                                                    className="form-control-sm"
                                                                                >
                                                                                    <option value="equals_any_of_these">equals any of these</option>
                                                                                    <option value="starts_with_any_of_these">starts with any of these</option>
                                                                                    <option value="ends_with_any_of_these">ends with any of these</option>
                                                                                    <option value="is_not_any_of_these">is not any of these</option>
                                                                                    <option value="wild_card_match">wild card match</option>
                                                                                    <option value="contains_any_of_these">contains any of these</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col>
                                                                            {/* Values and Delete Buttons */}
                                                                            {condition.values.map((value, valueIndex) => (
                                                                                <Row key={valueIndex} className="align-items-center mb-2">
                                                                                    <Col md={2}></Col> {/* Empty column to align with Field */}
                                                                                    <Col md={2}></Col> {/* Empty column to align with Operator */}
                                                                                    <Col md={4}>
                                                                                        <Form.Group className="w-100">
                                                                                            <Form.Label htmlFor={`value-${valueIndex}`} className="small mb-1">Value</Form.Label>
                                                                                            <Form.Control
                                                                                                id={`value-${valueIndex}`}
                                                                                                name={`value-${valueIndex}`}
                                                                                                type="text"
                                                                                                value={value}
                                                                                                onChange={(e) => {
                                                                                                    const updatedValues = [...condition.values];
                                                                                                    updatedValues[valueIndex] = e.target.value;
                                                                                                    handleConditionChange(
                                                                                                        operationIndex,
                                                                                                        conditionIndex,
                                                                                                        'values',
                                                                                                        updatedValues
                                                                                                    );
                                                                                                }}
                                                                                                className="form-control-sm"
                                                                                            />
                                                                                        </Form.Group>
                                                                                    </Col>
                                                                                    <Col md={2} className="text-center">
                                                                                        <li
                                                                                            className="list-inline-item"
                                                                                            onClick={() => handleDeleteValue(operationIndex, conditionIndex, valueIndex)}
                                                                                        >
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="btn btn-soft-danger btn-sm d-inline-block btn-sm"
                                                                                            >
                                                                                                <i className="bi bi-trash fs-17 align-middle"></i>
                                                                                            </Link>
                                                                                        </li>
                                                                                    </Col>
                                                                                </Row>
                                                                            ))}

                                                                            {/* Add and Delete Condition Buttons */}
                                                                            <Row className="mt-2 align-items-center">
                                                                                <Col md={2}></Col> {/* Empty column to align with Field */}
                                                                                <Col md={2}></Col> {/* Empty column to align with Operator */}
                                                                                <Col md={4}>
                                                                                    <Button
                                                                                        variant="primary"
                                                                                        onClick={() => handleAddValue(operationIndex, conditionIndex)}
                                                                                        className="w-100 btn-sm"
                                                                                    >
                                                                                        Add New Value
                                                                                    </Button>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>

                                                                        <Col md={2}>
                                                                            <Button
                                                                                variant="danger"
                                                                                onClick={() => handleDeleteCondition(operationIndex, conditionIndex)}
                                                                                className="w-100 btn-sm"
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ))}

                                                        </div>

                                                        <Link to="#" className="mb-3 fs-5 " onClick={() => handleAddCondition(operationIndex)}>
                                                            <i className='las la-plus-circle me-1'></i> Add Condition
                                                        </Link>

                                                        <div className='mt-4'>
                                                            <h4>Allocate</h4>
                                                            <p className="ps-0" style={{ fontSize: "16px" }}>Bundled item transactions are split into multiple lines, one for each tax code added. Percentages must add up to 100%.</p>
                                                            {operation.allocations.map((allocation, allocationIndex) => (
                                                                <Row className="mb-3 mt-4 d-flex align-items-center" key={allocationIndex}>
                                                                    {/* Tax Code Field */}
                                                                    <Col md={4}>
                                                                        <Form.Group>
                                                                            <Form.Label htmlFor={`taxCode-${allocationIndex}`} className="small mb-1">Tax Code</Form.Label>
                                                                            <Form.Control
                                                                                id={`taxCode-${allocationIndex}`}
                                                                                name="taxCode"
                                                                                type="text"
                                                                                value={allocation.taxCode}
                                                                                onChange={(e) => handleAllocationChange(operationIndex, allocationIndex, 'taxCode', e.target.value)}
                                                                                className="form-control-sm"
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>

                                                                    {/* Percentage Allocated Field */}
                                                                    <Col md={3}>
                                                                        <Form.Group>
                                                                            <Form.Label htmlFor={`percentage-${allocationIndex}`} className="small mb-1">Percent Allocated</Form.Label>
                                                                            <InputGroup>
                                                                                <Form.Control
                                                                                    id={`percentage-${allocationIndex}`}
                                                                                    name="percentage"
                                                                                    type="number"
                                                                                    value={allocation.percentage}
                                                                                    onChange={(e) => handleAllocationChange(operationIndex, allocationIndex, 'percentage', e.target.value)}
                                                                                    className="form-control-sm"
                                                                                />
                                                                                <InputGroup.Text className="small">%</InputGroup.Text>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>

                                                                    {/* Delete Button */}
                                                                    <Col md={3} className="text-end">
                                                                        <Button
                                                                            variant="danger"
                                                                            onClick={() => handleDeleteAllocation(operationIndex, allocationIndex)}
                                                                            className="btn-sm"
                                                                        >
                                                                            <i className="las la-trash-alt"></i> Delete
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            ))}

                                                        </div>

                                                        <Link to="#" className="mb-3 fs-5" onClick={() => handleAddAllocation(operationIndex)} >
                                                            <i className='las la-plus-circle me-1'></i>Add Allocation
                                                        </Link>

                                                    </div>
                                                ))}

                                                <div className='mt-2' >
                                                    <Link to="#" onClick={handleAddOperation} className='fs-5'>
                                                        <i className="las la-plus-circle me-1"></i> Add Operation
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }

                                {
                                    formik.values.ruleType === "marketPlace" && (
                                        <>
                                            <div>
                                                <p className='mt-4 ps-0' style={{ fontSize: "16px" }}>
                                                    Identify and exclude liability for marketplace sales. When a document is received that matches certain criteria, the location code in the document is automatically updated.</p>
                                            </div>
                                            <hr />

                                            <div className='mt-4'>
                                                <h2 style={{ textAlign: "left" }}>Marketplace rule</h2>
                                                {formData.ruleSets?.map((ruleset, ruleSetIndex) => (
                                                    <div key={ruleset.id} className="border p-3 mb-4">
                                                        <div className='d-flex justify-content-between mb-2'>
                                                            <h3>Rule Set</h3>
                                                            <Link to="#" className='fs-3 fw-bold' onClick={() => handleDeleteRuleSet(ruleset.id)}>
                                                                <i className='las la-solid la-trash me-1'>Delete Rule Set</i>
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <h4>WHEN</h4>
                                                            <p style={{ fontSize: "16px" }}>All of the following are true</p>
                                                            {ruleset.conditions.map((criteria, criteriaIndex) => (
                                                                <div key={criteriaIndex} className="mb-4">
                                                                    {/* Field and Operator Row */}
                                                                    <Row className="align-items-start">
                                                                        <Col md={2}>
                                                                            <Form.Group>
                                                                                <Form.Label htmlFor="field" className="small mb-1">Field</Form.Label>

                                                                                <Form.Select
                                                                                    id="field"
                                                                                    name="field"
                                                                                    value={criteria.field}
                                                                                    className="form-control-sm"
                                                                                    onChange={(e) => handleCriteriaChange(ruleSetIndex, criteriaIndex, 'field', e.target.value)}
                                                                                >
                                                                                    <option>Select an Option
                                                                                    </option>
                                                                                    {companyCodeOptions.map((option) => (
                                                                                        <option key={option.value} value={option.value}>
                                                                                            {option.label}
                                                                                        </option>
                                                                                    ))}
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col md={2}>
                                                                            <Form.Group>
                                                                                <Form.Label></Form.Label>
                                                                                <Form.Select
                                                                                    value={criteria.operator}
                                                                                    onChange={(e) => handleCriteriaChange(ruleSetIndex, criteriaIndex, 'operator', e.target.value)}
                                                                                    className="form-control-sm"
                                                                                >
                                                                                    <option></option>
                                                                                    <option value="equals_any_of_these">equals any of these</option>
                                                                                    <option value="starts_with_any_of_these">starts with any of these</option>
                                                                                    <option value="ends_with_any_of_these">ends with any of these</option>
                                                                                    <option value="is_not_any_of_these">is not any of these</option>
                                                                                    <option value="contains_any_of_these">contains any of these</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col>
                                                                            {/* Values and Delete Buttons */}
                                                                            {criteria.values.map((value, valueIndex) => (
                                                                                <Row key={valueIndex} className="align-items-center mb-3">
                                                                                    <Col md={2}></Col> {/* Empty column to align with Field */}
                                                                                    <Col md={2}></Col> {/* Empty column to align with Operator */}
                                                                                    <Col md={3}>
                                                                                        <Form.Group className="w-100">
                                                                                            <Form.Label htmlFor={`value-${valueIndex}`}  className="small mb-1">Value</Form.Label>
                                                                                            <Form.Control
                                                                                                className="form-control-sm"
                                                                                                id={`value-${valueIndex}`}
                                                                                                name={`value-${valueIndex}`}
                                                                                                type="text"
                                                                                                value={value}
                                                                                                onChange={(e) => {
                                                                                                    const updatedValues = [...criteria.values];
                                                                                                    updatedValues[valueIndex] = e.target.value;
                                                                                                    handleCriteriaChange(
                                                                                                        ruleSetIndex, criteriaIndex,
                                                                                                        'values',
                                                                                                        updatedValues
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Form.Group>
                                                                                    </Col>
                                                                                    <Col md={2} className="text-center">

                                                                                        <li
                                                                                            className="list-inline-item"
                                                                                            onClick={() => handleRSDeleteValue(ruleSetIndex, criteriaIndex, valueIndex)}
                                                                                        >
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="btn btn-soft-danger btn-sm d-inline-block"
                                                                                            >
                                                                                                <i className="bi bi-trash fs-17 align-middle"></i>
                                                                                            </Link>
                                                                                        </li>
                                                                                    </Col>
                                                                                </Row>
                                                                            ))}

                                                                            {/* Add and Delete Condition Buttons */}
                                                                            <Row className="mt-3 align-items-center">
                                                                                <Col md={2}></Col> {/* Empty column to align with Field */}
                                                                                <Col md={2}></Col> {/* Empty column to align with Operator */}
                                                                                <Col md={5}>
                                                                                    <Button
                                                                                        variant="primary"
                                                                                        onClick={() => handleRSAddValue(ruleSetIndex, criteriaIndex)}
                                                                                        className="w-100 btn-sm"
                                                                                    >
                                                                                        Add New Value
                                                                                    </Button>
                                                                                </Col>

                                                                            </Row>
                                                                        </Col>

                                                                        <Col md={2}>
                                                                            <Button
                                                                                variant="danger"
                                                                                onClick={() => handleDeleteCriteria(ruleSetIndex, criteriaIndex)}
                                                                                className="w-100 btn-sm"
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>


                                                                </div>
                                                            ))}
                                                        </div>

                                                        <Link to="#" className="mb-3 fs-5 " onClick={() => handleAddCriteria(ruleSetIndex)}>
                                                            <i className='las la-plus-circle me-1'></i> Add Criteria
                                                        </Link>

                                                        <div className='mt-4'>
                                                            <h4>THEN</h4>
                                                            <p style={{ fontSize: "16px" }}> Override the transaction location with this marketplace location</p>
                                                            <Row className="mb-3 mt-4 d-flex align-items-center">
                                                                <Col md={4}>
                                                                    <Form.Group>
                                                                        <Form.Label htmlFor="locationCode" className="small mb-1">LOCATION CODE</Form.Label>
                                                                        <Form.Control
                                                                            as="select" // Use "as" instead of "type" to render a <select> element
                                                                            id="locationCode"
                                                                            name="locationCode"
                                                                            value={ruleset.allocations[0].locationId} // Access the nested locationId
                                                                            onChange={(e) => handleLocationCodeChange(ruleSetIndex, e.target.value)}
                                                                        >
                                                                            <option value="">Select a location code</option>
                                                                            {locations.map((location) => (
                                                                                <option key={location.id} value={location.id}>
                                                                                    {location.location_code}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                </Col>


                                                                <Row className='mt-4 d-flex align-items-center'>
                                                                    <Link to='#' className="mb-4 ">
                                                                        Don't see your location code?Add a marketplace location
                                                                    </Link>
                                                                </Row>
                                                            </Row>
                                                        </div>

                                                    </div>
                                                ))}

                                                <div className='mt-2' >
                                                    <Link to="#" onClick={handleAddRuleSet} className='fs-5'>
                                                        <i className="las la-plus-circle me-1"></i> Add rule set
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }


                                {
                                    formik.values.ruleType === "reportingAllocation" && (
                                        <>
                                            <div>
                                                <p className='mt-4' style={{ fontSize: "16px" }}>
                                                    Assign a transaction a reporting location code based on address information or components thereof.</p>
                                                <hr />
                                                <div className='mt-4'>
                                                    <div style={{ textAlign: "left" }}>
                                                        <h2>Reporting Location Rule</h2>
                                                        <p style={{ fontSize: "16px" }}>Define which addresses get mapped to which location codes in each rule set below.</p>
                                                        <h4>Choose address conditions and location codes</h4>
                                                    </div>
                                                </div>
                                                {formData.reportings?.map((reporting, reportingIndex) => (
                                                    <div key={reporting.id} className="border p-3 mb-4">
                                                        <div className='d-flex justify-content-between mb-2'>
                                                            <h3>Rule Set</h3>
                                                            <Link to="#" className='fs-3 fw-bold' onClick={() => handleDeleteReportings(reporting.id)}>
                                                                <i className='las la-solid la-trash me-1 '>Delete Rule Set</i>
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <Form.Group>
                                                                <Form.Label>ONLY CONSIDER ADDRESSES OF SELECTED TYPES</Form.Label>
                                                                <div className="mb-3">
                                                                    <Form.Check
                                                                        inline
                                                                        label="SHIP FROM"
                                                                        type="checkbox"
                                                                        checked={reporting.conditions[0]?.addressTypes.includes("SHIP FROM")}
                                                                        onChange={() => handleAddressTypeChange(reporting.id, "SHIP FROM")}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        label="POINT OF ORDER ACCEPTANCE"
                                                                        type="checkbox"
                                                                        checked={reporting.conditions[0]?.addressTypes.includes("POINT OF ORDER ACCEPTANCE")}
                                                                        onChange={() => handleAddressTypeChange(reporting.id, "POINT OF ORDER ACCEPTANCE")}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        label="POINT OF ORDER ORIGIN"
                                                                        type="checkbox"
                                                                        checked={reporting.conditions[0]?.addressTypes.includes("POINT OF ORDER ORIGIN")}
                                                                        onChange={() => handleAddressTypeChange(reporting.id, "POINT OF ORDER ORIGIN")}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        label="SHIP TO"
                                                                        type="checkbox"
                                                                        checked={reporting.conditions[0]?.addressTypes.includes("SHIP TO")}
                                                                        onChange={() => handleAddressTypeChange(reporting.id, "SHIP TO")}
                                                                    />
                                                                </div>
                                                            </Form.Group>

                                                        </div>

                                                        <h3 className="mt-4">MAPPING</h3>
                                                        <p style={{ fontSize: "16px" }}>
                                                            Incoming addresses are compared against the fields in each row. If all non-blank fields match, the transaction location is set to the location code specified in the last column.
                                                        </p>

                                                        {/* Entries */}
                                                        {reporting.allocations?.map((allocations, allocationsIndex) => (
                                                            <Row key={allocationsIndex} className="align-items-center mb-3 mt-4">
                                                                <Col md={2}>
                                                                    <Form.Label>ADDRESS LINE 1</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={allocations.addressLine1}
                                                                        onChange={(e) => handleAddressChange(reportingIndex, allocationsIndex, 'addressLine1', e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col md={2}>
                                                                    <Form.Label>ADDRESS LINE 2</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={allocations.addressLine2}
                                                                        onChange={(e) => handleAddressChange(reportingIndex, allocationsIndex, 'addressLine2', e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col md={2}>
                                                                    <Form.Label>CITY</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={allocations.city}
                                                                        onChange={(e) => handleAddressChange(reportingIndex, allocationsIndex, 'city', e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col md={2}>
                                                                    <Form.Label>STATE</Form.Label>
                                                                    <Form.Select
                                                                        value={allocations.state}
                                                                        onChange={(e) => handleAddressChange(reportingIndex, allocationsIndex, 'state', e.target.value)}
                                                                    >
                                                                        {Object.entries(regions).map(([key, value]) => (
                                                                            <option key={key} value={key}>
                                                                                {value}
                                                                            </option>
                                                                        ))}

                                                                    </Form.Select>
                                                                </Col>
                                                                <Col md={2}>
                                                                    <Form.Label>ZIP CODE</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={allocations.zipCode}
                                                                        onChange={(e) => handleAddressChange(reportingIndex, allocationsIndex, 'zipCode', e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col md={2}>
                                                                    <Form.Label>Assign Location Code</Form.Label>
                                                                    <div className="d-flex align-items-center">
                                                                        <Form.Select
                                                                            value={allocations.locationId}
                                                                            onChange={(e) => handleAddressChange(reportingIndex, allocationsIndex, 'locationId', e.target.value)}
                                                                        >
                                                                            <option></option>
                                                                            <option value="">Select a location code</option>
                                                                            {locations.map((location) => (
                                                                                <option key={location.id} value={location.id}>
                                                                                    {location.location_code}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Select>
                                                                        <Button variant='danger'
                                                                            onClick={() => handleDeleteAddress(reportingIndex, allocationsIndex)}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </Col>

                                                            </Row>
                                                        ))}
                                                        <div className='mt-2' >
                                                            <Link to="#" className='fs-5' onClick={() => handleAddAddress(reportingIndex)}>
                                                                <i className="las la-plus-circle me-1"></i> Add entry
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className='mt-2' >
                                                    <Link to="#" onClick={handleAddReportings} className='fs-5'>
                                                        <i className="las la-plus-circle me-1"></i> Add rule set
                                                    </Link>
                                                </div>

                                                <Form.Group className="mb-3 mt-4">
                                                    <Form.Label>IF NO MATCH IS FOUND</Form.Label>
                                                    <Form.Select
                                                        value={formData.defaultLocationCode}
                                                        onChange={handleDefaultLocationCodeChange}
                                                    >
                                                        <option value="">Select a location code</option>
                                                        {locations.map((location) => (
                                                            <option key={location.id} value={location.id}>
                                                                {location.location_code}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>

                                                <p style={{ fontSize: "16px" }}>
                                                    (OPTIONAL) Choose a location code to assign when a match is not found.
                                                </p>
                                                <Link to="#" className="text-primary">
                                                    Don’t see your location code? Add a company location
                                                </Link>

                                            </div>
                                        </>
                                    )
                                }

                                {
                                    formik.values.ruleType === "multiplePointsOfUseAllocation" && (
                                        <>
                                            <div>
                                                <p className='mt-4' style={{ fontSize: "16px" }}>
                                                    Split an item into multiple lines to allocate tax by more than one address</p>
                                            </div>
                                            <hr />
                                            <div className='mt-4'>
                                                <h3 style={{ fontSize: "16px" }}>Define conditions and results</h3>
                                                <p style={{ fontSize: "16px" }}>Use conditions in the WHEN section to determine when bundled items should be separated. Rules can have multiple operations.</p>
                                                <p>Only apply this rule to selected document types</p>
                                            </div>

                                            <Form.Group className="mb-3">
                                                <div>
                                                    {operationsStrings.map((operation) => (
                                                        <FormCheck
                                                            inline
                                                            key={operation}
                                                            type="checkbox"
                                                            label={operation}
                                                            value={operation}
                                                            checked={formData.documentTypes.includes(operation)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setFormData((prev) => {
                                                                    const selected = new Set([...prev.documentTypes]);

                                                                    if (selected.has(value)) {
                                                                        selected.delete(value);
                                                                    } else {
                                                                        selected.add(value);
                                                                    }

                                                                    const updateddocumentTypes = Array.from(selected);

                                                                    formik.setFieldValue("documentTypes", updateddocumentTypes);
                                                                    return {
                                                                        ...prev,
                                                                        documentTypes: updateddocumentTypes, // Ensure a new reference
                                                                    };
                                                                });
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Form.Group>

                                            <div className='mt-4'>

                                                <div className='d-flex align-items-center justify-content-start'>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="allocateTaxOnSingleLine"
                                                        checked={formData.allocateTaxOnSingleLine}
                                                        onChange={handleMultipleInputChange}
                                                    /><p style={{ fontSize: "16px" }}>Return allocated tax on a single line instead of creating multiple lines</p>
                                                </div>

                                                {formData.multipleAllocations?.map((multipleAllocation, multipleAllocationIndex) => (
                                                    <div key={multipleAllocation.id} className="border p-3 mb-4">
                                                        <div className='d-flex justify-content-between mb-2'>
                                                            <h2>Operations</h2>
                                                            <Link to="#" className='fs-3 fw-bold' onClick={() => handleMultipleDeleteOperation(multipleAllocation.id)}>
                                                                <i className='las la-solid la-trash me-1 '></i> Delete Operation
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <h4>WHEN</h4>
                                                            <p style={{ fontSize: "16px" }}>Set the conditions that trigger the rule</p>
                                                            {multipleAllocation.conditions.map((condition, conditionIndex) => (
                                                                <div key={conditionIndex} className="mb-4">
                                                                    {/* Field and Operator Row */}
                                                                    <Row className="align-items-start">
                                                                        <Col md={2}>
                                                                            <Form.Group>
                                                                                <Form.Label htmlFor="field">Field</Form.Label>
                                                                                <Form.Select
                                                                                    id="field"
                                                                                    name="field"
                                                                                    value={condition.field}
                                                                                    onChange={(e) => handleMultipleConditionChange(multipleAllocationIndex, conditionIndex, 'field', e.target.value)}
                                                                                >
                                                                                    <option value="shipToState">Ship To State</option>
                                                                                    <option value="shipToCountry">Ship To Country</option>
                                                                                    <option value="shipFromState">Ship From State</option>
                                                                                    <option value="shipFromCountry">Ship From Country</option>
                                                                                    <option value="description">Description</option>
                                                                                    <option value="itemCode">Item Code</option>
                                                                                    <option value="taxCode">Tax Code</option>
                                                                                    <option value="customerCode">Customer Code</option>
                                                                                    <option value="entityUseCode">Entity Use Code</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col md={2}>
                                                                            <Form.Group>
                                                                                <Form.Label>Operator</Form.Label>
                                                                                <Form.Select
                                                                                    value={condition.operator}
                                                                                    onChange={(e) => handleMultipleConditionChange(multipleAllocationIndex, conditionIndex, 'operator', e.target.value)}
                                                                                >
                                                                                    <option value="equals_any_of_these">equals any of these</option>
                                                                                    <option value="starts_with_any_of_these">starts with any of these</option>
                                                                                    <option value="ends_with_any_of_these">ends with any of these</option>
                                                                                    <option value="is_not_any_of_these">is not any of these</option>
                                                                                    <option value="wild_card_match">wild card match</option>
                                                                                    <option value="contains_any_of_these">contains any of these</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col>
                                                                            {/* Values and Delete Buttons */}
                                                                            {condition.values.map((value, valueIndex) => (
                                                                                <Row key={valueIndex} className="align-items-center mb-3">
                                                                                    <Col md={2}></Col> {/* Empty column to align with Field */}
                                                                                    <Col md={2}></Col> {/* Empty column to align with Operator */}
                                                                                    <Col md={3}>
                                                                                        <Form.Group className="w-100">
                                                                                            <Form.Label htmlFor={`value-${valueIndex}`}>Value</Form.Label>
                                                                                            <Form.Control
                                                                                                id={`value-${valueIndex}`}
                                                                                                name={`value-${valueIndex}`}
                                                                                                type="text"
                                                                                                value={value}
                                                                                                onChange={(e) => {
                                                                                                    const updatedValues = [...condition.values];
                                                                                                    updatedValues[valueIndex] = e.target.value;
                                                                                                    handleMultipleConditionChange(
                                                                                                        multipleAllocationIndex,
                                                                                                        conditionIndex,
                                                                                                        'values',
                                                                                                        updatedValues
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Form.Group>
                                                                                    </Col>
                                                                                    <Col md={2} className="text-center">

                                                                                        <li
                                                                                            className="list-inline-item"
                                                                                            onClick={() => handleMultipleDeleteValue(multipleAllocationIndex, conditionIndex, valueIndex)}
                                                                                        >
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="btn btn-soft-danger btn-sm d-inline-block"
                                                                                            >
                                                                                                <i className="bi bi-trash fs-17 align-middle"></i>
                                                                                            </Link>
                                                                                        </li>
                                                                                    </Col>
                                                                                </Row>
                                                                            ))}

                                                                            {/* Add and Delete Condition Buttons */}
                                                                            <Row className="mt-3 align-items-center">
                                                                                <Col md={2}></Col> {/* Empty column to align with Field */}
                                                                                <Col md={2}></Col> {/* Empty column to align with Operator */}
                                                                                <Col md={5}>
                                                                                    <Button
                                                                                        variant="primary"
                                                                                        onClick={() => handleMultipleAddValue(multipleAllocationIndex, conditionIndex)}
                                                                                        className="w-100"
                                                                                    >
                                                                                        Add New Value
                                                                                    </Button>
                                                                                </Col>

                                                                            </Row>
                                                                        </Col>

                                                                        <Col md={2}>
                                                                            <Button
                                                                                variant="danger"
                                                                                onClick={() => handleMultipleDeleteCondition(multipleAllocationIndex, conditionIndex)}
                                                                                className="w-100"
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>


                                                                </div>
                                                            ))}
                                                        </div>

                                                        <Link to="#" className="mb-3 fs-5 " onClick={() => handleMultipleAddCondition(multipleAllocationIndex)}>
                                                            <i className='las la-plus-circle me-1'></i> Add Condition
                                                        </Link>

                                                        <div className='mt-4'>
                                                            <h4>Allocate</h4>
                                                            <p style={{ fontSize: "16px" }}>Bundled item transactions are split into multiple lines, one for each tax code added. Percentages must add up to 100%.</p>
                                                            {multipleAllocation.allocations.map((allocation, allocationIndex) => (
                                                                <Row className="mb-3 mt-4 d-flex align-items-center" key={allocationIndex}>
                                                                    <Col md={2}>
                                                                        <Form.Group>
                                                                            <Form.Label htmlFor='country'>COUNTRY</Form.Label>
                                                                            <Form.Select
                                                                                value={allocation.country}
                                                                                onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'country', e.target.value)}
                                                                            >
                                                                                <option>Select Country</option>
                                                                                {countries.map((country) => (
                                                                                    <option key={country.value} value={country.value}>
                                                                                        {country.name}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={2}>
                                                                        <Form.Label>ADDRESS LINE 1</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={allocation.addressLine1}
                                                                            onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'addressLine1', e.target.value)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={2}>
                                                                        <Form.Label>ADDRESS LINE 2</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={allocation.addressLine2}
                                                                            onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'addressLine2', e.target.value)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={2}>
                                                                        <Form.Label>CITY</Form.Label>
                                                                        <Form.Control
                                                                            placeholder="City"
                                                                            type="text"
                                                                            value={allocation.city}
                                                                            onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'city', e.target.value)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={2}>
                                                                        <Form.Label>STATE</Form.Label>
                                                                        <Form.Select
                                                                            value={allocation.state}
                                                                            onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'state', e.target.value)}
                                                                        >
                                                                            {Object.entries(regions).map(([key, value]) => (
                                                                                <option key={key} value={key}>
                                                                                    {value}
                                                                                </option>
                                                                            ))}

                                                                        </Form.Select>
                                                                    </Col>
                                                                    <Col md={2}>
                                                                        <Form.Label>ZIP CODE</Form.Label>
                                                                        <Form.Control
                                                                            placeholder="Zip Code"
                                                                            type="text"
                                                                            value={allocation.zipCode}
                                                                            onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'zipCode', e.target.value)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={2} className='mt-4'>
                                                                        <Form.Group>
                                                                            <Form.Label htmlFor='per'>PERCENT ALLOCATED</Form.Label>
                                                                            <InputGroup>
                                                                                <Form.Control
                                                                                    id="per"
                                                                                    name="number"
                                                                                    type="number"
                                                                                    value={allocation.percentage}
                                                                                    onChange={(e) => handleMultipleAllocationChange(multipleAllocationIndex, allocationIndex, 'percentage', e.target.value)}
                                                                                />
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={4} className='mt-4'>
                                                                        <Button
                                                                            variant="danger"
                                                                            onClick={() => handleMultipleDeleteAllocation(multipleAllocationIndex, allocationIndex)}
                                                                            className="mt-4 las la-trash-alt"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            ))}
                                                        </div>

                                                        <Link to="#" className="mb-3 fs-5" onClick={() => handleMultipleAddAllocation(multipleAllocationIndex)} >
                                                            <i className='las la-plus-circle me-1'></i>Add Allocation
                                                        </Link>

                                                    </div>
                                                ))}

                                                <div className='mt-2' >
                                                    <Link to="#" onClick={handleMultipleAddOperation} className='fs-5'>
                                                        <i className="las la-plus-circle me-1"></i> Add Operation
                                                    </Link>
                                                </div>
                                            </div>

                                        </>
                                    )
                                }

                                <div>
                                    <div className='mt-4'>
                                        <Form.Check
                                            type="checkbox"
                                            label="Ignore rule when an error occurs"
                                            name="ignoreRuleOnError"
                                            checked={formData.ignoreRuleOnError}
                                            onChange={handleInputChange}
                                        /><p style={{ fontSize: "16px" }}>Resolve errors by calculating tax as though the rule doesn't exist instead of rejecting the transaction</p>
                                    </div>
                                    <div className='mt-4'>
                                        <Form.Check
                                            type="checkbox"
                                            label="Inactive"
                                            name="inactive"
                                            checked={formData.inactive}
                                            onChange={handleInputChange}
                                        /><p style={{ fontSize: "16px" }}>Inactive rules are not applied to transactions</p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-start mt-4">
                                    <Button type="submit" variant="primary" className="me-2" >
                                        Save advanced transaction rule
                                    </Button>
                                    <Button variant="light"
                                        onClick={() => { navigate("/tax-rules", { state: { targetTab: "Transaction rules" } }); }}>
                                        Cancel
                                    </Button>

                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default AddTransactionRule;