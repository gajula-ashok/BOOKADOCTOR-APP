import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { FileQuestion } from 'lucide-react';
const NotFound = () => {
  return (
    <Container className="py-5 text-center fade-in-element d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="bg-danger-subtle p-4 rounded-circle mb-4 text-danger">
        <FileQuestion size={50} />
      </div>
      <h1 className="fw-bold display-4 mb-2" style={{ fontFamily: 'Outfit' }}>404 - Page Not Found</h1>
      <p className="text-secondary mb-4" style={{ maxWidth: '450px' }}>
        The link you followed may be broken, or the page has been removed. Check the URL or return to home.
      </p>
      <Button as={Link} to="/" className="btn-primary-custom px-4 text-white">
        Back to Home
      </Button>
    </Container>
  );
};
export default NotFound;