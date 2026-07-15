import { Spinner } from 'react-bootstrap';
const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div
        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 glass-panel"
        style={{ zIndex: 9999 }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 font-weight-bold text-primary" style={{ fontFamily: 'Outfit, sans-serif' }}>
            MediCare is loading...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-center align-items-center my-4 py-4 w-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};
export default Loader;
