import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import '../MultiStepForm.css';
import { GridData } from '../data';

interface GuidelinesModalProps {
  show: boolean;
  handleClose: () => void;
}

export const ParentComponent: React.FC = () => {
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleShowFirstModal = () => setShowFirstModal(true);
  const handleCloseFirstModal = () => setShowFirstModal(false);

  const handleShowSecondModal = () => {
    setShowFirstModal(false); // Close the first modal
    setShowSecondModal(true); // Open the second modal
  };

  const handleCloseSecondModal = () => setShowSecondModal(false);

  return (
    <>
      <Button variant="primary" onClick={handleShowFirstModal}>
        Open Guidelines Modal
      </Button>
      <GuidelinesModal
        show={showFirstModal}
        handleClose={handleCloseFirstModal}
        handleShowGuidelines={handleShowSecondModal}
      />
      <ImportGuidelinesModal
        show={showSecondModal}
        handleClose={handleCloseSecondModal}
      />
    </>
  );
};

export const GuidelinesModal: React.FC<{
  show: boolean;
  handleClose: () => void;
  handleShowGuidelines: () => void;
}> = ({ show, handleClose, handleShowGuidelines }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Importing Transactions to ScalarTax</Modal.Title>
      </Modal.Header>
      <hr />
      {/* Apply a custom class to control the height and scrolling */}
      <Modal.Body className="custom-modal-body">
        <p>
          <span>
            <a href="#" onClick={handleShowGuidelines}>
              Importing transactions
            </a>{' '}
          </span>{' '}
          to ScalarTax involves filling out a template to create the import
          file. Clicking the attachment icon opens the attachment pop-up with a
          list of attachments. Select the appropriate template, or log in to
          ScalarTax and go to{' '}
          <strong>Transactions &gt; Import transactions</strong> and download it
          there.
        </p>
        <hr />
        <h5>Keep these guidelines in mind when filling out the template:</h5>
        <ul>
          <li>
            Use this article to determine which columns you need to fill out as
            well as how to fill them out.
          </li>
          <li>
            Pay attention to the process code (Column A), which determines how
            the transaction import is processed and what other information is
            necessary.
          </li>
          <li>Don't exceed an entry's character limit.</li>
          <li>
            Before you import a large number of transactions, try importing a
            few transactions to get familiar with how it works.
          </li>
          <li>
            An import file is limited to 100,000 lines, and a single DocCode
            can't exceed 1,000 line items.
          </li>
        </ul>
        <div className="data-grid">
          <h1>Transaction Data Grid</h1>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Name</th>
                  <th>What it Means</th>
                  <th>Possible Values</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {GridData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Column}</td>
                    <td>{item.Name}</td>
                    <td>{item.Meaning}</td>
                    <td>{item.PossibleValues}</td>
                    <td>{item.Notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-light" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export const ImportGuidelinesModal: React.FC<GuidelinesModalProps> = ({
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Importing Transactions to ScalarTax</Modal.Title>
      </Modal.Header>
      <hr />
      <Modal.Body className="custom-modal-body">
        <h6 className="tax-muted">
          When you import transactions for tax types other than sales and use
          tax, you need to set some general rules for how ScalarHub handles your
          import file and match the columns from your spreadsheet to the values
          ScalarHub uses to process transactions. When you're done, save your
          configuration as a template and use it to upload transaction data next
          time.
        </h6>
        <Alert variant="warning">
          <Alert.Heading>Tip</Alert.Heading>
          <p>
            For instructions on importing using a template—either the ScalarHub
            Import Template or one you made previously—see
            <Alert.Link href="#" className="custom-link">
              {' '}
              Import Transactions (legacy).
            </Alert.Link>
            .
          </p>
          <hr />
        </Alert>
        <h2>Steps</h2>
        <ol>
          <li>
            <em>
              From the ScalarHub home page, go to{' '}
              <strong>Transactions &gt; Import transactions</strong>.
            </em>
          </li>
          <li>
            <em>
              Select <strong>Use an import template</strong> or{' '}
              <strong>Create a new custom template</strong>. If you're using an
              existing template, you'll upload the file and simply check
              everything to be sure it's correct. If you upload your own
              (custom) file, complete the next steps.
            </em>
          </li>
          <li>
            <em>
              Select the <strong>XLXS</strong>, <strong>XLS</strong>, or{' '}
              <strong>CSV</strong> file you want to upload.
            </em>
          </li>
          <li>
            <em>
              Choose your settings for document type, process code, and, if you
              sell internationally, importer of record.
            </em>
            <ul>
              <li>
                <strong>
                  Match a column from your template: Choose a column from your
                  transactions file to map to document type or process code..
                </strong>
              </li>
              <li>
                <strong>
                  Assign the same value to all transactions: Assign the same
                  code to all transactions, and edit them later if needed.
                </strong>
              </li>
            </ul>
          </li>
          <li>
            <em>Select Next when you've finished your import settings.</em>
          </li>
          <li>
            <em>
              Map your Required columns by selecting the corresponding column
              from your spreadsheet. This is required for ScalarHub to process
              your transactions. When you're done, select Next.
            </em>
            <ul>
              <li>
                <strong>
                  For example, map the column where you store the date of each
                  transaction to the Document Date column.
                </strong>
              </li>
            </ul>
          </li>
          <li>
            <em>
              In the Add attributes page, complete the attributes that fit with
              your transactions. If you need more or different attributes, you
              can Add or edit attributes, or Remove them as needed. Based on
              your configuration, attributes you likely need are already
              selected. When you're done, select Next.
            </em>
          </li>
          <Alert variant="warning">
            <Alert.Heading>Tip</Alert.Heading>
            <p>
              Attributes send more information about the products that you sell
              to more accurately calculate tax. To learn more, see the
              <Alert.Link href="#" className="custom-link">
                {' '}
                Product and service attribute guidelines..
              </Alert.Link>
              .
            </p>
            <hr />
          </Alert>
          <li>
            <em>Map any additional columns from your transaction data.</em>

            <ol type="a">
              <li>
                {' '}
                If you've added certain process codes, there can be required
                columns that you must add in this step. Click{' '}
                <strong>Remind me what those are</strong> to make sure you have
                all the required columns.
              </li>
              <li>
                Other than the process code columns, this information isn't
                needed for tax calculation, but it makes your data more
                complete.
              </li>
              <li>Any columns you don't map aren't imported.</li>
              <li>When you're done, select Next.</li>
            </ol>
          </li>
          <li>
            <em>
              Look over your import settings, mappings and attributes, and
              select Edit if you need to make changes.
            </em>
          </li>
          <li>
            <em>
              To be able to use this mapping for later transaction imports,
              select Save This Mapping as a Template and enter a name for the
              template.
            </em>
          </li>
          <li>
            <em>Select Finish.</em>
          </li>
        </ol>
        <h2>Steps</h2>
        <h6 className="tax-muted">
          After you click finish, your transactions begin processing. You can
          check the status by choosing Follow your import's progress. Otherwise,
          you can import more transactions or go back to the Home page. If you
          get any errors in your file, they're displayed in the first column.
          You can learn how to fix them with Fix transaction import errors.
          Refer to the Import transactions (using your own files) video to
          import transactions to ScalarTax.
        </h6>

        <hr />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
