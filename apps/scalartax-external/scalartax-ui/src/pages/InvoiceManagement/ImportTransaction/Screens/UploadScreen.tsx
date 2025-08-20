import React, {
  useState,
  forwardRef,
  useRef,
  useEffect,
} from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { TbCloudDownload } from 'react-icons/tb';
import { LiaExclamationCircleSolid } from 'react-icons/lia';
import { GuidelinesModal, ImportGuidelinesModal } from './Models';
import ImportFile from './importFile';
import '../MultiStepForm.css';
import { handleDownload } from '../Utils';
import MappingReview from './columnAutoMapping';
import { useDispatch, useSelector } from 'react-redux';
import { getTemplates as onGetTemplates } from '../../../../slices/thunk';
import { createSelector } from 'reselect';

interface Props {
  data: any;
  updateData: (data: any) => void;
  formRef: React.MutableRefObject<
    { submit: () => Promise<boolean> } | undefined
  >;
  updateTemplate: (template: string) => void;
  updateFile: (file: any) => void;
}

const UploadScreen = forwardRef((props: Props, ref) => {
  const { data, updateData, formRef, updateTemplate, updateFile } = props;
  const [showTemplate, setShowTemplate] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const templateTarget = useRef<HTMLSpanElement | null>(null);
  const customTarget = useRef<HTMLSpanElement | null>(null);
  const [file, setFile] = useState();
  const [radioOption, setRadioOption] = useState<'savedTemplate' | 'custom'>(
    'savedTemplate'
  );
  const [templates, setTemplates] = useState(() => [
    'ScalarHub import template',
    'ScalarHub sales tax document line export',
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(
    'ScalarHub import template'
  );
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleChange = () => {
    setRadioOption('custom');
    setSelectedTemplate('ScalarHub import template');
  };

  useEffect(() => {
    updateTemplate(radioOption);
  }, [radioOption]);

  const selectTemplateList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      templateList: invoices.templateList,
    })
  );
  const { templateList } = useSelector(selectTemplateList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (templateList) {
      setTemplates(templateList);
    }
  }, [templateList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Node) {
        // Check for custom tooltip
        if (
          customTarget.current &&
          !customTarget.current.contains(event.target)
        ) {
          setShowCustom(false);
        }

        // Check for template tooltip
        if (
          templateTarget.current &&
          !templateTarget.current.contains(event.target)
        ) {
          setShowTemplate(false);
        }
      }
    };

    // Only add listener if either tooltip is shown
    if (showCustom || showTemplate) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCustom, showTemplate]);

  const handleShowFirstModal = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setShowTemplate(false);
    setShowFirstModal(true);
  };
  const handleCloseFirstModal = () => setShowFirstModal(false);
  const handleCloseSecondModal = () => setShowSecondModal(false);
  const handleShowSecondModal = () => {
    setShowFirstModal(false); // Close the first modal
    setShowSecondModal(true); // Open the second modal
  };

  const handleSubmitFile = (data: any) => {
    updateData(data);
    setFile(data);
    if (radioOption === 'savedTemplate') {
      setShowReview(true);
    }
  };

  const handleSubmitReview = (data: any) => {
    updateData(data);
  };

  const updateFileData = (file: any) => {
    updateFile(file);
  };

  return (
    <div className="uploadScreen mt-2">
      {(!showReview) ? (
        <div>
          <Row>
            <Col>
              <h2>Import Transactions</h2>
              <p className="mt-2 custom-paragraph">
                Upload transactions using an import template or create a custom
                template using a transaction file from your business
                application.
              </p>
            </Col>
          </Row>
          {/* Radio buttons */}
          <div>
            <Form.Group style={{ display: 'inline-flex' }}>
              <Form.Check
                type="radio"
                label="Use an import template"
                id="radio-template"
                checked={radioOption === 'savedTemplate'}
                onChange={() => setRadioOption('savedTemplate')}
              />
              <span
                className="excla-ico"
                ref={templateTarget} // Attach the template ref
                onMouseEnter={() => setShowTemplate(true)}
                onClick={() => setShowTemplate(false)}
              >
                <LiaExclamationCircleSolid />
              </span>
              <Overlay
                target={templateTarget.current}
                show={showTemplate}
                placement="right"
              >
                {(props) => (
                  <Tooltip className="custom-tooltip" {...props}>
                    Add your transactions to an ScalarHub template or a custom
                    template that you've already made. ScalarHub import files
                    must meet the template requirements listed on the ScalarHub
                    Help Center.
                    <span>
                      <a href="#" onClick={handleShowFirstModal}>
                        View template guidelines.
                      </a>
                    </span>
                    <br />
                    Use the Sales Tax Document Line Export option to edit
                    transactions that are already in ScalarTax. First, run a
                    sales tax document line export report for this company, edit
                    the transactions in that file, and then import the updated
                    version on this page.
                    <span>
                      <a href="URL">
                        {' '}
                        Create a sales tax document data export report.
                      </a>
                    </span>
                  </Tooltip>
                )}
              </Overlay>
            </Form.Group>
            <GuidelinesModal
              show={showFirstModal}
              handleClose={handleCloseFirstModal}
              handleShowGuidelines={handleShowSecondModal}
            />
            <ImportGuidelinesModal
              show={showSecondModal}
              handleClose={handleCloseSecondModal}
            />
            {radioOption === 'savedTemplate' &&
              selectedTemplate === 'ScalarHub import template' && (
                <div>
                  <Form.Group
                    style={{ fontSize: 'smaller', marginTop: '10px' }}
                  >
                    <Form.Label>Template</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      style={{ width: '50%' }}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      {templates && templates.length > 0 ? (
                        templates.map((template: any) => {
                          const mappedColumns =
                            typeof template.mapped_columns === 'string'
                              ? JSON.parse(template.mapped_columns)
                              : template.mapped_columns || {};
                          return (
                            <option key={template.id} value={template.id}>
                              {template.template_name} 
                            </option>
                          );
                        })
                      ) : (
                        <option value="">No templates available</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                  <div className="download-box">
                    <div>Download the ScalarTax import template</div>
                    {[
                      ['ImportTransactionsTemplate.csv', '.csv', {}],
                      ['ImportTransactionsTemplate.xls', '.xls', {}],
                      [
                        'ImportTransactionsHelp_Protected.xlsx',
                        '.xsls',
                        {
                          width: '178px',
                          border: 'none',
                        } as React.CSSProperties | any | undefined,
                      ],
                    ].map(([file, ext, style]) => (
                      <div
                        className="download-icon cst-link"
                        onClick={() => handleDownload(file as string)}
                        style={style as React.CSSProperties}
                      >
                        <TbCloudDownload />
                        <div>
                          {style && style.width ? `Example File (${ext})` : ext}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div>
              <Form.Group style={{ display: 'inline-flex' }}>
                <Form.Check
                  type="radio"
                  label="Create a new custom template"
                  id="radio-custom"
                  checked={radioOption === 'custom'}
                  onChange={handleChange}
                />
                <span
                  className="excla-ico"
                  ref={customTarget} // Attach the custom ref
                  onMouseEnter={() => setShowCustom(true)}
                  onClick={() => setShowCustom(false)}
                >
                  <LiaExclamationCircleSolid />
                </span>
                <Overlay
                  target={customTarget.current}
                  show={showCustom}
                  placement="right"
                >
                  {(props) => (
                    <Tooltip className="custom-tooltip" {...props}>
                      Upload your own .csv, .xls, or .xlsx file full of
                      transaction data, match a few columns to key ScalarTax
                      fields, and then save the template to use next time. Your
                      file must have separate columns for these values:
                      <ul>
                        <li>Document Code</li>
                        <li>Document Date</li>
                        <li>Customer Code</li>
                        <li>Line Number</li>
                        <li>Line Amount</li>
                        <li>Destination (Ship-to) address information</li>
                        <li>Origin (Ship-from) address information</li>
                      </ul>
                    </Tooltip>
                  )}
                </Overlay>
              </Form.Group>
            </div>
          </div>

          {/* Additional content */}
          <details style={{ display: 'inline' }}>
            <summary className="cst-link">
              Required information for a successful import
            </summary>
            <ul>
              <li>
                Process Code and Document Type to apply the right calculation
                method
              </li>
              <li>
                Document Code, Customer Code, Line Number, and Amount to
                identify transactions and calculate tax
              </li>
              <li>
                Origin and Destination address information like region and
                postal code, to calculate for the right tax jurisdiction
              </li>
            </ul>
          </details>
          <div className="uploadScreen">
            <ImportFile
              onSubmit={handleSubmitFile}
              ref={formRef}
              template={radioOption}
              updateFile={updateFileData}
            />
          </div>
        </div>
      ) : (
        <div className="uploadScreen">
          <MappingReview
            onSubmit={handleSubmitReview}
            templateId={selectedTemplate}
            selectedTemplates={templates}
            fileData={file}
            ref={formRef}
          />
        </div>
      )}
    </div>
  );
});

export default UploadScreen;