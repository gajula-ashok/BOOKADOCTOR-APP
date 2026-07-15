import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { formatDate, getStatusBadgeClass, formatCurrency } from '../../utils/helpers';
import { Trash2, AlertCircle, FileText, Ban } from 'lucide-react';
import Loader from '../../components/Loader';
const ManageAppointments = () => {
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
      setErrorMsg('Failed to load appointments registry.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAppointments();
  }, []);
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to CANCEL this appointment?')) return;
    try {
      await axios.put(`/api/appointments/${id}/status`, { status: 'Cancelled' });
      setSuccessMsg('Appointment status updated to Cancelled.');
      loadAppointments();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Update failed.');
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Permanently deleting this booking will remove it from patient and doctor metrics history. Proceed?')) return;
    try {
      await axios.delete(`/api/appointments/${id}`);
      setSuccessMsg('Appointment record permanently deleted.');
      loadAppointments();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Delete operation failed.');
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Appointments Registry</h2>
        <p className="text-secondary small">Monitor all appointments, update booking statuses, or permanently purge records.</p>
      </div>
      {successMsg && <Alert variant="success" className="small">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}
      <Card className="card-custom border-0 p-4 bg-white shadow-sm">
        <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Platform Bookings</h4>
        
        {appointments.length === 0 ? (
          <div className="text-center py-5">
            <AlertCircle className="text-muted mx-auto mb-3" size={32} />
            <p className="text-secondary small mb-0">No appointments have been booked on the platform yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th className="small text-secondary fw-semibold border-bottom">Patient Name</th>
                  <th className="small text-secondary fw-semibold border-bottom">Doctor Name</th>
                  <th className="small text-secondary fw-semibold border-bottom">Date & Hour</th>
                  <th className="small text-secondary fw-semibold border-bottom">Standard Fee</th>
                  <th className="small text-secondary fw-semibold border-bottom">Document</th>
                  <th className="small text-secondary fw-semibold border-bottom">Status</th>
                  <th className="small text-secondary fw-semibold border-bottom text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => {
                  const patName = app.patientId?.name || 'Patient';
                  const patEmail = app.patientId?.email || '';
                  const docName = app.doctorId?.userId?.name || 'Doctor';
                  const docSpec = app.doctorId?.specialization || 'General';
                  const docFee = app.doctorId?.consultationFee || 0;
                  return (
                    <tr key={app._id}>
                      <td>
                        <span className="fw-semibold small d-block">{patName}</span>
                        <span className="text-muted small d-block">{patEmail}</span>
                      </td>
                      <td>
                        <span className="fw-semibold small d-block">Dr. {docName}</span>
                        <span className="text-muted small d-block">{docSpec}</span>
                      </td>
                      <td className="small text-secondary">
                        <span className="d-block fw-medium">{formatDate(app.date)}</span>
                        <span>{app.time}</span>
                      </td>
                      <td className="small text-secondary fw-semibold text-primary">{formatCurrency(docFee)}</td>
                      <td className="small">
                        {app.medicalReport ? (
                          <a
                            href={app.medicalReport}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary d-inline-flex align-items-center gap-0.5 text-decoration-none"
                          >
                            <FileText size={14} />
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
                        <div className="d-flex gap-1.5 justify-content-end">
                          {(app.status === 'Pending' || app.status === 'Approved') && (
                            <Button
                              onClick={() => handleCancel(app._id)}
                              variant="outline-warning"
                              size="sm"
                              className="rounded p-1 px-2 d-inline-flex align-items-center gap-1 small"
                              title="Cancel appointment"
                            >
                              <Ban size={14} />
                              <span>Cancel</span>
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(app._id)}
                            variant="outline-danger"
                            size="sm"
                            className="rounded p-1 px-2 d-inline-flex align-items-center gap-1 small"
                            title="Delete booking record"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};
export default ManageAppointments;