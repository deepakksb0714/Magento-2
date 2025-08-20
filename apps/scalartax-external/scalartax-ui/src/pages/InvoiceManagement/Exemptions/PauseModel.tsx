import React from 'react';
import { Modal, Button, ModalHeader, ModalBody } from 'react-bootstrap';

interface PauseModalProps {
  show: boolean;
  handleClose: () => void;
  pauseModalFunction: () => void;
  isPaused: boolean;
  resumeModalFunction: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  show,
  handleClose,
  pauseModalFunction,
  isPaused,
  resumeModalFunction,
}) => {
  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        id="pauseCartModal"
        className="fade zoomIn"
        dialogClassName="modal-dialog-centered"
      >
        <ModalHeader closeButton></ModalHeader>
        <ModalBody className="p-md-5">
          <div className="text-center">
            <div className={isPaused ? "text-success" : "#142e41"}>
              <i className={isPaused ? "bi bi-check-circle display-5" : "bi bi-pause-circle display-5"}></i>
            </div>
            <div className="mt-4">
              {isPaused ? (
                <p className="text-muted mx-4 mb-0">
                    <h4>You want to resume this certificate?</h4>
                  The certificate will become active again and will apply to any future transactions where it is applicable.
                </p>
              ) : (
                <p className="text-muted mx-4 mb-0">
                  <h4>You want to pause this certificate?</h4>
                  Paused certificates aren't applied to transactions.
                </p>
              )}
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
              className="btn w-sm btn-hover"
              id={isPaused ? "resume-record" : "pause-record"}
             style={{ backgroundColor: isPaused ? "" : "#142e41", color: isPaused ? "" : "white", borderColor: isPaused ? "" : "#142e41" }}
              onClick={() => {
                isPaused ? resumeModalFunction() : pauseModalFunction();
              }}
            >
              {isPaused ? "Yes, Resume It!" : "Yes, Pause It!"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};