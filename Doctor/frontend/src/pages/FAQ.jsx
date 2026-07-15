import { Container, Accordion } from 'react-bootstrap';
const FAQ = () => {
  return (
    <Container className="py-5 fade-in-element" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 mb-3" style={{ fontFamily: 'Outfit' }}>Help & FAQs</h1>
        <p className="text-secondary">
          Find fast answers to common questions about accounts, bookings, fees and doctor onboarding.
        </p>
      </div>
      <Accordion defaultActiveKey="0" className="border rounded-3 overflow-hidden shadow-sm bg-white">
        <Accordion.Item eventKey="0" className="border-bottom">
          <Accordion.Header className="fw-semibold">Are my medical documents encrypted?</Accordion.Header>
          <Accordion.Body className="text-secondary small">
            Yes, files uploaded to MediCare are saved locally using random hashes inside the server directory and linked via authorized MongoDB entries. Only the booking patient, consulting doctor, and administrators have reading rights.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="1" className="border-bottom">
          <Accordion.Header className="fw-semibold">Can I modify my available timings as a doctor?</Accordion.Header>
          <Accordion.Body className="text-secondary small">
            Absolutely. Log in to your doctor account, head over to the "Profile & Timings" tab in your sidebar, select your new available hours and consultation days, and hit Save. The search directory updates immediately.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className="border-bottom">
          <Accordion.Header className="fw-semibold">How long does doctor approval take?</Accordion.Header>
          <Accordion.Body className="text-secondary small">
            Our administrators typically inspect license numbers and diplomas within 24 to 48 hours of submission. You will get a notification instantly when your account goes live.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="border-bottom">
          <Accordion.Header className="fw-semibold">What is the cancellation policy?</Accordion.Header>
          <Accordion.Body className="text-secondary small">
            Patients can cancel any pending or approved appointment from their dashboard. Cancelling creates a notification warning the doctor of the change. There are no platform cancellation penalties.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};
export default FAQ;