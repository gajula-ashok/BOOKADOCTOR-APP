import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// Context
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
// Components
import CustomNavbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorListing from './pages/DoctorListing';
import DoctorDetails from './pages/DoctorDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
// Patient Dashboards
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import ApplyDoctor from './pages/ApplyDoctor';
// Doctor Dashboards
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
// Admin Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorApplications from './pages/admin/DoctorApplications';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageAppointments from './pages/admin/ManageAppointments';
// Dashboard Layout wrapper to display sidebar side-by-side with content
const DashboardLayout = ({ children }) => {
  return (
    <Container fluid className="px-0">
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4 p-md-5" style={{ minHeight: 'calc(100vh - 70px)', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </Container>
  );
};
const App = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <CustomNavbar />
            
            <div className="flex-grow-1">
              <Routes>
                {/* Public General Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctors" element={<DoctorListing />} />
                <Route path="/doctors/:id" element={<DoctorDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                {/* Patient Routes (Protected) */}
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <DashboardLayout>
                        <UserDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/profile"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <DashboardLayout>
                        <UserProfile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctors/apply"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <DashboardLayout>
                        <ApplyDoctor />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Doctor Routes (Protected) */}
                <Route
                  path="/doctor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DashboardLayout>
                        <DoctorDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/profile"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DashboardLayout>
                        <DoctorProfile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Admin Routes (Protected) */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <AdminDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <DoctorApplications />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <ManageUsers />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/doctors"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <ManageDoctors />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <ManageAppointments />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Catch-all Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
};
export default App;