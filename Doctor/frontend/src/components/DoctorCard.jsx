import { Link } from 'react-router-dom';
import { Card, Badge, Button } from 'react-bootstrap';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
const DoctorCard = ({ doctor }) => {
  const {
    _id,
    specialization,
    experience,
    qualification,
    hospital,
    consultationFee,
    availableDays,
    availableTimings,
    rating,
    userId
  } = doctor;
  const name = userId?.name || 'Doctor';
  const profilePhoto = userId?.profilePhoto || '/uploads/default-avatar.png';
  return (
    <Card className="card-custom h-100 border-0 fade-in-element">
      <div className="position-relative" style={{ height: '220px', overflow: 'hidden', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
        <Card.Img
          variant="top"
          src={profilePhoto.startsWith('/uploads') ? profilePhoto : '/uploads/default-avatar.png'}
          alt={name}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
        <Badge
          bg="primary"
          className="position-absolute top-3 start-3 px-3 py-2 fw-semibold"
          style={{ top: '15px', left: '15px', borderRadius: '2rem', fontSize: '0.8rem' }}
        >
          {specialization}
        </Badge>
      </div>
      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h4 className="h5 mb-1 fw-bold text-truncate" style={{ maxWidth: '180px' }}>Dr. {name}</h4>
            <p className="text-secondary small mb-0">{qualification}</p>
          </div>
          <div className="d-flex align-items-center gap-1 text-warning bg-warning-subtle px-2 py-1 rounded" style={{ fontSize: '0.8rem' }}>
            <Star size={14} fill="#f59e0b" className="text-warning" />
            <span className="fw-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="my-3 d-flex flex-column gap-2 text-secondary small">
          <div className="d-flex align-items-center gap-2">
            <MapPin size={15} className="text-primary" />
            <span className="text-truncate">{hospital}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Clock size={15} className="text-primary" />
            <span>{availableTimings?.start} - {availableTimings?.end}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Calendar size={15} className="text-primary" />
            <span className="text-truncate">{availableDays?.join(', ')}</span>
          </div>
        </div>
        <hr className="my-3" style={{ borderColor: 'var(--border-color)' }} />
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div>
            <span className="text-secondary small d-block">Consultation Fee</span>
            <span className="fw-bold h5 text-primary mb-0">{formatCurrency(consultationFee)}</span>
          </div>
          <Button
            as={Link}
            to={`/doctors/${_id}`}
            variant="primary"
            className="btn-primary-custom px-3 py-2"
          >
            Book Appointment
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
export default DoctorCard;