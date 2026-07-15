import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { formatDate, getStatusBadgeClass } from '../../utils/helpers';
import { Calendar, CheckCircle2, AlertCircle, FileText, Ban, UserCheck, Bell } from 'lucide-react';
import Loader from '../../components/Loader';
const UserDashboard = () => {
  const { user, fetchNotifications, markSingleNotificationRead } = useApp();
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
      setErrorMsg('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAppointments();
    fetchNotifications();
  }, []);
  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axios.put(`/api/appointments/${id}/status`, { status: 'Cancelled' });
      setSuccessMsg('Appointment cancelled successfully.');
      loadAppointments();
      fetchNotifications();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to cancel appointment.');
    }
  };
  const getStats = () => {
    const upcoming = appointments.filter(app => app.status === 'Approved' || app.status === 'Pending').length;
    const completed = appointments.filter(app => app.status === 'Completed').length;
    const cancelled = appointments.filter(app => app.status === 'Cancelled').length;
    
    // Profile completion estimate
    let score = 0;
    if (user.name) score += 20;
    if (user.phone) score += 20;
    if (user.age) score += 20;
    if (user.address) score += 20;
    if (user.profilePhoto && user.profilePhoto !== '/uploads/default-avatar.png') score += 20;
    return { upcoming, completed, cancelled, completion: score };
  };
  if (loading) return <Loader />;
  const stats = getStats();
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Patient Dashboard</h2>
        <p className="text-secondary small">Manage your upcoming doctor visits, history, and medical records.</p>
      </div>
      {successMsg && <Alert variant="success" className="small">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}
      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Upcoming Visits</span>
            <h3 className="fw-bold text-primary mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.upcoming}</span>
              <Calendar size={20} className="text-primary-subtle" />
            </h3>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Completed Consults</span>
            <h3 className="fw-bold text-success mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.completed}</span>
              <CheckCircle2 size={20} className="text-success-subtle" />
            </h3>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Cancelled Visits</span>
            <h3 className="fw-bold text-danger mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.cancelled}</span>
              <Ban size={20} className="text-danger-subtle" />
            </h3>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Profile Completion</span>
            <h3 className="fw-bold text-info mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.completion}%</span>
              <UserCheck size={20} className="text-info-subtle" />
            </h3>
          </Card>
        </Col>
      </Row>
      <Row className="gy-4">
        {/* Bookings Table */}
        <Col lg={8}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm h-100">
            <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>My Appointments</h4>
            {appointments.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle className="text-muted mx-auto mb-3" size={32} />
                <p className="text-secondary small mb-3">You don't have any appointments scheduled yet.</p>
                <Button as={Link} to="/doctors" className="btn-primary-custom px-4 text-white">Find a Doctor</Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th className="small text-secondary fw-semibold border-bottom">Doctor Details</th>
                      <th className="small text-secondary fw-semibold border-bottom">Date & Time</th>
                      <th className="small text-secondary fw-semibold border-bottom">Document</th>
                      <th className="small text-secondary fw-semibold border-bottom">Status</th>
                      <th className="small text-secondary fw-semibold border-bottom text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => {
                      const docName = app.doctorId?.userId?.name || 'Doctor';
                      const docSpec = app.doctorId?.specialization || 'Medical Specialist';
                      return (
                        <tr key={app._id}>
                          <td style={{ minWidth: '180px' }}>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={
                                docPhoto?.startsWith('/uploads')
                                ? docPhoto
                                : '/uploads/default-avatar.png'
                                }
                              />
                              <div>
                                <span className="fw-semibold d-block text-truncate" style={{ maxWidth: '120px' }}>Dr. {docName}</span>
                                <span className="text-muted small d-block">{docSpec}</span>
                              </div>
                            </div>
                          </td>
                          <td className="small text-secondary" style={{ minWidth: '110px' }}>
                            <span className="d-block fw-medium">{formatDate(app.date)}</span>
                            <span>{app.time}</span>
                          </td>
                          <td className="small">
                            {app.medicalReport ? (
                              <a
                                href={app.medicalReport}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary d-flex align-items-center gap-1 text-decoration-none"
                              >
                                <FileText size={15} />
                                <span>Report</span>
                              </a>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                          <td>
                            <Badge className={`px-2.5 py-1.5 fw-semibold ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="text-end">
                            {(app.status === 'Pending' || app.status === 'Approved') && (
                              <Button
                                onClick={() => handleCancelAppointment(app._id)}
                                variant="outline-danger"
                                size="sm"
                                className="rounded p-1 px-2 d-inline-flex align-items-center gap-1"
                                title="Cancel visit"
                              >
                                <Ban size={14} />
                                <span className="d-none d-sm-inline">Cancel</span>
                              </Button>
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
        {/* Notifications and Profile Completion */}
        <Col lg={4}>
          <div className="d-flex flex-column gap-4 h-100">
            {/* Quick Profile Card */}
            <Card className="card-custom border-0 p-4 bg-white shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={user.profilePhoto.startsWith('/uploads') ? user.profilePhoto : '/uploads/default-avatar.png'}
                  alt={user.name}
                  className="rounded-circle border"
                  width="55"
                  height="55"
                  style={{ objectFit: 'cover' }}
                />
                <div>
                  <h5 className="fw-bold mb-0" style={{ fontFamily: 'Outfit' }}>{user.name}</h5>
                  <span className="text-secondary small d-block">{user.email}</span>
                  <Badge bg="primary-subtle" className="text-primary mt-1 text-capitalize" style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 small border-top pt-3 text-secondary">
                <p className="mb-1"><strong>Phone:</strong> {user.phone}</p>
                <p className="mb-1"><strong>Address:</strong> {user.address}</p>
                <p className="mb-0"><strong>Age/Gender:</strong> {user.age} Yrs, {user.gender}</p>
              </div>
              <Button as={Link} to="/user/profile" className="btn btn-outline-primary btn-sm mt-3 w-100">
                Update Profile
              </Button>
            </Card>
            {/* Quick Actions Panel */}
            <Card className="card-custom border-0 p-4 bg-white shadow-sm flex-grow-1">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
                <Bell size={18} className="text-primary" />
                <span>Quick Actions</span>
              </h5>
              <div className="d-flex flex-column gap-2.5">
                <Button as={Link} to="/doctors" className="btn-primary-custom w-100 text-white text-center py-2">
                  Search & Book Doctors
                </Button>
                <Button as={Link} to="/doctors/apply" className="btn btn-outline-primary w-100 text-center py-2">
                  Apply as Doctor Profile
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default UserDashboard;