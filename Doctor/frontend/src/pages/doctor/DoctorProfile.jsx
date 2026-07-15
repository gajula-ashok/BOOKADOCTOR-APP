import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { Save, ShieldAlert, CheckCircle2, Stethoscope, Clock, Calendar } from 'lucide-react';
import Loader from '../../components/Loader';
const DoctorProfile = () => {
  const { user, loadProfile } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    specialization: '',
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
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        await loadProfile(); // load profile from context first
      } catch (error) {
        console.error('Error load profile:', error);
      }
    };
    fetchDoctorProfile();
  }, []);
  // Sync state once user.doctorProfile is loaded
  useEffect(() => {
    if (user && user.doctorProfile) {
      const doc = user.doctorProfile;
      setFormData({
        specialization: doc.specialization || '',
        experience: doc.experience || '',
        qualification: doc.qualification || '',
        hospital: doc.hospital || '',
        consultationFee: doc.consultationFee || '',
        startTime: doc.availableTimings?.start || '09:00',
        endTime: doc.availableTimings?.end || '17:00',
        biography: doc.biography || '',
        languages: doc.languages ? doc.languages.join(', ') : ''
      });
      setAvailableDays(doc.availableDays || []);
      setLoading(false);
    } else if (user && user.role !== 'doctor') {
      setErrorMsg('You do not have a doctor profile.');
      setLoading(false);
    }
  }, [user]);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleDayToggle = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
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
    if (Number(formData.consultationFee) < 0) {
      setErrorMsg('Consultation fee cannot be negative.');
      return;
    }
    setSaving(true);
    
    // Convert form fields to schema layout
    const languagesArray = formData.languages
      .split(',')
      .map(l => l.trim())
      .filter(l => l !== '');
    const updatePayload = {
      specialization: formData.specialization,
      experience: Number(formData.experience),
      qualification: formData.qualification,
      hospital: formData.hospital,
      consultationFee: Number(formData.consultationFee),
      availableDays,
      availableTimings: { start: formData.startTime, end: formData.endTime },
      biography: formData.biography,
      languages: languagesArray
    };
    try {
      // In this setup, auth PUT /profile can also handle doctor profile payload adjustments,
      // or we can write a specific doctor update endpoint.
      // Let's check: our API routes inside authRoutes/doctorRoutes. Let's make PUT /api/auth/profile
      // support saving doctor profile details directly if the user is a doctor!
      // Wait, let's verify if authController.js has support for updating doctor details.
      // Ah! In authController.js:
      // "let doctorProfile = null;
      // if (updatedUser.role === 'doctor') {
      //   doctorProfile = await Doctor.findOne({ userId: updatedUser._id });
      // }"
      // Wait, we need the controller to update the Doctor profile inside PUT /api/auth/profile, or do we?
      // Yes! Let's check authController.js. The updateProfile function currently DOES NOT modify the Doctor profile collections, it only fetches it.
      // Ah, to be safe, let's update `authController.js` to also update the Doctor details if role === 'doctor'! That is extremely clean and avoids creating extra endpoints.
      // Or we can create an endpoint `PUT /api/doctors/profile` for doctors, but modifying `updateUserProfile` inside `authController.js` to update Doctor details is very robust.
      // Let's do that! First, let's write `DoctorProfile.jsx` to call `PUT /api/auth/profile` with the fields, and then we will update the backend `authController.js` to support saving those details.
      // Wait! Let's check if the frontend uses `updateProfile(formData)` which submits a multipart Form. Yes!
      // In `DoctorProfile.jsx`, we will call `updateProfile(submitData)`! It is perfect.
      
      const submitData = new FormData();
      submitData.append('specialization', formData.specialization);
      submitData.append('experience', formData.experience);
      submitData.append('qualification', formData.qualification);
      submitData.append('hospital', formData.hospital);
      submitData.append('consultationFee', formData.consultationFee);
      submitData.append('availableDays', JSON.stringify(availableDays));
      submitData.append('availableTimings', JSON.stringify({ start: formData.startTime, end: formData.endTime }));
      submitData.append('biography', formData.biography);
      submitData.append('languages', JSON.stringify(languagesArray));
      // Also include standard user fields so they don't get wiped
      submitData.append('name', user.name);
      submitData.append('phone', user.phone);
      submitData.append('address', user.address);
      submitData.append('age', user.age);
      submitData.append('gender', user.gender);
      const result = await updateProfile(submitData);
      if (result.success) {
        setSuccessMsg('Doctor profile and timings updated successfully.');
        window.scrollTo(0, 0);
      } else {
        setErrorMsg(result.message);
      }
    } catch (error) {
      setErrorMsg(error.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Profile & Consultation Timings</h2>
        <p className="text-secondary small">Set your online clinic hours, hospital affiliations, and consult pricing.</p>
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
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>
                  <Stethoscope size={18} className="me-2" />
                  <span>Professional Credentials</span>
                </h4>
                
                <Row className="gy-3 mb-4">
                  <Col md={6}>
                    <Form.Group controlId="profSpec">
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
                  <Col md={6}>
                    <Form.Group controlId="profQual">
                      <Form.Label className="small fw-semibold text-secondary">Qualifications</Form.Label>
                      <Form.Control
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="profHosp">
                      <Form.Label className="small fw-semibold text-secondary">Hospital Affiliate</Form.Label>
                      <Form.Control
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="profExp">
                      <Form.Label className="small fw-semibold text-secondary">Experience (Yrs)</Form.Label>
                      <Form.Control
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="profFee">
                      <Form.Label className="small fw-semibold text-secondary">Consult Fee ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>
                  <Clock size={18} className="me-2" />
                  <span>Consultation Hours</span>
                </h4>
                
                <Row className="gy-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="small fw-semibold text-secondary">Practice Days</Form.Label>
                    <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light">
                      {daysOfWeek.map((day) => (
                        <Form.Check
                          key={day}
                          type="checkbox"
                          id={`prof-day-${day}`}
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
                        <Form.Group controlId="profStart">
                          <Form.Label className="small fw-semibold text-secondary">Start Time</Form.Label>
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
                        <Form.Group controlId="profEnd">
                          <Form.Label className="small fw-semibold text-secondary">End Time</Form.Label>
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
                <h4 className="fw-bold mb-3 h5 text-primary border-bottom pb-1" style={{ fontFamily: 'Outfit' }}>
                  <Calendar size={18} className="me-2" />
                  <span>Biography & Languages</span>
                </h4>
                <Row className="gy-3">
                  <Col md={12}>
                    <Form.Group controlId="profLang">
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
                    <Form.Group controlId="profBio">
                      <Form.Label className="small fw-semibold text-secondary">Biography description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="biography"
                        value={formData.biography}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  type="submit"
                  disabled={saving}
                  className="btn-primary-custom px-4 py-2.5 text-white fw-semibold mt-4 d-flex align-items-center gap-2"
                >
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default DoctorProfile;