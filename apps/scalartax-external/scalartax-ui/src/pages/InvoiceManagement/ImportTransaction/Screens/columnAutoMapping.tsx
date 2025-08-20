import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

interface ImportSettings {
  companyCode: string;
  type: string;
  processCode: string;
  entityUseCode: string;
}

interface RequiredColumns {
  [section: string]: { [key: string]: string };

}

interface Attributes {
  [key: string]: string;
}

interface OptionalColumns {
  [key: string]: string;
}

interface MappedColumns {
  importSettings: ImportSettings;
  requiredColumns: RequiredColumns;
  attributes: Attributes;
  optionalColumns: OptionalColumns;
}

interface Template {
  id: string;
  template_name: string;
  mapped_columns: string;
}

interface Props {
  templateId: string | null;
  fileData: any | null;
  selectedTemplates: any | null;
  onSubmit: (data: any) => void;
}

const MappingReview = forwardRef((props: Props, ref) => {

  const { onSubmit, templateId, fileData, selectedTemplates } = props;
  const [templates, setTemplates] = useState<Template[]>([]);
  const columnHeaders = fileData?.[0] || [];
  const dataRows = fileData?.slice(1);

  const [mappedColumns, setMappedColumns] = useState<MappedColumns>({
    importSettings: {
      companyCode: '',
      type: '',
      processCode: '',
      entityUseCode: '',
    },
    requiredColumns: {
      requiredFields: {
        'document code': '',
        date: '',
        'customer code': '',
        'line number': '',
        'item code': '',
        'line amount': '',
      },
      originAddress: {
        country: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        region: '',
        postalCode: '',
        locationCode: '',
      },
      originCoordinates: {
        Latitude: '',
        Longitude: '',
      },
      destinationAddress: {
        country: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        region: '',
        postalCode: '',
        locationCode: '',
      },
      destinationCoordinates: {
        'Destination Latitude': '',
        'Destination Longitude': '',
      },

    },
    attributes: {
      Availability: '',
      'Average Daily Rate': '',
      'Base Room Rate': '',
      'Beverage Container Material': '',
    },
    optionalColumns: {
      'Line item code': '',
      'Line tax code': '',
      'Line tax override tax amount': '',
      'Line tax override tax date': '',
      'Exemption number': '',
    },
  });


  interface TransformedData {
    importSettings: any[]; // Adjust `any` to the appropriate type if known
    requiredColumns: {
      originAddress?: string;
      originCoordinates?: object;
      destinationAddress?: string;
      destinationCoordinates?: object;
      originLocationCode?: string | null;
      destinationLocationCode?: string | null;
      [key: string]: any; // To handle additional properties
    }[];
    attributes: any[]; // Adjust `any` to the appropriate type if known
    optionalColumns: any[]; // Adjust `any` to the appropriate type if known
  }

  const transformData = (data: any): TransformedData => {
    // Initialize transformed object structure with explicit typing
    const transformed: TransformedData = {
      importSettings: [],
      requiredColumns: [],
      attributes: [],
      optionalColumns: [],
    };

    // Iterate through the original data
    Object.values(data).forEach((item: any) => {
      // Push items into respective arrays
      transformed.importSettings.push(item.importSettings);

      const requiredColumn = {
        ...item.requiredColumns.requiredFields,
        originAddress: item.requiredColumns.originAddress,
        originCoordinates: item.requiredColumns.originCoordinates || {},
        destinationAddress: item.requiredColumns.destinationAddress,
        destinationCoordinates: item.requiredColumns.destinationCoordinates || {},
        originLocationCode: item.requiredColumns.origin || null,
        destinationLocationCode: item.requiredColumns.destination || null,
      };
      transformed.requiredColumns.push(requiredColumn);

      transformed.attributes.push(item.attributes);
      transformed.optionalColumns.push(item.optionalColumns);
    });

    return transformed;
  };

  const handleTemplateSelection = (templateId: string) => {
    const selectedTemplate = templates.find((template) => template.id === templateId);
    if (!selectedTemplate || !selectedTemplate.mapped_columns) {
      console.error("Selected template or mapped columns not found.");
      return;
    }

    // Parse mapped_columns JSON string
    let mappedColumns: any;
    try {
      mappedColumns = JSON.parse(selectedTemplate.mapped_columns);
    } catch (error) {
      console.error("Failed to parse mapped_columns JSON:", error);
      return;
    }


    setMappedColumns(mappedColumns);

    const mapRowToStructure = (structure: any, row: any): any => {
      if (typeof structure === "string") {
        const headerIndex = columnHeaders.indexOf(structure);
        return headerIndex !== -1 ? row[headerIndex] : null;
      }

      if (typeof structure === "object" && structure !== null) {
        const mappedObject: any = {};
        Object.entries(structure).forEach(([key, value]) => {
          mappedObject[key] = mapRowToStructure(value, row);
        });
        return mappedObject;
      }

      return null;
    };

    const mappedData = dataRows.map((row: any) => {
      return mapRowToStructure(mappedColumns, row);
    });

    const result = transformData(mappedData);
    onSubmit(result);
  };

  useEffect(() => {
    if (templateId && templates) {
      setTemplates(selectedTemplates);
      handleTemplateSelection(templateId);
    }
  }, [templateId, templates]);


  useImperativeHandle(ref, () => ({
    submit: async () => {
      return true;
    },
  }));

  const toReadableFormat = (camelCase: string): string => {
    return camelCase
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    <div className="page-content">
      {/* Summary of Mapped Columns */}
      <div>
        <h3>Mapped Columns Summary</h3>
        {mappedColumns && (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Predefined Column</th>
                <th>Mapped File Column</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mappedColumns).flatMap(([section, fields]) => {
                if (section === 'requiredColumns' && typeof fields === 'object') {
                  return Object.entries(fields).flatMap(([subSection, mapping]) =>
                    mapping && typeof mapping === 'object'
                      ? Object.entries(mapping).map(([key, value]) => (
                        <tr key={`${section}-${subSection}-${key}`}>
                          <td>
                            {toReadableFormat(section)} - {toReadableFormat(subSection)}
                          </td>
                          <td>{key}</td>
                          <td>{typeof value === 'string' ? value : ''}</td>
                        </tr>
                      ))
                      : []
                  );
                } else if (section === 'attributes' && typeof fields === 'object') {
                  return Object.entries(fields).map(([key, value]) => (
                    <tr key={`${section}-${key}`}>
                      <td>{toReadableFormat(section)}</td>
                      <td>{key}</td>
                      <td>{typeof value === 'string' ? value : ''}</td>
                    </tr>
                  ));
                } else if (section === 'optionalColumns' && typeof fields === 'object') {
                  return Object.entries(fields).map(([key, value]) => (
                    <tr key={`${section}-${key}`}>
                      <td>{toReadableFormat(section)}</td>
                      <td>{key}</td>
                      <td>{typeof value === 'string' ? value : ''}</td>
                    </tr>
                  ));
                }
                return [];
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>

  );

});

export default MappingReview;