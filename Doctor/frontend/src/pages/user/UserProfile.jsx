import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { User, ShieldAlert, CheckCircle2, Image as ImageIcon } from 'lucide-react';
const UserProfile = () => {
  const { user, updateProfile } = useApp();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'Male',
    address: user?.address || '',
    password: '',
    confirmPassword: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files are allowed.');
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (Number(formData.age) <= 0) {
      setErrorMsg('Please enter a valid age.');
      return;
    }
    setLoading(true);
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('phone', formData.phone);
    submitData.append('age', formData.age);
    submitData.append('gender', formData.gender);
    submitData.append('address', formData.address);
    if (formData.password) {
      submitData.append('password', formData.password);
    }
    if (profilePhoto) {
      submitData.append('profilePhoto', profilePhoto);
    }
    const result = await updateProfile(submitData);
    setLoading(false);
    if (result.success) {
      setSuccessMsg('Profile updated successfully.');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(result.message);
    }
  };
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>My Profile</h2>
        <p className="text-secondary small">Update your personal contact details, residential address, or avatar photo.</p>
      </div>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm">
            <Card.Body>
              {successMsg && (
                <Alert variant="success" className="d-flex align-items-center gap-2 small">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </Alert>
              )}
              {errorMsg && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 small">
                  <ShieldAlert size={16} />
                  <span>{errorMsg}</span>
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row className="gy-3">
                  {/* Photo Preview Upload */}
                  <Col md={12} className="mb-3">
                    <Form.Label className="small fw-semibold text-secondary d-block">Avatar Photo</Form.Label>
                    <div className="d-flex align-items-center gap-3 border p-3 rounded bg-light">
                      <img
                        src={photoPreview.startsWith('/uploads') ? photoPreview : '/uploads/default-avatar.png'}
                        alt="Profile Preview"
                        className="rounded-circle border"
                        width="75"
                        height="75"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ fontSize: '0.85rem' }}
                        />
                        <Form.Text className="text-muted small">Max file size 5MB (PNG/JPG/JPEG).</Form.Text>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="profName">
                      <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="profPhone">
                      <Form.Label className="small fw-semibold text-secondary">Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="profAge">
                      <Form.Label className="small fw-semibold text-secondary">Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="profGender">
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
                  <Col md={4}>
                    <Form.Group controlId="profEmail">
                      <Form.Label className="small fw-semibold text-secondary">Email Address (Read-Only)</Form.Label>
                      <Form.Control
                        type="email"
                        value={user?.email || ''}
                        className="form-control-custom"
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="profAddress">
                      <Form.Label className="small fw-semibold text-secondary">Residential Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />
                  <h5 className="fw-bold mb-3" style={{ fontFamily: 'Outfit' }}>Change Password (Optional)</h5>
                  <Col md={6}>
                    <Form.Group controlId="profPassword">
                      <Form.Label className="small fw-semibold text-secondary">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="••••••••"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="profConfirmPassword">
                      <Form.Label className="small fw-semibold text-secondary">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="••••••••"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-custom px-4 py-2.5 text-white fw-semibold mt-4"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default UserProfile;