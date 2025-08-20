import React, { useState, useRef, useEffect } from 'react';
import BreadCrumb from '../../Common/BreadCrumb';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Row, Col, Card, Image } from 'react-bootstrap';
import { getUser_entity_roles as onGetUser_entity_roles } from '../../slices/thunk';

const General = () => {
  document.title = 'General | Scalarhub';

  const selectUser_entity_rolesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      user_entity_rolesList: invoices.user_entity_rolesList,
    })
  );

  const { user_entity_rolesList } = useSelector(selectUser_entity_rolesList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetUser_entity_roles());
  }, [dispatch]);

  const authUser: any = sessionStorage.getItem('authUser');

  // State to store the uploaded image
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    null
  );

  // Ref to the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image click to trigger file input
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to determine access level from permission attribute ID
  const getAccessLevel = (permissionId: string) => {
    const firstChar = permissionId.charAt(0);
    return firstChar === 'A' ? 'Account Level Access' : 
           firstChar === 'E' ? 'Entity Level Access' : 
           'Unknown Access Level';
  };

  // Updated function to format permissions string
  const formatPermissions = (permissions: string) => {
    if (!permissions) return 'Unknown';
    
    // Check for specific permission combinations
    if (permissions === 'rwud') {
      return 'Admin';
    } else if (permissions === 'r') {
      return 'Limited Access';
    }

    // For any other permission combinations, display the individual permissions
    const permissionMap: { [key: string]: string } = {
      'r': 'Read',
      'w': 'Write',
      'u': 'Update',
      'd': 'Delete'
    };

    return permissions.split('').map(p => permissionMap[p]).filter(Boolean).join(', ');
  };

  // Get the first permission attribute (if exists)
  const firstPermissionAttribute = user_entity_rolesList?.[0]?.entity_permission_attribute || {};
  const firstPermissionKey = Object.keys(firstPermissionAttribute)[0] || '';
  const permissionValue = firstPermissionAttribute[firstPermissionKey] || '';

  return (
    <React.Fragment>
      <div className="page-content bg-light min-vh-100 py-5">
        <Container fluid>
          <BreadCrumb pageTitle="" title="PROFILE" />
          <Row className="justify-content-center">
            <Col md={8} lg={7}>
              <Card className="border-0 shadow-sm mt-4">
                <Card.Body className="p-4">
                  <Row>
                    <Col md={4} className="text-center mb-4 mb-md-0">
                      <div
                        onClick={handleImageClick}
                        className="position-relative d-inline-block"
                        style={{ cursor: 'pointer' }}
                      >
                        {profileImage ? (
                          <Image
                            src={profileImage.toString()}
                            roundedCircle
                            className="border shadow-sm"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="d-flex flex-column align-items-center justify-content-center rounded-circle bg-light border"
                            style={{ width: '150px', height: '150px' }}
                          >
                            <small className="text-muted">Upload Photo</small>
                          </div>
                        )}
                        <div
                          className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                          style={{ transform: 'translate(20%, 20%)' }}
                        >
                          <i className="bi bi-camera-fill text-white"></i>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                       <Form.Group className="mb-4 mt-3">
                            {/* <Form.Label className="text-muted small">USER NAME</Form.Label> */}
                            <Form.Label className="mb-0">
                              {JSON.parse(authUser).idToken.payload['custom:first_name']}{' '}
                              {JSON.parse(authUser).idToken.payload['custom:last_name']}
                            </Form.Label>
                          </Form.Group>
                    </Col>
                    <Col md={8}>
                      {authUser ? (
                        <div className="py-2">
                          <Form.Group className="mb-4">
                            <Form.Label className="text-muted small">EMAIL ADDRESS</Form.Label>
                            <h5 className="mb-0">
                              {JSON.parse(authUser).idToken.payload.email}
                            </h5>
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="text-muted small">ORGANIZATION</Form.Label>
                            <h5 className="mb-0">
                              {JSON.parse(authUser).idToken.payload['custom:COMPANY_NAME']}
                            </h5>
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="text-muted small">ACCESS LEVEL</Form.Label>
                            <h5 className="mb-0">
                              {getAccessLevel(firstPermissionKey)}
                            </h5>
                          </Form.Group>

                          <Form.Group>
                            <Form.Label className="text-muted small">PERMISSIONS</Form.Label>
                            <h5 className="mb-0">
                              {formatPermissions(permissionValue)}
                            </h5>
                          </Form.Group>
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          User data is not available. Please check your authentication status.
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default General;