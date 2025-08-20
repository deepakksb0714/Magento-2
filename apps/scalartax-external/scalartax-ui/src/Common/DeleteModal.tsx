import React from 'react';
import { Modal, Button, ModalHeader, ModalBody } from 'react-bootstrap';

export const DeleteModal = ({
  show,
  handleClose,
  deleteModalFunction,
}: any) => {
  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        id="removeCartModal"
        className="fade zoomIn"
        dialogClassName="modal-dialog-centered"
      >
        <ModalHeader closeButton></ModalHeader>
        <ModalBody className="p-md-5">
          <div className="text-center">
            <div className="text-danger">
              <i className="bi bi-trash display-5"></i>
            </div>
            <div className="mt-4">
              <h4>Are you sure ?</h4>

              <p className="text-muted mx-4 mb-0">
                You want to delete this permanently! ?
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <Button
              type="button"
              variant="light"
              className="btn w-sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              className="btn w-sm btn-hover"
              id="delete-record"
              onClick={deleteModalFunction}
            >
              Yes, Delete It!
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};


export const NexusDeleteModal = ({
  show,
  handleClose,
  deleteModalFunction,
}: any) => {
  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        id="removeCartModal"
        className="fade zoomIn"
        dialogClassName="modal-dialog-centered"
      >
        <ModalHeader closeButton></ModalHeader>
        <ModalBody className="p-md-5">
          <div className="text-center">
            <div className="text-danger">
              <i className="bi bi-trash display-5"></i>
            </div>
            <div className="mt-4">
              <h4>Are you sure ?</h4>

              <p className="text-muted mx-4 mb-0">
                If you delete this nexus, all associated local nexuses will also be deleted permanently!
              </p>

            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <Button
              type="button"
              variant="light"
              className="btn w-sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              className="btn w-sm btn-hover"
              id="delete-record"
              onClick={deleteModalFunction}
            >
              Yes, Delete It!
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

