import React from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';

interface Address {
  line1: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
}

interface AddressValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalAddress: Address | null;
  validatedAddress: Address | null;
  onUseValidated: () => void;
  onKeepOriginal: () => void;
  apiResponse?: any;
}

const AddressValidationModal: React.FC<AddressValidationModalProps> = ({
  isOpen,
  onClose,
  originalAddress,
  validatedAddress,
  onUseValidated,
  onKeepOriginal,
  apiResponse,
}) => {
  if (!originalAddress || !validatedAddress) return null;

  const formatAddress = (address: Address) => (
    <>
      <div>{address.line1}{address.address}</div>
      <div>{`${address.city}, ${address.region}, ${address.country}`}</div>
      <div>{address.postal_code}</div>
    </>
  );
 
  const addressComponents = apiResponse?.response?.result?.address?.addressComponents || [];
  const ignoredComponents = ["postal_code", "postal_code_suffix"];
  // Updated logic to check for both UNCONFIRMED_AND_SUSPICIOUS and UNCONFIRMED_BUT_PLAUSIBLE
  const hasInvalidComponents = addressComponents.some(
    (comp: any) => 
      (comp.confirmationLevel === "UNCONFIRMED_AND_SUSPICIOUS" ||
       comp.confirmationLevel === "UNCONFIRMED_BUT_PLAUSIBLE") && 
      !ignoredComponents.includes(comp.componentType)
  );

  return (
    <Modal show={isOpen} onHide={onClose} centered style={{ maxWidth: "100%" }}>
      <Modal.Header closeButton>
        <h3>
          {hasInvalidComponents 
            ? "The address you entered could not be found." 
            : "Address Validation Results"}
        </h3>
      </Modal.Header>
      <Modal.Body>
        {hasInvalidComponents ? (
          <>
            <Row>
              <Col style={{paddingLeft:"20px"}}>
                <p>Go back and fix the address, or use this one anyway:</p><br />
                <p>Address</p>
                <p>{formatAddress(originalAddress)}</p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
              <Card body className="bg-light" style={{ whiteSpace: "pre-wrap" }}>
                {"An unvalidated address can impact the accuracy of our tax\n" +
                  "calculation tools, which may affect your return filings. If you\n" +
                  "choose to use this address, carefully review your tax collection setup and ensure all necessary tax authorities are included."}
              </Card>

              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row style={{paddingLeft:"10px"}}>
              <Col>
                <h5>Original Address</h5>
                <div>{formatAddress(originalAddress)}</div>
              </Col>
              <Row className='mt-3'>
                <Col>
                  <h5>Validated Address</h5>
                  <div>{formatAddress(validatedAddress)}</div>
                </Col>
              </Row>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {hasInvalidComponents ? (
          <>
            <Button variant="primary" onClick={onKeepOriginal}>
              I'll fix the address
            </Button>
            <Button variant="secondary" onClick={onUseValidated}>
              Use this address anyway
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={onUseValidated}>
              Use validated address
            </Button>
            <Button variant="secondary" onClick={onKeepOriginal}>
              Keep original address
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddressValidationModal;