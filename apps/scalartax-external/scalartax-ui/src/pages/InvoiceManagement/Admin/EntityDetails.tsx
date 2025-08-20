import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form } from 'react-bootstrap';

const EntityDetails = () => {
  document.title = 'Entity Details | Scalarhub';
  const [companyName, setCompanyName] = useState('SCALARHUB');
  const [primaryAddress, setPrimaryAddress] = useState(
    '11473 Beechnut Street Ventura, CA, 93004 United States'
  );
  const [ein, setEin] = useState('82-1022669');
  const [primaryContact, setPrimaryContact] = useState({
    firstName: 'Deepak',
    lastName: 'Kumar',
    title: '',
    email: 'abc@gmail.com',
  });
  const [isStandalone, setIsStandalone] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [isOnlineMarketplace, setIsOnlineMarketplace] = useState(false);
  const [status, setStatus] = useState('ACTIVE');
  const [isIOSSIntermediary, setIsIOSSIntermediary] = useState(false);
  const [attributes, setAttributes] = useState([{ attribute: '', value: '' }]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrimaryContact({ ...primaryContact, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsIOSSIntermediary(e.target.checked);
    // Reset selected attribute when checkbox is unchecked
    if (!e.target.checked) {
      const updatedAttributes = [...attributes];
      updatedAttributes[0].attribute = '';
      setAttributes(updatedAttributes);
    }
  };

  const handleAttributeInputChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedAttributes = [...attributes];
    updatedAttributes[index][name as keyof (typeof updatedAttributes)[0]] =
      value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { attribute: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform save action
    // console.log('Company Info Saved:', {
    //   companyName,
    //   primaryAddress,
    //   ein,
    //   primaryContact,
    //   isStandalone,
    //   isDefault,
    //   isOnlineMarketplace,
    //   status,
    //   isIOSSIntermediary,
    //   attributes
    // });
  };

  // Function to dynamically determine options for the second attribute based on the first attribute
  const getSecondAttributeOptions = (selectedAttribute: string) => {
    switch (selectedAttribute) {
      case '288547055': // Eating facility provisions
        return [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
        ];
      // Add more cases for other attributes as needed
      default:
        return [];
    }
  };

  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{ backgroundColor: 'white', paddingLeft: '10px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ paddingRight: '10px' }}>COMPANIES </span>{' '}
            {companyName}
            <a href="#" onClick={() => console.log('Switch company clicked')}>
              Switch company
            </a>
          </div>
          <p style={{ paddingTop: '50px' }}>
            <span style={{ paddingRight: '20px' }}>Company:</span> {companyName}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ paddingRight: '100px' }}>COMPANY LOCATIONS</span>
            <a
              href="#"
              onClick={() => console.log('Manage company locations clicked')}
            >
              Manage company locations
            </a>
          </div>
          <p style={{ paddingTop: '20px' }}>
            <span style={{ paddingRight: '70px' }}>
              PRIMARY BUSINESS ADDRESS
            </span>{' '}
            {primaryAddress}
          </p>
          <br />
          <hr />
          <Form style={{ paddingLeft: '10px' }} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>COMPANY NAME</label>
              <Form.Control
                type="text"
                id="companyName-input"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="ScalarHub"
              />
            </div>
            <div className="mb-3">
              <label>BUSINESS ID (BIN)</label>
              <Form.Control
                type="text"
                id="businessId-input"
                name="businessId"
              />
            </div>
            <div className="mb-3">
              <label>TAXPAYER ID (EIN)</label>
              <Form.Control
                type="text"
                id="taxpayerId-input"
                name="taxpayerId"
                value={ein}
                onChange={(e) => setEin(e.target.value)}
                placeholder="82-1022669"
              />
            </div>
            <div className="mb-3">
              <label>IOSS REGISTRATION NUMBER</label>
              <Form.Control
                type="text"
                id="iossRegistration-input"
                name="iossRegistration"
              />
            </div>
            <p>
              <input
                type="checkbox"
                id="iossIntermediary"
                name="iossIntermediary"
                checked={isIOSSIntermediary}
                onChange={handleCheckboxChange}
              />
              <span style={{ paddingLeft: '10px' }}>
                I have appointed an IOSS-registered intermediary
              </span>
            </p>
            <>
              {attributes.map((attr, index) => (
                <div key={index} className="mb-3">
                  <label>Attribute</label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <select className="form-control" name="attribute">
                      <option value="">Select</option>
                      <option value="286733004">
                        Ciro deminimis exception
                      </option>
                      <option value="288547055">
                        Eating facility provisions
                      </option>
                      <option value="288546110">Establishment type</option>
                      <option value="285162141">Iossregno</option>
                      <option value="286708540">
                        Is assembly or installation
                      </option>
                      <option value="286331196">
                        Is eu distance sales threshold exceeded
                      </option>
                      <option value="285157256">
                        Is intermediary appointed
                      </option>
                      <option value="288536324">
                        Is registered solar dealer
                      </option>
                      <option value="284756863">
                        Ismerchantsellertaxdependency
                      </option>
                      <option value="286303966">Lodging marketplace</option>
                      <option value="288543586">Maintains inventory</option>
                      <option value="288546522">
                        Number of units for rent
                      </option>
                      <option value="288543831">Pick up option</option>
                      <option value="288547022">
                        Prepared food threshold met
                      </option>
                      <option value="288530606">
                        Real property tax classification
                      </option>
                      <option value="288547107">Seller classification</option>
                      <option value="284758068">Sez</option>
                      <option value="285175177">Supplyofservice</option>
                      <option value="288536317">
                        Texas alcohol beverage license type
                      </option>
                      <option value="288530387">Venue type</option>
                    </select>

                    <label>Value</label>
                    <select
                      value={attr.value}
                      onChange={(e) => handleAttributeInputChange(e, index)}
                      className="form-control"
                      name="value"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      {getSecondAttributeOptions(attr.attribute).map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="btn btn-danger"
                      style={{ marginLeft: '10px' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={handleAddAttribute}
                  style={{ textDecoration: 'none' }}
                >
                  {' '}
                  + Attributes
                </button>
              </div>
            </>
          </Form>
          <br />
          <hr />
          <h4>Primary contact information</h4>
          <p>
            This is used to fill the signer information on sales tax documents
            that ScalarHub prepares for your Entity.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ paddingRight: '10px' }}>
                <label>PRIMARY CONTACT FIRST NAME</label>
              </span>
              <label>PRIMARY CONTACT LAST NAME</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
              <span style={{ paddingRight: '10px' }}>
                <input
                  type="text"
                  name="firstName"
                  value={primaryContact.firstName}
                  onChange={handleInputChange}
                />
              </span>
              <input
                type="text"
                name="lastName"
                value={primaryContact.lastName}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '120px' }}
            >
              <span style={{ paddingRight: '100px' }}>
                <label>TITLE</label>
              </span>
              <label>EMAIL ADDRESS</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
              <span style={{ paddingRight: '10px' }}>
                <input
                  type="text"
                  name="title"
                  value={primaryContact.title}
                  onChange={handleInputChange}
                />
              </span>
              <input
                type="email"
                name="email"
                value={primaryContact.email}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <hr />
            <label>
              <h4>Is {companyName} a standalone entity or a child entity?</h4>
              STANDALONE COMPANY
              <br />
              <input
                type="checkbox"
                name="isStandalone"
                checked={!isStandalone}
                onChange={() => setIsStandalone(!isStandalone)}
              />
              <span style={{ paddingLeft: '10px' }}>
                Organize this entity under a parent entity
              </span>
            </label>
            {!isStandalone && (
              <>
                <div style={{ paddingLeft: '20px' }}>
                  <label>PARENT COMPANY</label>
                  <Form.Control
                    type="text"
                    id="parentCompany-input"
                    name="parentCompany"
                  />
                  <h4 style={{ paddingTop: '20px' }}>
                    Inherit the tax collection settings?
                  </h4>
                  <p>
                    This entity can inherit the tax collection settings of its
                    parent entity. We recommend that entities that file taxes
                    together share tax collection settings.
                  </p>
                  <label>
                    <input type="checkbox" name="taxCollection" />
                    <span style={{ paddingLeft: '10px' }}>
                      Use the tax collection settings of the parent entity{' '}
                    </span>
                    <span style={{ color: 'red', paddingLeft: '10px' }}>
                      Recommended
                    </span>
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" name="taxCollection" />
                    <span style={{ paddingLeft: '10px' }}>
                      This is a separate reporting entity
                    </span>
                  </label>
                </div>
              </>
            )}
            <br />
            <hr />
            <label>
              <h4>Set {companyName} as the default entity?</h4>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={() => setIsDefault(!isDefault)}
              />
              <span style={{ paddingLeft: '10px' }}>Default entity</span>
            </label>
            <br />
            <hr />
            <label>
              <h4>Is {companyName} an online marketplace?</h4>
              <input
                type="radio"
                name="isOnlineMarketplace"
                checked={isOnlineMarketplace}
                onChange={() => setIsOnlineMarketplace(true)}
              />
              <span style={{ paddingLeft: '10px' }}>
                Yes, this entity is an online marketplace that connects many
                sellers to customers on a single platform.
              </span>
              <br />
              <input
                type="radio"
                name="isOnlineMarketplace"
                checked={!isOnlineMarketplace}
                onChange={() => setIsOnlineMarketplace(false)}
              />
              <span style={{ paddingLeft: '10px' }}>
                No, this entity is not an online marketplace.
              </span>
            </label>
            <br />
            <hr />
            <label>
              <h4>Do you want this entity to be active?</h4>
              <p>
                This is used to fill the signer information on sales tax
                documents that ScalarHub prepares for your entity.
              </p>
              <p>STATUS</p>
              <input
                type="radio"
                name="status"
                checked={status === 'ACTIVE'}
                onChange={() => setStatus('ACTIVE')}
              />
              <span style={{ paddingLeft: '10px' }}>ACTIVE</span>
              <br />
              <input
                type="radio"
                name="status"
                checked={status === 'TEST COMPANY'}
                onChange={() => setStatus('TEST COMPANY')}
              />
              <span style={{ paddingLeft: '10px' }}>TEST COMPANY</span>{' '}
              <span style={{ paddingLeft: '10px' }}>
                Tax Returns And Tax Return Reports Are Not Available For Test
                Companies
              </span>
              <br />
              <input
                type="radio"
                name="status"
                checked={status === 'INACTIVE'}
                onChange={() => setStatus('INACTIVE')}
              />
              <span style={{ paddingLeft: '10px' }}>INACTIVE</span>{' '}
              <span style={{ paddingLeft: '10px' }}>
                ScalarHub Will Not Calculate Tax
              </span>
            </label>
            <br />
            <hr />
            <button
              type="submit"
              style={{ marginRight: '100px', width: '100px' }}
              className="btn btn-primary addtax-modal"
            >
              Save
            </button>
            <button
              type="button"
              style={{ width: '100px' }}
              onClick={() => console.log('Cancelled')}
              className="btn btn-primary addtax-modal"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EntityDetails;
