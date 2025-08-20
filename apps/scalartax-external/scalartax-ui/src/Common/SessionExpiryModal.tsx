import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap

interface SessionExpiryModalProps {
  show: boolean;
  onLogout: () => void;
  onStayActive: () => void;
}

const SessionExpiryModal: React.FC<SessionExpiryModalProps> = ({
  show,
  onLogout,
  onStayActive
}) => {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (show) {
      setCounter(10);
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setCounter((prev) => (prev > 0 ? prev - 1 : prev));
      }, 1000);

      if (counter === 0) {
        onLogout();
      }
      return () => clearInterval(timer);
    }
  }, [show, counter, onLogout]);

  return (
    <Modal show={show} onHide={onLogout}>
      <Modal.Header>
        <Modal.Title>Session Expiring</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>
          Your session will expire in{' '}
          <span style={{ color: 'red' }}>{counter}</span> seconds. If you are
          still working, please click "I'm still here".
        </h6>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onLogout}>
          Logout
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onStayActive();
          }}
        >
          I'm still here
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionExpiryModal;
