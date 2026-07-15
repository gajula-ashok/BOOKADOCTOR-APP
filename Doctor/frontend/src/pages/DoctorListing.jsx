import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import Loader from '../components/Loader';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
const DoctorListing = () => {
  const location = useLocation();
  // Load initial search from URL params if available
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [experience, setExperience] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [availability, setAvailability] = useState('');
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState(0);
  const fetchDoctorsList = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        search: searchVal,
        specialization,
        hospital,
        experience,
        maxFee,
        availability
      };
      // Filter out empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      const response = await axios.get('/api/doctors', { params });
      setDoctors(response.data.doctors);
      setPage(response.data.page);
      setTotalPages(response.data.pages);
      setTotalDoctorsCount(response.data.total);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDoctorsList();
  }, [page, specialization, availability]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctorsList();
  };
  const handleClearFilters = () => {
    setSearchVal('');
    setSpecialization('');
    setHospital('');
    setExperience('');
    setMaxFee('');
    setAvailability('');
    setPage(1);
  };
  return (
    <Container className="py-5 fade-in-element">
      <div className="mb-4">
        <h1 className="fw-bold display-6 mb-2" style={{ fontFamily: 'Outfit' }}>Find & Book Healthcare Specialists</h1>
        <p className="text-secondary mb-0">Browse certified medical professionals, search by specialization and filter by timings.</p>
      </div>
      <Row className="gy-4">
        {/* Filters Sidebar */}
        <Col lg={4}>
          <Card className="card-custom border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: '90px', zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
                <Filter size={18} className="text-primary" />
                <span>Filters</span>
              </h5>
              <button
                onClick={handleClearFilters}
                className="btn btn-link text-primary p-0 d-flex align-items-center gap-1 text-decoration-none small"
              >
                <RefreshCw size={14} />
                <span>Reset</span>
              </button>
            </div>
            <Form onSubmit={handleSearchSubmit}>
              <Form.Group className="mb-3" controlId="filterSpec">
                <Form.Label className="small fw-semibold text-secondary">Specialization</Form.Label>
                <Form.Select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="form-control-custom"
                >
                  <option value="">All Specializations</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gphthalmology">Ophthalmology</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="filterHosp">
                <Form.Label className="small fw-semibold text-secondary">Hospital / Clinic</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Grace Hospital"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="form-control-custom"
                />
              </Form.Group>
              <Row className="gy-3 mb-3">
                <Col xs={6}>
                  <Form.Group controlId="filterExp">
                    <Form.Label className="small fw-semibold text-secondary">Min Experience (Yrs)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g. 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="form-control-custom"
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId="filterFee">
                    <Form.Label className="small fw-semibold text-secondary">Max Fee (Rupees)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g. 200"
                      value={maxFee}
                      onChange={(e) => setMaxFee(e.target.value)}
                      className="form-control-custom"
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4" controlId="filterDay">
                <Form.Label className="small fw-semibold text-secondary">Available Days</Form.Label>
                <Form.Select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="form-control-custom"
                >
                  <option value="">Any Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn-primary-custom w-100 py-2 text-white fw-medium">
                Apply Filters
              </Button>
            </Form>
          </Card>
        </Col>
        {/* Doctor Grid and Search Bar */}
        <Col lg={8}>
          {/* Top Search Bar */}
          <Form onSubmit={handleSearchSubmit} className="mb-4">
            <InputGroup className="shadow-sm rounded overflow-hidden">
              <Form.Control
                type="text"
                placeholder="Search doctors by name, hospital or specialization..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="form-control-custom py-3 border-end-0 shadow-none rounded-0"
              />
              <Button type="submit" className="btn-primary-custom px-4 rounded-0 d-flex align-items-center">
                <Search size={18} className="text-white" />
              </Button>
            </InputGroup>
          </Form>
          {/* Results Summary */}
          <div className="d-flex justify-content-between align-items-center mb-3 text-secondary small">
            <span>Found {totalDoctorsCount} approved medical specialists</span>
            {doctors.length > 0 && <span>Page {page} of {totalPages}</span>}
          </div>
          {/* Doctor Grid */}
          {loading ? (
            <Loader />
          ) : doctors.length === 0 ? (
            <Card className="card-custom border-0 p-5 text-center bg-white shadow-sm my-4">
              <p className="text-muted fs-5 mb-2">No doctors matched your criteria.</p>
              <p className="text-secondary small mb-4">Try clearing filters or search term to see more results.</p>
              <Button onClick={handleClearFilters} className="btn-primary-custom mx-auto px-4 text-white">
                Clear Filters
              </Button>
            </Card>
          ) : (
            <>
              <Row className="g-4">
                {doctors.map((doctor) => (
                  <Col key={doctor._id} md={6}>
                    <DoctorCard doctor={doctor} />
                  </Col>
                ))}
              </Row>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                  <Button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="btn btn-outline-primary p-2 d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <span className="fw-semibold text-secondary small">
                    {page} / {totalPages}
                  </span>
                  <Button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="btn btn-outline-primary p-2 d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default DoctorListing;
