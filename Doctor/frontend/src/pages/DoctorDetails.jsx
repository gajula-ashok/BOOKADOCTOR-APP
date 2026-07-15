import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import Loader from '../components/Loader';
import { Star, MapPin, Clock, Calendar, CheckCircle2, ShieldAlert, Award, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useApp();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  // Booking form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [medicalReport, setMedicalReport] = useState(null);
  // Validation feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dayWarning, setDayWarning] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`/api/doctors/${id}`);
        setDoctor(response.data);
        generateTimeSlots(response.data.availableTimings);
      } catch (error) {
        console.error('Error fetching doctor:', error);
        setErrorMsg('Failed to load doctor details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);
  // Generate 30-min slots based on start/end times (e.g. 09:00 - 17:00)
  const generateTimeSlots = (timings) => {
    if (!timings || !timings.start || !timings.end) return;
    const slots = [];
    let currentHour = parseInt(timings.start.split(':')[0], 10);
    let currentMin = parseInt(timings.start.split(':')[1], 10);
    const endHour = parseInt(timings.end.split(':')[0], 10);
    const endMin = parseInt(timings.end.split(':')[1], 10);
    const formatSlotTime = (h, m) => {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      return `${hh}:${mm}`;
    };
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      slots.push(formatSlotTime(currentHour, currentMin));
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }
    }
    setTimeSlots(slots);
  };
  // Validate day of the week selected
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setDayWarning('');
    if (!selectedDate || !doctor) return;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(selectedDate + 'T00:00:00');
    const dayName = days[d.getDay()];
    if (doctor.availableDays && !doctor.availableDays.includes(dayName)) {
      setDayWarning(`Warning: Dr. ${doctor.userId.name} is usually not available on ${dayName}s. Normal schedule: ${doctor.availableDays.join(', ')}`);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 10) {
        setErrorMsg('Medical document must be smaller than 10MB.');
        return;
      }
      setMedicalReport(file);
      setErrorMsg('');
    }
  };
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!token || !user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      setErrorMsg('Only registered patients can book appointments.');
      return;
    }
    if (!date || !time || !problemDescription) {
      setErrorMsg('Please select a date, time slot, and describe your symptoms.');
      return;
    }
    setBookingLoading(true);
    const bookingData = new FormData();
    bookingData.append('doctorId', doctor._id);
    bookingData.append('date', date);
    bookingData.append('time', time);
    bookingData.append('problemDescription', problemDescription);
    if (medicalReport) {
      bookingData.append('medicalReport', medicalReport);
    }
    try {
      const response = await axios.post('/api/appointments/book', bookingData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(response.data.message);
      // Reset form
      setDate('');
      setTime('');
      setProblemDescription('');
      setMedicalReport(null);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };
  if (loading) return <Loader fullScreen />;
  if (!doctor) {
    return (
      <Container className="py-5 text-center fade-in-element">
        <Alert variant="danger">Doctor details could not be loaded.</Alert>
        <Link to="/doctors" className="btn btn-primary-custom mt-3">Back to Search</Link>
      </Container>
    );
  }
  const name = doctor.userId?.name || 'Doctor';
  const profilePhoto = doctor.userId?.profilePhoto || '/uploads/default-avatar.png';
  return (
    <Container className="py-5 fade-in-element">
      <Row className="gy-4">
        {/* Left Column: Doctor Profile details */}
        <Col lg={7}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm mb-4">
            <Card.Body className="p-0">
              <div className="d-flex flex-column flex-md-row gap-4 mb-4 align-items-center align-items-md-start">
                <img
                  src={profilePhoto.startsWith('/uploads') ? profilePhoto : '/uploads/default-avatar.png'}
                  alt={name}
                  className="rounded-4 border"
                  width="180"
                  height="180"
                  style={{ objectFit: 'cover' }}
                />
                <div className="text-center text-md-start flex-grow-1">
                  <Badge bg="primary-subtle" className="text-primary mb-2 px-3 py-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
                    {doctor.specialization}
                  </Badge>
                  <h1 className="fw-bold h2 mb-1" style={{ fontFamily: 'Outfit' }}>Dr. {name}</h1>
                  <p className="text-secondary mb-2">{doctor.qualification}</p>
                  
                  <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mt-3 align-items-center">
                    <div className="d-flex align-items-center gap-1 text-warning bg-warning-subtle px-2 py-1 rounded small">
                      <Star size={15} fill="#f59e0b" className="text-warning" />
                      <span className="fw-bold">{doctor.rating.toFixed(1)} ({doctor.ratingsCount} reviews)</span>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-primary bg-primary-subtle px-2 py-1 rounded small">
                      <Award size={15} />
                      <span className="fw-bold">{doctor.experience} Yrs Exp</span>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="fw-bold mb-3 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Biography</h4>
              <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>{doctor.biography}</p>
              <h4 className="fw-bold mb-3 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Practice Location & Contact</h4>
              <div className="text-secondary small mb-4 d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span><strong>Hospital:</strong> {doctor.hospital}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span><strong>Timing Slot:</strong> {doctor.availableTimings.start} to {doctor.availableTimings.end}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span><strong>Consultation Days:</strong> {doctor.availableDays.join(', ')}</span>
                </div>
                {doctor.userId?.phone && (
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span><strong>Phone Line:</strong> {doctor.userId.phone}</span>
                  </div>
                )}
              </div>
              <h4 className="fw-bold mb-3 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Details</h4>
              <div className="text-secondary small">
                <p className="mb-2"><strong>Languages:</strong> {doctor.languages.join(', ')}</p>
                <p className="mb-0"><strong>Standard Fee:</strong> <span className="fw-bold text-primary">{formatCurrency(doctor.consultationFee)}</span> per consult</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* Right Column: Booking panel */}
        <Col lg={5}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm sticky-top" style={{ top: '90px', zIndex: 10 }}>
            <Card.Body className="p-0">
              <h3 className="fw-bold h4 mb-3 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Book Consultation</h3>
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
              {!token ? (
                <div className="text-center py-4 bg-light rounded p-3">
                  <p className="text-secondary small mb-3">You must login to book appointments with doctors.</p>
                  <Button as={Link} to="/login" className="btn-primary-custom w-100 text-white">Login to Book</Button>
                </div>
              ) : user && user.role !== 'patient' ? (
                <Alert variant="warning" className="small">
                  Accounts with role <strong>{user.role}</strong> are not allowed to book patient appointments.
                </Alert>
              ) : (
                <Form onSubmit={handleBookingSubmit}>
                  {dayWarning && (
                    <Alert variant="warning" className="small py-2 mb-3">
                      {dayWarning}
                    </Alert>
                  )}
                  <Form.Group className="mb-3" controlId="bookDate">
                    <Form.Label className="small fw-semibold text-secondary">Select Consultation Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]} // forbid past dates
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="bookTime">
                    <Form.Label className="small fw-semibold text-secondary">Select Time Slot</Form.Label>
                    <Form.Select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="form-control-custom"
                      required
                    >
                      <option value="">Choose a slot...</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="bookProblem">
                    <Form.Label className="small fw-semibold text-secondary">Describe Your Symptoms</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Fever, cough, joint pain for 3 days..."
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="bookReport">
                    <Form.Label className="small fw-semibold text-secondary d-flex align-items-center gap-1">
                      <FileText size={15} />
                      <span>Upload Medical Report (Optional)</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleFileChange}
                      className="form-control-custom"
                    />
                    <Form.Text className="text-muted small">Max file size 10MB (PDF/JPG/PNG/Doc).</Form.Text>
                  </Form.Group>
                  <Button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary-custom w-100 py-2.5 text-white fw-semibold d-flex justify-content-center align-items-center"
                  >
                    {bookingLoading ? 'Submitting Request...' : 'Request Appointment'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default DoctorDetails;