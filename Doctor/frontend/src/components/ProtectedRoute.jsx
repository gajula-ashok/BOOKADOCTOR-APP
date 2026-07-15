import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Loader from './Loader';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useApp();
  if (loading) {
    return <Loader fullScreen />;
  }
  if (!token || !user) {
    // Keep target path to redirect back after login if desired, but standard is login
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have permissions - redirect to home
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;