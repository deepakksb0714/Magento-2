// import React, { useState } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useFormik } from 'formik';

// interface ExportProductProps {
//     show: boolean;
//     handleClose: () => void;
// }

// const ExportProduct: React.FC<ExportProductProps> = ({ show, handleClose }) => {
//     const [downloading, setDownloading] = useState(false);
//     const [message, setMessage] = useState('');

//     const formik = useFormik({
//         initialValues: {
//             format: '.XLSX',
//         },
//         onSubmit: (values: { format: string }) => {
//             setDownloading(true);
//             setTimeout(() => {
//                 setDownloading(false);
//                 handleClose();
//             }, 2000);
//             setMessage('Your data is downloading');
//         },
//     });

//     const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         formik.setFieldValue('format', event.target.value);
//     };

//     return (
//         <Modal show={show} onHide={handleClose} centered>
//             <Modal.Header closeButton className="text-center">
//                 <Modal.Title>Export Data</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <hr />
//                 <p>Select a format for the export. Your file will download automatically when the data is ready.</p>
//                 <Form onSubmit={formik.handleSubmit}>
//                     <Form.Group controlId="exportFormat">
//                         <Form.Label>FORMAT</Form.Label>
//                         <Form.Check
//                             type="radio"
//                             label=".XLSX (EXCEL SPREADSHEET)"
//                             name="format"
//                             value=".XLSX"
//                             checked={formik.values.format === '.XLSX'}
//                             onChange={handleFormatChange}
//                             style={{ paddingTop: "20px" }}
//                         />
//                         <Form.Check
//                             type="radio"
//                             label=".CSV (COMMA-SEPARATED FILE)"
//                             name="format"
//                             value=".CSV"
//                             checked={formik.values.format === '.CSV'}
//                             onChange={handleFormatChange}
//                             style={{ paddingTop: "20px" }}
//                         />
//                     </Form.Group>
//                     <br />
//                     <hr />
//                     <Button variant="primary" type="submit">
//                         {downloading ? (
//                             <>
//                                 <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                                 {' '}
//                                 Exporting...
//                             </>
//                         ) : (
//                             'Export'
//                         )}
//                     </Button>
//                 </Form>
//                 {downloading && (
//                     <p style={{ textAlign: "center", marginTop: "10px", color: "blue" }}>{message}</p>
//                 )}
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default ExportProduct;
