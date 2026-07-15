import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';
import { Trash2, AlertOctagon, Plus, ShieldCheck, Stethoscope, CheckCircle2, ShieldAlert } from 'lucide-react';
import Loader from '../../components/Loader';
const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Add doctor modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    specialization: 'General Medicine',
    experience: '',
    qualification: '',
    hospital: '',
    consultationFee: '',
    startTime: '09:00',
    endTime: '17:00',
    biography: '',
    languages: ''
  });
  const [availableDays, setAvailableDays] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const loadDoctors = async () => {
    try {
      const response = await axios.get('/api/admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setErrorMsg('Failed to load doctors list.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDoctors();
  }, []);
  const handleSuspendToggle = async (id) => {
    try {
      const response = await axios.put(`/api/admin/suspend-doctor/${id}`);
      setSuccessMsg(response.data.message);
      loadDoctors();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Suspension toggle failed.');
    }
  };
  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('WARNING: This will permanently delete Dr. account, doctor profile, and all related booking schedule history. Proceed?')) return;
    try {
      await axios.delete(`/api/admin/doctors/${id}`);
      setSuccessMsg('Doctor account removed successfully.');
      loadDoctors();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Delete operation failed.');
    }
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleDayToggle = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };
  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (availableDays.length === 0) {
      setErrorMsg('Please select at least one available day.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setAddingLoading(true);
    const submitData = new FormData();
    // User fields
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('phone', formData.phone);
    submitData.append('age', formData.age);
    submitData.append('gender', formData.gender);
    submitData.append('address', formData.address);
    // Doctor profile fields
    submitData.append('specialization', formData.specialization);
    submitData.append('experience', formData.experience);
    submitData.append('qualification', formData.qualification);
    submitData.append('hospital', formData.hospital);
    submitData.append('consultationFee', formData.consultationFee);
    submitData.append('availableDays', JSON.stringify(availableDays));
    
    const timings = { start: formData.startTime, end: formData.endTime };
    submitData.append('availableTimings', JSON.stringify(timings));
    submitData.append('biography', formData.biography);
    const langArray = formData.languages.split(',').map((l) => l.trim()).filter((l) => l !== '');
    submitData.append('languages', JSON.stringify(langArray));
    if (profilePhoto) {
      submitData.append('profilePhoto', profilePhoto);
    }
    try {
      await axios.post('/api/admin/add-doctor', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg('New doctor added successfully.');
      loadDoctors();
      setShowAddModal(false);
      // Reset form
      setFormData({
        name: '', email: '', password: '', phone: '', age: '', gender: 'Male', address: '',
        specialization: 'General Medicine', experience: '', qualification: '', hospital: '',
        consultationFee: '', startTime: '09:00', endTime: '17:00', biography: '', languages: ''
      });
      setAvailableDays([]);
      setProfilePhoto(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to add doctor.');
    } finally {
      setAddingLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="fade-in-element">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Manage Doctors</h2>
          <p className="text-secondary small">Add new doctors, suspend practitioner access or delete doctor profiles.</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="btn-primary-custom d-flex align-items-center gap-2 text-white py-2"
        >
          <Plus size={18} />
          <span>Add Doctor</span>
        </Button>
      </div>
      {successMsg && <Alert variant="success" className="small">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}
      <Card className="card-custom border-0 p-4 bg-white shadow-sm">
        <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Verified Doctors List</h4>
        {doctors.length === 0 ? (
          <div className="text-center py-5">
            <Stethoscope className="text-muted mx-auto mb-3" size={32} />
            <p className="text-secondary small mb-0">No approved doctors found in directory. Use "Add Doctor" above.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th className="small text-secondary fw-semibold border-bottom">Doctor Details</th>
                  <th className="small text-secondary fw-semibold border-bottom">Specialty</th>
                  <th className="small text-secondary fw-semibold border-bottom">Practice location</th>
                  <th className="small text-secondary fw-semibold border-bottom">Fee</th>
                  <th className="small text-secondary fw-semibold border-bottom">Status</th>
                  <th className="small text-secondary fw-semibold border-bottom text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => {
                  const docName = doc.userId?.name || 'Doctor';
                  const docPhoto = doc.userId?.profilePhoto || '/uploads/default-avatar.png';
                  const docEmail = doc.userId?.email || '';
                  return (
                    <tr key={doc._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={docPhoto.startsWith('/uploads') ? docPhoto : '/uploads/default-avatar.png'}
                            alt={docName}
                            className="rounded-circle border"
                            width="34"
                            height="34"
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <span className="fw-semibold small d-block">Dr. {docName}</span>
                            <span className="text-muted small d-block">{docEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="small text-secondary">
                        <span className="fw-medium">{doc.specialization}</span>
                        <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>{doc.qualification}</span>
                      </td>
                      <td className="small text-secondary text-truncate" style={{ maxWidth: '140px' }} title={doc.hospital}>
                        {doc.hospital}
                      </td>
                      <td className="small text-secondary fw-semibold text-primary">{formatCurrency(doc.consultationFee)}</td>
                      <td>
                        {doc.isSuspended ? (
                          <Badge bg="danger-subtle" className="text-danger border border-danger-subtle px-2.5 py-1.5 fw-semibold">
                            Suspended
                          </Badge>
                        ) : (
                          <Badge bg="success-subtle" className="text-success border border-success-subtle px-2.5 py-1.5 fw-semibold">
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-1.5 justify-content-end">
                          <Button
                            onClick={() => handleSuspendToggle(doc._id)}
                            variant={doc.isSuspended ? 'outline-success' : 'outline-warning'}
                            size="sm"
                            className="rounded p-1 px-2 d-inline-flex align-items-center gap-1 small"
                            title={doc.isSuspended ? 'Activate account' : 'Suspend account'}
                          >
                            {doc.isSuspended ? <ShieldCheck size={14} /> : <AlertOctagon size={14} />}
                            <span>{doc.isSuspended ? 'Unsuspend' : 'Suspend'}</span>
                          </Button>
                          <Button
                            onClick={() => handleDeleteDoctor(doc._id)}
                            variant="outline-danger"
                            size="sm"
                            className="rounded p-1 px-2 d-inline-flex align-items-center gap-1 small"
                            title="Delete doctor"
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
      {/* Add Doctor Direct Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Form onSubmit={handleAddDoctorSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold" style={{ fontFamily: 'Outfit' }}>Directly Add Doctor Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 small">
            {errorMsg && (
              <Alert variant="danger" className="d-flex align-items-center gap-2 small mb-3">
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </Alert>
            )}
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Login & User Credentials</h5>
            <Row className="gy-3 mb-4">
              <Col md={4}>
                <Form.Group controlId="addName">
                  <Form.Label className="small fw-semibold text-secondary">Full Name (with Dr. prefix)</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Dr. Ronald Miller"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addEmail">
                  <Form.Label className="small fw-semibold text-secondary">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="ronald@clinic.com"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addPassword">
                  <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="••••••••"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addPhone">
                  <Form.Label className="small fw-semibold text-secondary">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="555-0105"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addAge">
                  <Form.Label className="small fw-semibold text-secondary">Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="38"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addGender">
                  <Form.Label className="small fw-semibold text-secondary">Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="addAddress">
                  <Form.Label className="small fw-semibold text-secondary">Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="456 Healthcare Way, suite 2"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Doctor Profile Details</h5>
            <Row className="gy-3 mb-4">
              <Col md={4}>
                <Form.Group controlId="addSpec">
                  <Form.Label className="small fw-semibold text-secondary">Specialization</Form.Label>
                  <Form.Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addQual">
                  <Form.Label className="small fw-semibold text-secondary">Qualifications</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="MD, MBBS"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="addExp">
                  <Form.Label className="small fw-semibold text-secondary">Experience (Years)</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="addHosp">
                  <Form.Label className="small fw-semibold text-secondary">Hospital / Clinic</Form.Label>
                  <Form.Control
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="General Med Center"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="addFee">
                  <Form.Label className="small fw-semibold text-secondary">Consult Fee ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="120"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-semibold text-secondary">Practice Days</Form.Label>
                <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light">
                  {daysOfWeek.map((day) => (
                    <Form.Check
                      key={day}
                      type="checkbox"
                      id={`add-day-${day}`}
                      label={day}
                      checked={availableDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="me-2 small cursor-pointer"
                    />
                  ))}
                </div>
              </Col>
              <Col md={6}>
                <Row>
                  <Col xs={6}>
                    <Form.Group controlId="addStart">
                      <Form.Label className="small fw-semibold text-secondary">Start Hour</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group controlId="addEnd">
                      <Form.Label className="small fw-semibold text-secondary">End Hour</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={12}>
                <Form.Group controlId="addLang">
                  <Form.Label className="small fw-semibold text-secondary">Languages (Comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="English, Chinese"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="addBio">
                  <Form.Label className="small fw-semibold text-secondary">Biography</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Write a brief professional background..."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="addPhoto">
                  <Form.Label className="small fw-semibold text-secondary">Profile Image File</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" disabled={addingLoading} className="btn-primary-custom text-white">
              {addingLoading ? 'Adding...' : 'Onboard Doctor'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
export default ManageDoctors;