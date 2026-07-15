import { Container } from 'react-bootstrap';
const PrivacyPolicy = () => {
  return (
    <Container className="py-5 fade-in-element" style={{ maxWidth: '800px' }}>
      <h1 className="fw-bold mb-4" style={{ fontFamily: 'Outfit' }}>Privacy Policy</h1>
      <p className="text-muted small">Effective date: July 14, 2026</p>
      
      <div className="text-secondary small mt-4" style={{ lineHeight: '1.7' }}>
        <h4 className="fw-bold text-dark mt-4" style={{ fontFamily: 'Outfit' }}>1. Information We Collect</h4>
        <p>
          We collect basic identifiers when you create an account: name, email address, password hash, telephone lines, age, gender, and residential addresses. If you upload medical reports or certificates, we host these files securely inside our server configuration to make them accessible to your designated practitioner.
        </p>
        <h4 className="fw-bold text-dark mt-4" style={{ fontFamily: 'Outfit' }}>2. How We Use Data</h4>
        <p>
          Your information is used solely to facilitate the patient-doctor appointment booking pipeline. We do not sell, rent, or lease your contact information or clinical history to third-party advertising companies.
        </p>
        <h4 className="fw-bold text-dark mt-4" style={{ fontFamily: 'Outfit' }}>3. Data Integrity & Security</h4>
        <p>
          We implement secure JWT hashing, password salts using bcrypt, and strict authorization middleware checks to prevent unauthorized access. If you wish to delete your account, you can make a request to the platform administrators.
        </p>
      </div>
    </Container>
  );
};
export default PrivacyPolicy;
