import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSuccess(false), 4000);
  };
  return (
    <Container className="py-5 fade-in-element">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 mb-3" style={{ fontFamily: 'Outfit' }}>Contact Us</h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Have questions about doctor listings, applications, or patient bookings? Our team is here 24/7.
        </p>
      </div>
      <Row className="gy-5">
        {/* Contact Info Cards */}
        <Col lg={4}>
          <div className="d-flex flex-column gap-4">
            <Card className="card-custom border-0 p-4 bg-white shadow-sm d-flex flex-row align-items-center gap-3">
              <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                <Phone size={24} />
              </div>
              <div>
                <h5 className="fw-semibold mb-1" style={{ fontSize: '1rem' }}>Phone Lines</h5>
                <p className="text-secondary small mb-0">+1 (800) 123-4567</p>
                <p className="text-muted small mb-0">Toll-free, 24/7 helpline</p>
              </div>
            </Card>
            <Card className="card-custom border-0 p-4 bg-white shadow-sm d-flex flex-row align-items-center gap-3">
              <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h5 className="fw-semibold mb-1" style={{ fontSize: '1rem' }}>Email Support</h5>
                <p className="text-secondary small mb-0">support@medicare.com</p>
                <p className="text-muted small mb-0">We respond in under 2 hours</p>
              </div>
            </Card>
            <Card className="card-custom border-0 p-4 bg-white shadow-sm d-flex flex-row align-items-center gap-3">
              <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h5 className="fw-semibold mb-1" style={{ fontSize: '1rem' }}>HQ Location</h5>
                <p className="text-secondary small mb-0">100 Health Science Parkway</p>
                <p className="text-muted small mb-0">Suite 400, Chicago, IL 60611</p>
              </div>
            </Card>
          </div>
        </Col>
        {/* Contact Form */}
        <Col lg={8}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm">
            <Card.Body>
              <h3 className="fw-bold h4 mb-4" style={{ fontFamily: 'Outfit' }}>Send a Message</h3>
              {success && (
                <Alert variant="success" className="d-flex align-items-center gap-2 mb-4">
                  <CheckCircle2 size={16} />
                  <span>Your message has been sent successfully. Our support team will contact you shortly.</span>
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="contactName">
                      <Form.Label className="small fw-semibold text-secondary">Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control-custom"
                        placeholder="John Doe"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactEmail">
                      <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control-custom"
                        placeholder="john@example.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="contactSubject">
                      <Form.Label className="small fw-semibold text-secondary">Subject</Form.Label>
                      <Form.Control
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="form-control-custom"
                        placeholder="Help with booking"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="contactMessage">
                      <Form.Label className="small fw-semibold text-secondary">Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-control-custom"
                        placeholder="Write your query here..."
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" className="btn-primary-custom px-4 py-2 text-white fw-semibold mt-4 d-flex align-items-center gap-2">
                  <Send size={16} />
                  <span>Send Message</span>
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Contact;
