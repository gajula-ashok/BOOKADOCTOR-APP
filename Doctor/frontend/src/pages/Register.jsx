import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import { UserPlus, Image as ImageIcon, ShieldAlert } from 'lucide-react';
const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size and type
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files are allowed for profile photos.');
        return;
      }
      if (file.size > 1024 * 1024 * 5) {
        setErrorMsg('Image size must be smaller than 5MB.');
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    // Validations
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (Number(formData.age) <= 0) {
      setErrorMsg('Please enter a valid age.');
      return;
    }
    setLoadingLocal(true);
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('phone', formData.phone);
    submitData.append('age', formData.age);
    submitData.append('gender', formData.gender);
    submitData.append('address', formData.address);
    if (profilePhoto) {
      submitData.append('profilePhoto', profilePhoto);
    }
    const result = await register(submitData);
    setLoadingLocal(false);
    if (result.success) {
      navigate('/user/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };
  return (
    <Container className="py-5 fade-in-element">
      <Row className="justify-content-center">
        <Col lg={7} md={10}>
          <Card className="card-custom border-0 p-4 shadow-lg bg-white">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mb-3">
                  <UserPlus className="text-primary" size={28} />
                </div>
                <h2 className="fw-bold" style={{ fontFamily: 'Outfit' }}>Create Patient Account</h2>
                <p className="text-secondary small">Sign up to search approved doctors and schedule appointments online</p>
              </div>
              {errorMsg && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 small">
                  <ShieldAlert size={16} />
                  <span>{errorMsg}</span>
                </Alert>
              )}
              <Form onSubmit={handleRegisterSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="regName">
                      <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="John Doe"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="regEmail">
                      <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="john@example.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="regPassword">
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
                  <Col md={6}>
                    <Form.Group controlId="regConfirmPassword">
                      <Form.Label className="small fw-semibold text-secondary">Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="••••••••"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="regPhone">
                      <Form.Label className="small fw-semibold text-secondary">Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="555-0199"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="regAge">
                      <Form.Label className="small fw-semibold text-secondary">Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="25"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="regGender">
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
                    <Form.Group controlId="regAddress">
                      <Form.Label className="small fw-semibold text-secondary">Residential Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="123 Main St, Springfield, IL"
                        required
                      />
                    </Form.Group>
                  </Col>
                  {/* Profile Image Select */}
                  <Col md={12}>
                    <Form.Group controlId="regPhoto" className="mb-2">
                      <Form.Label className="small fw-semibold text-secondary d-block">Profile Photo (Optional)</Form.Label>
                      <div className="d-flex align-items-center gap-3 border p-3 rounded bg-light">
                        <div
                          className="bg-white rounded-circle border d-flex align-items-center justify-content-center"
                          style={{ width: '70px', height: '70px', overflow: 'hidden' }}
                        >
                          {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={30} className="text-muted" />
                          )}
                        </div>
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
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  type="submit"
                  disabled={loadingLocal}
                  className="btn-primary-custom w-100 py-2.5 text-white fw-semibold mt-4 d-flex justify-content-center align-items-center"
                >
                  {loadingLocal ? 'Creating Account...' : 'Register'}
                </Button>
              </Form>
              <div className="text-center mt-4 small">
                <span className="text-secondary">Already have an account? </span>
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                  Login Here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;