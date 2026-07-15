import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { HeartPulse, Award, Users, GraduationCap } from 'lucide-react';
const About = () => {
  return (
    <Container className="py-5 fade-in-element">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 mb-3" style={{ fontFamily: 'Outfit' }}>About MediCare</h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Bridging the gap between doctor and patient with a seamless digital appointment platform.
        </p>
      </div>
      <Row className="align-items-center gy-5 mb-5">
        <Col lg={6}>
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
            alt="Medical team"
            className="img-fluid rounded-4 shadow-md"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
          />
        </Col>
        <Col lg={6}>
          <h2 className="fw-bold mb-4" style={{ fontFamily: 'Outfit' }}>Our Mission & Values</h2>
          <p className="text-secondary" style={{ lineHeight: '1.7' }}>
            Founded in 2026, MediCare was created to eliminate the friction in modern healthcare booking. We believe that receiving timely clinical advice should be as simple as booking a ride. By verifying credentials manually and keeping patient medical histories structured, we enable immediate trust and communication between doctors and patients.
          </p>
          <p className="text-secondary" style={{ lineHeight: '1.7' }}>
            We work continuously with clinical boards and administrators to keep our doctor directory up to date and clean of fraudulent profiles. With over 250 verified doctors and 50,000 completed consultations, we are Chicago's primary online health portal.
          </p>
        </Col>
      </Row>
      <Row className="g-4 py-4 text-center">
        {[
          { title: 'Certified Staff', count: '250+', desc: 'Board certified clinical experts', icon: <GraduationCap className="text-primary" size={28} /> },
          { title: 'Satisfied Patients', count: '15,000+', desc: 'Happy patients registered on platform', icon: <Users className="text-primary" size={28} /> },
          { title: 'Completed Bookings', count: '50,000+', desc: 'Consultations completed securely', icon: <HeartPulse className="text-primary" size={28} /> },
          { title: 'Quality Awards', count: '12+', desc: 'Honored for digital healthcare innovation', icon: <Award className="text-primary" size={28} /> }
        ].map((item, index) => (
          <Col key={index} sm={6} lg={3}>
            <Card className="card-custom border-0 p-4 bg-white shadow-sm h-100">
              <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mx-auto mb-3" style={{ width: 'fit-content' }}>
                {item.icon}
              </div>
              <h3 className="fw-bold display-6 mb-1 text-primary" style={{ fontFamily: 'Outfit' }}>{item.count}</h3>
              <h5 className="fw-semibold mb-2" style={{ fontSize: '1rem' }}>{item.title}</h5>
              <p className="text-secondary small mb-0">{item.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default About;