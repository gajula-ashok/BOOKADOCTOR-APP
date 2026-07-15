import { useState, useEffect } from 'react';
import { Card, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { formatDate } from '../../utils/helpers';
import { Trash2, AlertCircle, Users } from 'lucide-react';
import Loader from '../../components/Loader';
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      // Filter out admins just in case, only show patients (doctors are managed in ManageDoctors)
      const patientsOnly = response.data.filter((u) => u.role === 'patient');
      setUsers(patientsOnly);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMsg('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  const handleDeleteUser = async (id) => {
    if (!window.confirm('WARNING: Deleting this patient account will permanently erase their credentials and all appointment bookings. Are you sure?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setSuccessMsg('Patient account deleted successfully.');
      loadUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Delete operation failed.');
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Manage Patients</h2>
        <p className="text-secondary small">Browse all patients registered in the database and remove accounts if necessary.</p>
      </div>
      {successMsg && <Alert variant="success" className="small">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}
      <Card className="card-custom border-0 p-4 bg-white shadow-sm">
        <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Patients List</h4>
        {users.length === 0 ? (
          <div className="text-center py-5">
            <AlertCircle className="text-muted mx-auto mb-3" size={32} />
            <p className="text-secondary small mb-0">No registered patients found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th className="small text-secondary fw-semibold border-bottom">Patient Details</th>
                  <th className="small text-secondary fw-semibold border-bottom">Age & Gender</th>
                  <th className="small text-secondary fw-semibold border-bottom">Phone Number</th>
                  <th className="small text-secondary fw-semibold border-bottom">Address</th>
                  <th className="small text-secondary fw-semibold border-bottom">Registered Date</th>
                  <th className="small text-secondary fw-semibold border-bottom text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((pat) => (
                  <tr key={pat._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={pat.profilePhoto?.startsWith('/uploads') ? pat.profilePhoto : '/uploads/default-avatar.png'}
                          alt={pat.name}
                          className="rounded-circle border"
                          width="34"
                          height="34"
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <span className="fw-semibold small d-block">{pat.name}</span>
                          <span className="text-muted small d-block">{pat.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="small text-secondary">{pat.age} Yrs, {pat.gender}</td>
                    <td className="small text-secondary">{pat.phone}</td>
                    <td className="small text-secondary text-truncate" style={{ maxWidth: '140px' }} title={pat.address}>
                      {pat.address}
                    </td>
                    <td className="small text-secondary">{formatDate(pat.createdAt)}</td>
                    <td className="text-end">
                      <Button
                        onClick={() => handleDeleteUser(pat._id)}
                        variant="outline-danger"
                        size="sm"
                        className="rounded p-1 px-2 d-inline-flex align-items-center gap-1 small"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};
export default ManageUsers;
