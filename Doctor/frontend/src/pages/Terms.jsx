import { Container } from 'react-bootstrap';
const Terms = () => {
  return (
    <Container className="py-5 fade-in-element" style={{ maxWidth: '800px' }}>
      <h1 className="fw-bold mb-4" style={{ fontFamily: 'Outfit' }}>Terms & Conditions</h1>
      <p className="text-muted small">Effective date: July 14, 2026</p>
      <div className="text-secondary small mt-4" style={{ lineHeight: '1.7' }}>
        <h4 className="fw-bold text-dark mt-4" style={{ fontFamily: 'Outfit' }}>1. Agreement to Terms</h4>
        <p>
          By creating a patient, doctor or administrator account on MediCare, you agree to comply with our code of conduct. You agree not to upload fraudulent medical credentials or certificates.
        </p>
        <h4 className="fw-bold text-dark mt-4" style={{ fontFamily: 'Outfit' }}>2. Booking Cancellation Rules</h4>
        <p>
          Appointments are scheduling requests. Doctors reserve the right to accept or reject bookings based on clinical urgency or timing conflicts.
        </p>
        <h4 className="fw-bold text-dark mt-4" style={{ fontFamily: 'Outfit' }}>3. Limitation of Liability</h4>
        <p>
          MediCare is a booking platform. The platform is not liable for clinical diagnoses or malpractice from individual certified doctors registered on the directory. Always consult a general practitioner for physical emergencies.
        </p>
      </div>
    </Container>
  );
};
export default Terms;