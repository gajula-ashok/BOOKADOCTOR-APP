import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Stethoscope, Upload, Image as ImageIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';
const ApplyDoctor = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
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
  const [certificates, setCertificates] = useState([]);
  
  const [photoPreview, setPhotoPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload a valid image for your profile photo.');
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };
  const handleCertificatesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setCertificates(files);
      setErrorMsg('');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (availableDays.length === 0) {
      setErrorMsg('Please select at least one available day.');
      return;
    }
    if (!profilePhoto) {
      setErrorMsg('Please upload a professional profile photo.');
      return;
    }
    if (certificates.length === 0) {
      setErrorMsg('Please upload at least one medical certificate.');
      return;
    }
    if (Number(formData.experience) <= 0) {
      setErrorMsg('Please enter a valid years of experience.');
      return;
    }
    if (Number(formData.consultationFee) < 0) {
      setErrorMsg('Consultation fee cannot be negative.');
      return;
    }
    setLoading(true);
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('specialization', formData.specialization);
    submitData.append('experience', formData.experience);
    submitData.append('qualification', formData.qualification);
    submitData.append('hospital', formData.hospital);
    submitData.append('consultationFee', formData.consultationFee);
    
    // Structure available timings as start/end
    const timings = { start: formData.startTime, end: formData.endTime };
    submitData.append('availableTimings', JSON.stringify(timings));
    submitData.append('availableDays', JSON.stringify(availableDays));
    submitData.append('biography', formData.biography);
    // Split languages by comma
    const langArray = formData.languages
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l !== '');
    submitData.append('languages', JSON.stringify(langArray));
    submitData.append('profilePhoto', profilePhoto);
    certificates.forEach((file) => {
      submitData.append('certificates', file);
    });
    try {
      const response = await axios.post('/api/doctors/apply', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(response.data.message);
      // Scroll to top
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="py-5 fade-in-element">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="card-custom border-0 p-4 shadow-lg bg-white">
            <Card.Body>
              <div className="text-center mb-4 border-bottom pb-3">
                <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mb-3">
                  <Stethoscope className="text-primary" size={32} />
                </div>
                <h1 className="fw-bold h2" style={{ fontFamily: 'Outfit' }}>Doctor Application Form</h1>
                <p className="text-secondary small mx-auto" style={{ maxWidth: '600px' }}>
                  Register your medical credentials. Once approved by our administrator team, you will receive doctor dashboard credentials and patients can book appointments with you.
                </p>
              </div>
              {successMsg && (
                <Alert variant="success" className="d-flex align-items-center gap-2 mb-4">
                  <CheckCircle2 size={20} />
                  <span>{successMsg}</span>
                </Alert>
              )}
              {errorMsg && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 mb-4">
                  <ShieldAlert size={20} />
                  <span>{errorMsg}</span>
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Personal Information</h4>
                <Row className="gy-3 mb-4">
                  <Col md={4}>
                    <Form.Group controlId="applyName">
                      <Form.Label className="small fw-semibold text-secondary">Full Name (with Dr. prefix)</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="Dr. Emily Rose"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="applyEmail">
                      <Form.Label className="small fw-semibold text-secondary">Contact Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="emily@clinic.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="applyPhone">
                      <Form.Label className="small fw-semibold text-secondary">Contact Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="555-0101"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Professional Details</h4>
                <Row className="gy-3 mb-4">
                  <Col md={4}>
                    <Form.Group controlId="applySpec">
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
                    <Form.Group controlId="applyQual">
                      <Form.Label className="small fw-semibold text-secondary">Qualifications (Degrees)</Form.Label>
                      <Form.Control
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="MD, MBBS, Cardiologist Fellow"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="applyExp">
                      <Form.Label className="small fw-semibold text-secondary">Experience (Years)</Form.Label>
                      <Form.Control
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="e.g. 8"
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="applyHosp">
                      <Form.Label className="small fw-semibold text-secondary">Hospital / Clinic Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="St. Jude Clinic, 5th Ave"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="applyFee">
                      <Form.Label className="small fw-semibold text-secondary">Consultation Fee ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="e.g. 150"
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Availability Timings</h4>
                <Row className="gy-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="small fw-semibold text-secondary d-block">Consultation Days</Form.Label>
                    <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light">
                      {daysOfWeek.map((day) => (
                        <Form.Check
                          key={day}
                          type="checkbox"
                          id={`day-${day}`}
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
                        <Form.Group controlId="applyStart">
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
                        <Form.Group controlId="applyEnd">
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
                </Row>
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Biographical details</h4>
                <Row className="gy-3 mb-4">
                  <Col md={6}>
                    <Form.Group controlId="applyLang">
                      <Form.Label className="small fw-semibold text-secondary">Languages spoken (Comma-separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="English, Spanish, French"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="applyBio">
                      <Form.Label className="small fw-semibold text-secondary">Professional Biography</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="biography"
                        value={formData.biography}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="Describe your medical background, fellowships, board certifications..."
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>Certificates & Photo Upload</h4>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="applyPhoto">
                      <Form.Label className="small fw-semibold text-secondary d-block">Doctor Profile Photo</Form.Label>
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
                            onChange={handlePhotoChange}
                            style={{ fontSize: '0.85rem' }}
                            required
                          />
                          <Form.Text className="text-muted small">Professional headshot (max 5MB).</Form.Text>
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="applyCert">
                      <Form.Label className="small fw-semibold text-secondary d-block">Medical Certifications (Upload PDF/Images)</Form.Label>
                      <div className="border p-3 rounded bg-light d-flex align-items-center gap-3" style={{ minHeight: '100px' }}>
                        <div className="bg-white p-3 rounded border d-flex align-items-center justify-content-center text-muted">
                          <Upload size={30} />
                        </div>
                        <div className="flex-grow-1">
                          <Form.Control
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleCertificatesChange}
                            style={{ fontSize: '0.85rem' }}
                            multiple
                            required
                          />
                          <Form.Text className="text-muted small">Upload diploma, licenses, board approvals.</Form.Text>
                          {certificates.length > 0 && (
                            <div className="mt-1 small text-primary fw-medium">
                              {certificates.length} file(s) selected
                            </div>
                          )}
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-custom w-100 py-3 text-white fw-bold mt-5 d-flex justify-content-center align-items-center"
                >
                  {loading ? 'Submitting Application...' : 'Submit Doctor Application'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default ApplyDoctor;