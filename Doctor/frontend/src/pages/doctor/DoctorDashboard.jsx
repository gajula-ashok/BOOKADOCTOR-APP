import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { formatDate, getStatusBadgeClass, formatCurrency } from '../../utils/helpers';
import { Calendar, Check, X, ClipboardCheck, DollarSign, CalendarCheck, Clock, Ban, AlertCircle } from 'lucide-react';
import Loader from '../../components/Loader';
const DoctorDashboard = () => {
  const { user, fetchNotifications } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const loadAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setErrorMsg('Failed to load doctor appointments.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAppointments();
    fetchNotifications();
  }, []);
  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to set this appointment to ${status}?`)) return;
    try {
      await axios.put(`/api/appointments/${id}/status`, { status });
      setSuccessMsg(`Appointment status updated to ${status}.`);
      loadAppointments();
      fetchNotifications();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to update appointment status.');
    }
  };
  const getStats = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = appointments.filter(app => app.date === todayStr && app.status !== 'Cancelled' && app.status !== 'Rejected').length;
    const pending = appointments.filter(app => app.status === 'Pending').length;
    const completed = appointments.filter(app => app.status === 'Completed').length;
    // Calculate revenue
    const revenue = appointments.reduce((sum, app) => {
      if (app.status === 'Completed' && app.doctorId?.consultationFee) {
        return sum + app.doctorId.consultationFee;
      }
      return sum;
    }, 0);
    return { today, pending, completed, revenue };
  };
  if (loading) return <Loader />;
  const stats = getStats();
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Doctor Consultation Dashboard</h2>
        <p className="text-secondary small">Review patient records, approve bookings, and mark consultations as completed.</p>
      </div>
      {successMsg && <Alert variant="success" className="small">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}
      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Today's Visits</span>
            <h3 className="fw-bold text-primary mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.today}</span>
              <CalendarCheck size={20} className="text-primary-subtle" />
            </h3>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Pending Bookings</span>
            <h3 className="fw-bold text-warning mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.pending}</span>
              <Clock size={20} className="text-warning-subtle" />
            </h3>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Completed Consults</span>
            <h3 className="fw-bold text-success mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.completed}</span>
              <ClipboardCheck size={20} className="text-success-subtle" />
            </h3>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Total Revenue</span>
            <h3 className="fw-bold text-info mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{formatCurrency(stats.revenue)}</span>
              <DollarSign size={20} className="text-info-subtle" />
            </h3>
          </Card>
        </Col>
      </Row>
      <Row className="gy-4">
        {/* Bookings List */}
        <Col lg={12}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm">
            <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Consultation Schedule</h4>
            {appointments.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle className="text-muted mx-auto mb-3" size={32} />
                <p className="text-secondary small mb-0">No appointment bookings found linked to your account.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th className="small text-secondary fw-semibold border-bottom">Patient Name</th>
                      <th className="small text-secondary fw-semibold border-bottom">Age & Gender</th>
                      <th className="small text-secondary fw-semibold border-bottom">Date & Time</th>
                      <th className="small text-secondary fw-semibold border-bottom">Symptoms & Report</th>
                      <th className="small text-secondary fw-semibold border-bottom">Status</th>
                      <th className="small text-secondary fw-semibold border-bottom text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => {
                      const patName = app.patientId?.name || 'Patient';
                      const patPhoto = app.patientId?.profilePhoto || '/uploads/default-avatar.png';
                      const patAge = app.patientId?.age || '--';
                      const patGender = app.patientId?.gender || '--';
                      const patAddress = app.patientId?.address || '';
                      
                      return (
                        <tr key={app._id}>
                          <td style={{ minWidth: '180px' }}>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={patPhoto.startsWith('/uploads') ? patPhoto : '/uploads/default-avatar.png'}
                                alt={patName}
                                className="rounded-circle border"
                                width="36"
                                height="36"
                                style={{ objectFit: 'cover' }}
                              />
                              <div>
                                <span className="fw-semibold d-block text-truncate" style={{ maxWidth: '120px' }}>{patName}</span>
                                <span className="text-muted small d-block text-truncate" style={{ maxWidth: '120px' }}>{patAddress}</span>
                              </div>
                            </div>
                          </td>
                          <td className="small text-secondary">
                            <span>{patAge} Yrs, {patGender}</span>
                          </td>
                          <td className="small text-secondary" style={{ minWidth: '110px' }}>
                            <span className="d-block fw-medium">{formatDate(app.date)}</span>
                            <span>{app.time}</span>
                          </td>
                          <td style={{ minWidth: '180px' }}>
                            <span className="d-block small text-secondary text-truncate" style={{ maxWidth: '150px' }} title={app.problemDescription}>
                              {app.problemDescription}
                            </span>
                            {app.medicalReport && (
                              <a
                                href={app.medicalReport}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary d-inline-flex align-items-center gap-0.5 small text-decoration-none mt-1"
                              >
                                <ClipboardCheck size={13} />
                                <span>View Document</span>
                              </a>
                            )}
                          </td>
                          <td>
                            <Badge className={`px-2.5 py-1.5 fw-semibold ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="text-end" style={{ minWidth: '150px' }}>
                            {app.status === 'Pending' && (
                              <div className="d-flex gap-1 justify-content-end">
                                <Button
                                  onClick={() => handleUpdateStatus(app._id, 'Approved')}
                                  variant="primary"
                                  size="sm"
                                  className="p-1 px-2 d-inline-flex align-items-center gap-1"
                                >
                                  <Check size={14} />
                                  <span>Accept</span>
                                </Button>
                                <Button
                                  onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                                  variant="outline-danger"
                                  size="sm"
                                  className="p-1 px-2 d-inline-flex align-items-center gap-1"
                                >
                                  <X size={14} />
                                  <span>Reject</span>
                                </Button>
                              </div>
                            )}
                            {app.status === 'Approved' && (
                              <div className="d-flex gap-1 justify-content-end">
                                <Button
                                  onClick={() => handleUpdateStatus(app._id, 'Completed')}
                                  variant="success"
                                  size="sm"
                                  className="p-1 px-2 d-inline-flex align-items-center gap-1"
                                >
                                  <ClipboardCheck size={14} />
                                  <span>Complete</span>
                                </Button>
                                <Button
                                  onClick={() => handleUpdateStatus(app._id, 'Cancelled')}
                                  variant="outline-secondary"
                                  size="sm"
                                  className="p-1 px-2 d-inline-flex align-items-center gap-1"
                                >
                                  <Ban size={14} />
                                  <span>Cancel</span>
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default DoctorDashboard;