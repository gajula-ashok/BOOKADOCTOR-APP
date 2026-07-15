import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import { LogIn, Eye, EyeOff, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login, user, token } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);

  // If already logged in, redirect based on user role
  useEffect(() => {
    if (token && user) {
      redirectUser(user.role);
    }
  }, [token, user]);

  const redirectUser = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await axios.post('https://bookadoctor-backend.onrender.com/api/user/login', data);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard'); // this 'navigate' must be a function
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoadingLocal(true);
    const result = await login(email, password);
    setLoadingLocal(false);

    if (result.success) {
      // Remember me email save logic
      if (rememberMe) {
        localStorage.setItem('medicare-remember-email', email);
      } else {
        localStorage.removeItem('medicare-remember-email');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('medicare-remember-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <Container className="py-5 fade-in-element">
      <Row className="justify-content-center py-5">
        <Col lg={5} md={8}>
          <Card className="card-custom border-0 p-4 shadow-lg bg-white">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mb-3">
                  <LogIn className="text-primary" size={28} />
                </div>
                <h2 className="fw-bold" style={{ fontFamily: 'Outfit' }}>Welcome Back</h2>
                <p className="text-secondary small">Access your patient, doctor or administrator account</p>
              </div>

              {errorMsg && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 small">
                  <ShieldAlert size={16} />
                  <span>{errorMsg}</span>
                </Alert>
              )}

              <Form onSubmit={handleLoginSubmit}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control-custom"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control-custom"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-secondary p-2 me-2"
                      style={{ border: 'none', background: 'none' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4 small">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember Me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="text-secondary cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => alert('Forgot Password feature coming soon')}                    className="btn btn-link p-0 text-primary fw-medium text-decoration-none"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button onClick={handleLogin}>Login</button> // pass function reference
              </Form>

              <div className="text-center mt-3 small">
                <span className="text-secondary">Don't have an account? </span>
                <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                  Register as Patient
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;