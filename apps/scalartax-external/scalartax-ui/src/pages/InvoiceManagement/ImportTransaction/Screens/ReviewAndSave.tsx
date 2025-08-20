import React, { useState } from 'react';
import { Data } from '../types';

interface ReviewAndSaveProps {
  data: Data;
  updateData: (data: Partial<Data>) => void;
}

const ReviewAndSave: React.FC<ReviewAndSaveProps> = ({ data, updateData }) => {
  const renderFields = (section: { [key: string]: any } | null) => {
    if (section === null) {
      return null; // Handle null case
    }

    return Object.entries(section).map(([key, value]) => {
      // Ensure value is not null and is an object before further processing
      if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).length > 0) {
          return (
            <div key={key}>
              <h4>{key}</h4>
              {renderFields(value)}{' '}
              {/* Recursively render fields for nested objects */}
            </div>
          );
        }
        return null; // Skip empty objects
      } else {
        // Render non-object values directly
        return (
          <p key={key}>
            <strong>{key}:</strong> {value?.toString()}
          </p>
        );
      }
    });
  };

  const renderSection = (sectionData: any[], sectionName: string) => {
    const hasValidData = sectionData?.some((item) => {
      if (item === null || typeof item !== 'object') return false; // Check for null and non-object items
      return Object.keys(item).length > 0; // Only consider non-empty objects
    });

    return (
      <div>
        <h3 className="mt-4">{sectionName}</h3>
        {hasValidData ? (
          sectionData.map((item: any, index: number) =>
            item && typeof item === 'object' && Object.keys(item).length > 0 ? (
              <div className="ms-2" key={index}>
                {renderFields(item)}
              </div>
            ) : null
          )
        ) : (
          <div className="ms-4">Not Mapped</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Review and Save</h2>
      <p className="mt-2 custom-paragraph">
        These are the columns and attributes you mapped for calculating tax on
        your transactions. Look over your choices to make sure everything’s
        correct before you finish importing your transaction data.
      </p>

      {renderSection(data.importSettings, 'Import Settings')}
      {renderSection(data.requiredColumns, 'Required Columns')}
      {renderSection(data.attributes, 'Attributes')}
      {renderSection(data.optionalColumns, 'Optional Columns')}
    </div>
  );
};

export default ReviewAndSave;
