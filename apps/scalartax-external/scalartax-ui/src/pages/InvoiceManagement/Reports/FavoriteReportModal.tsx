import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface FavoriteReportModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (name: string) => void;
  defaultName: string;
  reportData: any;
}

const FavoriteReportModal: React.FC<FavoriteReportModalProps> = ({
  show,
  onHide,
  onSave,
  defaultName,
  reportData,
}) => {
  const [favoriteName, setFavoriteName] = React.useState(defaultName);

  const handleSave = () => {
    // Create a new favorite report object
    const newFavorite = {
      id: Date.now().toString(), // Simple unique ID
      name: favoriteName,
      category: reportData.report_category || '',
      reportName: reportData.report_name || '',
      dateOption: reportData.date_option || '',
      dateType: reportData.date_type || '',
      documentStatus: reportData.document_status || '',
      region: reportData.exemption_reason || '',
      company: reportData.company || '',
      timestamp: new Date(),
    };

    // Get existing favorites from localStorage
    const existingFavorites = JSON.parse(
      localStorage.getItem('reportFavorites') || '[]'
    );

    // Add new favorite to the array
    const updatedFavorites = [...existingFavorites, newFavorite];

    // Save back to localStorage
    localStorage.setItem('reportFavorites', JSON.stringify(updatedFavorites));

    // Call the original onSave function
    onSave(favoriteName);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Save Favorite Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Great, your report is now a favorite. Save it with the default name,
          or give it a name you prefer.
        </p>
        <Form.Group>
          <Form.Label>Report Name</Form.Label>
          <Form.Control
            type="text"
            value={favoriteName}
            onChange={(e) => setFavoriteName(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Name
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FavoriteReportModal;
