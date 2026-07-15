import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { HeartPulse } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3 fw-bold text-primary" style={{ fontSize: '1.25rem', fontFamily: 'Outfit' }}>
              <HeartPulse size={24} />
              <span>MediCare</span>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              MediCare is a state-of-the-art healthcare portal offering seamless digital doctor appointments, medical records management, and prompt patient consultations. Helping you live a healthier, longer life.
            </p>
          </Col>
          <Col lg={2} md={6}>
            <h5 className="fw-semibold mb-3" style={{ fontSize: '1rem', fontFamily: 'Outfit' }}>Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/" className="text-secondary text-decoration-none hover-link">Home</Link></li>
              <li><Link to="/doctors" className="text-secondary text-decoration-none hover-link">Search Doctors</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none hover-link">About Us</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none hover-link">Contact Us</Link></li>
            </ul>
          </Col>
          <Col lg={2} md={6}>
            <h5 className="fw-semibold mb-3" style={{ fontSize: '1rem', fontFamily: 'Outfit' }}>Support & Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/faq" className="text-secondary text-decoration-none hover-link">FAQs</Link></li>
              <li><Link to="/privacy" className="text-secondary text-decoration-none hover-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-secondary text-decoration-none hover-link">Terms & Conditions</Link></li>
            </ul>
          </Col>
          <Col lg={4} md={6}>
            <h5 className="fw-semibold mb-3" style={{ fontSize: '1rem', fontFamily: 'Outfit' }}>Contact Info</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary" style={{ fontSize: '0.9rem' }}>
              <li><strong>Email:</strong> support@medicare.com</li>
              <li><strong>Phone:</strong> +1 (800) 123-4567</li>
              <li><strong>Hours:</strong> Mon - Sun, 24/7 Helpline</li>
              <li><strong>HQ Address:</strong> 100 Health Science Parkway, Suite 400, Chicago, IL 60611</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
          <p className="text-secondary mb-0">
            &copy; {new Date().getFullYear()} MediCare Inc. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <Link to="/privacy" className="text-secondary text-decoration-none">Privacy</Link>
            <Link to="/terms" className="text-secondary text-decoration-none">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
