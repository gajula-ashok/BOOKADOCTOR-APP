import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { formatDate, getStatusBadgeClass, formatCurrency } from '../../utils/helpers';
import { Check, X, ShieldAlert, CheckCircle2, FileText, Eye, AlertCircle } from 'lucide-react';
import Loader from '../../components/Loader';
const DoctorApplications = () => {
  const { fetchNotifications } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Modal detail states
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const loadApplications = async () => {
    try {
      const response = await axios.get('/api/admin/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setErrorMsg('Failed to load doctor applications.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadApplications();
  }, []);
  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to APPROVE this doctor application? They will be granted doctor roles immediately.')) return;
    try {
      await axios.put(`/api/admin/approve-doctor/${id}`);
      setSuccessMsg('Doctor application approved successfully.');
      loadApplications();
      fetchNotifications();
      setShowDetailModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Approval failed.');
    }
  };
  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to REJECT this doctor application?')) return;
    try {
      await axios.put(`/api/admin/reject-doctor/${id}`);
      setSuccessMsg('Doctor application rejected successfully.');
      loadApplications();
      fetchNotifications();
      setShowDetailModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Rejection failed.');
    }
  };
  const handleViewDetail = (app) => {
    setSelectedApp(app);
    setShowDetailModal(true);
  };
  if (loading) return <Loader />;
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Doctor Applications Management</h2>
        <p className="text-secondary small">Review license files, board certifications, and credentials submitted by applicant practitioners.</p>
      </div>
      {successMsg && <Alert variant="success" className="small">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}
      <Card className="card-custom border-0 p-4 bg-white shadow-sm">
        <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Applications List</h4>
        
        {applications.length === 0 ? (
          <div className="text-center py-5">
            <AlertCircle className="text-muted mx-auto mb-3" size={32} />
            <p className="text-secondary small mb-0">No doctor applications found on the server.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th className="small text-secondary fw-semibold border-bottom">Applicant Name</th>
                  <th className="small text-secondary fw-semibold border-bottom">Specialty</th>
                  <th className="small text-secondary fw-semibold border-bottom">Experience</th>
                  <th className="small text-secondary fw-semibold border-bottom">Consultation Fee</th>
                  <th className="small text-secondary fw-semibold border-bottom">Submitted</th>
                  <th className="small text-secondary fw-semibold border-bottom">Status</th>
                  <th className="small text-secondary fw-semibold border-bottom text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={app.profilePhoto?.startsWith('/uploads') ? app.profilePhoto : '/uploads/default-avatar.png'}
                          alt={app.name}
                          className="rounded-circle border"
                          width="34"
                          height="34"
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <span className="fw-semibold small d-block">Dr. {app.name}</span>
                          <span className="text-muted small d-block">{app.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="small text-secondary">{app.specialization}</td>
                    <td className="small text-secondary">{app.experience} Years</td>
                    <td className="small text-secondary fw-semibold text-primary">{formatCurrency(app.consultationFee)}</td>
                    <td className="small text-secondary">{formatDate(app.createdAt)}</td>
                    <td>
                      <Badge className={`px-2.5 py-1.5 fw-semibold ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        onClick={() => handleViewDetail(app)}
                        variant="outline-primary"
                        size="sm"
                        className="rounded p-1 px-2 d-inline-flex align-items-center gap-1 small"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
      {/* Application Inspect Modal */}
      {selectedApp && (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold" style={{ fontFamily: 'Outfit' }}>
              Inspect Dr. {selectedApp.name} Application
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 small">
            <Row className="gy-4">
              <Col md={3} className="text-center">
                <img
                  src={selectedApp.profilePhoto?.startsWith('/uploads') ? selectedApp.profilePhoto : '/uploads/default-avatar.png'}
                  alt={selectedApp.name}
                  className="rounded border w-100 mb-2"
                  style={{ objectFit: 'cover', height: '140px' }}
                />
                <Badge className={`w-100 py-2 fs-6 ${getStatusBadgeClass(selectedApp.status)}`}>
                  {selectedApp.status.toUpperCase()}
                </Badge>
              </Col>
              
              <Col md={9}>
                <Row className="gy-3">
                  <Col md={6}>
                    <p className="mb-1 text-muted">Qualifications</p>
                    <p className="fw-bold fs-6 mb-0">{selectedApp.qualification}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1 text-muted">Specialization</p>
                    <p className="fw-bold fs-6 mb-0 text-primary">{selectedApp.specialization}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1 text-muted">Hospital / Clinic</p>
                    <p className="fw-semibold mb-0">{selectedApp.hospital}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1 text-muted">Pricing & Hours</p>
                    <p className="fw-semibold mb-0">
                      {formatCurrency(selectedApp.consultationFee)} | {selectedApp.availableTimings.start} - {selectedApp.availableTimings.end}
                    </p>
                  </Col>
                  <Col md={12}>
                    <p className="mb-1 text-muted">Languages Spoken</p>
                    <p className="fw-semibold mb-0">{selectedApp.languages.join(', ')}</p>
                  </Col>
                  <Col md={12}>
                    <p className="mb-1 text-muted">Biography Description</p>
                    <p className="text-secondary bg-light p-2 rounded mb-0" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                      {selectedApp.biography}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr className="my-4" />
            <h5 className="fw-bold mb-3" style={{ fontFamily: 'Outfit' }}>Submitted Certificates</h5>
            {selectedApp.certificates.length === 0 ? (
              <p className="text-muted">No certificates uploaded.</p>
            ) : (
              <div className="d-flex flex-wrap gap-3">
                {selectedApp.certificates.map((cert, index) => (
                  <a
                    key={index}
                    href={cert}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 border rounded bg-light d-flex align-items-center gap-2 text-decoration-none text-primary fw-medium"
                    style={{ minWidth: '180px' }}
                  >
                    <FileText size={20} />
                    <span>Certificate {index + 1}</span>
                  </a>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-light">
            {selectedApp.status === 'pending' && (
              <div className="d-flex gap-2 w-100 justify-content-end">
                <Button
                  onClick={() => handleApprove(selectedApp._id)}
                  variant="primary"
                  className="d-flex align-items-center gap-1"
                >
                  <Check size={16} />
                  <span>Approve Doctor</span>
                </Button>
                <Button
                  onClick={() => handleReject(selectedApp._id)}
                  variant="danger"
                  className="d-flex align-items-center gap-1"
                >
                  <X size={16} />
                  <span>Reject Application</span>
                </Button>
              </div>
            )}
            {selectedApp.status !== 'pending' && (
              <Button onClick={() => setShowDetailModal(false)} variant="secondary">
                Close
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};
export default DoctorApplications;