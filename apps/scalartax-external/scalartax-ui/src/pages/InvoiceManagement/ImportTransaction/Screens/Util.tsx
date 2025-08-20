import React, { useState, forwardRef } from 'react';
import ImportSettings from './ImportSettings';
import RequiredColumns from './RequiredColumns';
import Attributes from './Attributes';
import OptionalColumns from './OptionalColumns';
import ReviewAndSave from './ReviewAndSave';
import UploadScreen from './UploadScreen';
import { Step, Data } from '../types';
import { init } from 'i18next';

interface MultiStepFormRendererProps {
  step: Step;
  formData: Data;
  initialValues: Data;
  updateFormData: (data: Partial<Data>) => void;
  updateInitialValues: (values: Partial<Data>) => void;
  formRef: React.MutableRefObject<
    { submit: () => Promise<boolean> } | undefined
  >;
  updateTemplateData: (template: string) => void;
  updateFile: (file: any) => void;
}

export const MultiStepFormRenderer = forwardRef<
  { submit: () => Promise<boolean> },
  MultiStepFormRendererProps
>(
  (
    {
      step,
      formData,
      initialValues,
      updateFormData,
      updateInitialValues,
      formRef,
      updateTemplateData,
      updateFile,
    },
    ref
  ) => {
    const [uploadData, setUploadData] = useState<string[][]>([]);

    const setData = (data: any) => {
      setUploadData(data);
      updateFormData(data);
    };
    switch (step) {
      case 1:
        return (
          <UploadScreen
            data={uploadData}
            updateData={setData}
            formRef={formRef}
            updateTemplate={(template: any) => updateTemplateData(template)}
            updateFile={(file: any) => updateFile(file)}
          />
        );
      case 2:
        return (
          <ImportSettings
            ref={formRef}
            data={formData.importSettings}
            initialValues={initialValues.importSettings}
            uploadData={uploadData}
            updateData={(data) => updateFormData({ importSettings: data })}
            updateValues={(values) =>
              updateInitialValues({ importSettings: values })
            }
          />
        );
      case 3:
        return (
          <RequiredColumns
            ref={formRef}
            data={formData.requiredColumns}
            initialValues={initialValues.requiredColumns}
            uploadData={uploadData}
            updateData={(data) => updateFormData({ requiredColumns: data })}
            updateValues={(values) =>
              updateInitialValues({ requiredColumns: values })
            }
          />
        );
      case 4:
        return (
          <Attributes
            ref={formRef}
            data={formData.attributes}
            initialValues={initialValues.attributes}
            uploadData={uploadData}
            updateData={(data) => updateFormData({ attributes: data })}
            updateValues={(values) =>
              updateInitialValues({ attributes: values })
            }
          />
        );
      case 5:
        return (
          <OptionalColumns
            ref={formRef}
            data={formData.optionalColumns}
            initialValues={initialValues.optionalColumns}
            uploadData={uploadData}
            updateData={(data) => updateFormData({ optionalColumns: data })}
            updateValues={(values) =>
              updateInitialValues({ optionalColumns: values })
            }
          />
        );
      case 6:
        return (
          <ReviewAndSave
            data={formData}
            updateData={(data) => updateFormData({ reviewData: data })}
          />
        );
      default:
        return (
          <UploadScreen
            data={uploadData}
            updateData={setData}
            formRef={formRef}
            updateTemplate={(template: any) => updateTemplateData(template)}
            updateFile={(file: any) => updateFile(file)}
          />
        );
    }
  }
);