import React,{useRef} from 'react'
import { Card, Col, Dropdown, Form, Row, Nav, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { createSelector } from 'reselect';


const ReferenceLists = () => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    // Trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // Handle the file upload logic here
    }
  };

  return (
    <React.Fragment>
      <Row className="pb-4 gy-8">
        <Col sm={8}>
          <h2 style={{}}>About reference lists</h2>
          <p>
          Import a list of data values from your business application. These lists serve as a data source for ScalarTax to reference during advanced rule calculations.
          </p>
        
        </Col>
      </Row>

      <Row className="pb-4 gy-4 mb-4">
        <Col sm={12}>
          <Link to="#" onClick={handleImportClick}>
            <i className="las la-plus-circle me-1"></i> Import a reference lists
          </Link>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e)}
          />
        </Col>

      </Row>

      <Row>
        <NoSearchResult />
      </Row>

    </React.Fragment>
  )
}

export default ReferenceLists;

