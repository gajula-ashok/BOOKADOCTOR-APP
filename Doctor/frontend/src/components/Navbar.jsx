import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, HeartPulse, LogOut, User, LayoutDashboard, Menu } from 'lucide-react';
const CustomNavbar = () => {
  const { user, logout, notifications, unreadCount, markNotificationsRead, markSingleNotificationRead } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/user/dashboard';
  };
  const getProfileLink = () => {
    if (!user) return '/';
    if (user.role === 'doctor') return '/doctor/profile';
    return '/user/profile';
  };
  const toggleNotifications = (e) => {
    e.preventDefault();
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
  };
  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom sticky-top glass-panel" style={{ zIndex: 1030 }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary" style={{ fontSize: '1.45rem', fontFamily: 'Outfit' }}>
            <HeartPulse size={28} className="text-primary" />
            <span>MediCare</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-2 order-lg-3">
            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="btn btn-link text-secondary p-2 d-flex align-items-center justify-content-center"
              title="Toggle Light/Dark Theme"
              style={{ border: 'none', background: 'none' }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-warning" />}
            </button>
            {/* Notification Bell */}
            {user && (
              <div className="position-relative">
                <button
                  onClick={toggleNotifications}
                  className="btn btn-link text-secondary p-2 d-flex align-items-center justify-content-center"
                  style={{ border: 'none', background: 'none' }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <Badge pill bg="danger" className="position-absolute top-0 start-50 translate-middle-x" style={{ fontSize: '0.65rem' }}>
                      {unreadCount}
                    </Badge>
                  )}
                </button>
                {/* Notifications Dropdown Window */}
                {showNotifications && (
                  <div
                    className="position-absolute end-0 mt-2 p-2 card-custom bg-white border shadow-lg"
                    style={{ width: '320px', zIndex: 1050, maxHeight: '400px', overflowY: 'auto' }}
                  >
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-semibold">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markNotificationsRead}
                          className="btn btn-link p-0 text-primary fw-medium"
                          style={{ fontSize: '0.75rem', textDecoration: 'none' }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-muted text-center py-4 mb-0" style={{ fontSize: '0.85rem' }}>
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => markSingleNotificationRead(notif._id)}
                          className={`p-2 rounded mb-1 cursor-pointer transition-all ${
                            notif.isRead ? 'bg-light text-muted' : 'bg-primary-subtle text-dark fw-medium'
                          }`}
                          style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          <div>{notif.message}</div>
                          <div className="text-end" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Profile Dropdown */}
            {user ? (
              <NavDropdown
                title={
                  <img
                    src={user.profilePhoto.startsWith('/uploads') ? user.profilePhoto : '/uploads/default-avatar.png'}
                    alt={user.name}
                    className="rounded-circle border"
                    width="32"
                    height="32"
                    style={{ objectFit: 'cover' }}
                  />
                }
                id="profile-dropdown"
                align="end"
                className="no-caret"
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-semibold text-truncate" style={{ maxWidth: '160px' }}>{user.name}</div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.75rem', maxWidth: '160px' }}>{user.email}</div>
                  <Badge bg="primary-subtle" className="text-primary mt-1 text-capitalize" style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </Badge>
                </div>
                <NavDropdown.Item as={Link} to={getDashboardLink()} className="d-flex align-items-center gap-2 py-2">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={getProfileLink()} className="d-flex align-items-center gap-2 py-2">
                  <User size={16} />
                  <span>Edit Profile</span>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 py-2 text-danger">
                  <LogOut size={16} />
                  <span>Logout</span>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-none d-md-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary px-3 btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary-custom px-3 btn-sm">Register</Link>
              </div>
            )}
            <button
              onClick={() => setShowMobileNav(true)}
              className="btn btn-link text-secondary p-2 d-lg-none"
              style={{ border: 'none', background: 'none' }}
            >
              <Menu size={24} />
            </button>
          </div>
          <Navbar.Collapse className="d-none d-lg-flex order-lg-2">
            <Nav className="mx-auto gap-1">
              <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>
              <Nav.Link as={Link} to="/doctors" active={location.pathname === '/doctors'}>Search Doctors</Nav.Link>
              <Nav.Link as={Link} to="/about" active={location.pathname === '/about'}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/contact" active={location.pathname === '/contact'}>Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Offcanvas Drawer for Mobile Navigation */}
      <Offcanvas show={showMobileNav} onHide={() => setShowMobileNav(false)} placement="end">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold text-primary" style={{ fontFamily: 'Outfit' }}>
            <HeartPulse size={24} />
            <span>MediCare</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <Nav className="flex-column gap-2 text-center" style={{ fontSize: '1.1rem' }}>
            <Nav.Link as={Link} to="/" onClick={() => setShowMobileNav(false)} active={location.pathname === '/'}>Home</Nav.Link>
            <Nav.Link as={Link} to="/doctors" onClick={() => setShowMobileNav(false)} active={location.pathname === '/doctors'}>Search Doctors</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={() => setShowMobileNav(false)} active={location.pathname === '/about'}>About Us</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={() => setShowMobileNav(false)} active={location.pathname === '/contact'}>Contact</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to={getDashboardLink()} onClick={() => setShowMobileNav(false)}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to={getProfileLink()} onClick={() => setShowMobileNav(false)}>Profile</Nav.Link>
              </>
            )}
          </Nav>
          {!user && (
            <div className="d-grid gap-2 mt-4">
              <Link to="/login" onClick={() => setShowMobileNav(false)} className="btn btn-outline-primary py-2">Login</Link>
              <Link to="/register" onClick={() => setShowMobileNav(false)} className="btn btn-primary-custom py-2">Register</Link>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default CustomNavbar;