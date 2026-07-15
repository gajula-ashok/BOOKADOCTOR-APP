import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, ListGroup, Table, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loader from '../../components/Loader';
import { Users, Stethoscope, ClipboardList, Clock, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const AdminDashboard = () => {
  const { fetchNotifications } = useApp();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setErrorMsg('Failed to load administrative dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
    fetchNotifications();
  }, []);
  if (loading) return <Loader />;
  if (errorMsg) {
    return <Alert variant="danger" className="m-4">{errorMsg}</Alert>;
  }
  const { stats, monthlyAppointments, recentRegistrations, recentActivities } = statsData;
  // Chart configuration
  const chartData = {
    labels: monthlyAppointments.map((m) => m.month),
    datasets: [
      {
        label: 'Appointments Booked',
        data: monthlyAppointments.map((m) => m.count),
        backgroundColor: 'rgba(37, 99, 235, 0.75)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: 'Outfit' }}>Administrator Dashboard</h2>
        <p className="text-secondary small">System metrics, pending doctor requests, and global appointments monitoring.</p>
      </div>
      {/* Admin Stats Row */}
      <Row className="g-3 mb-4">
        <Col lg={2.4} md={4} xs={6} className="col-lg">
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Total Patients</span>
            <h3 className="fw-bold text-primary mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.users}</span>
              <Users size={20} className="text-primary-subtle" />
            </h3>
          </Card>
        </Col>
        <Col lg={2.4} md={4} xs={6} className="col-lg">
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Total Doctors</span>
            <h3 className="fw-bold text-success mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.doctors}</span>
              <Stethoscope size={20} className="text-success-subtle" />
            </h3>
          </Card>
        </Col>
        <Col lg={2.4} md={4} xs={6} className="col-lg">
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Appointments</span>
            <h3 className="fw-bold text-info mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.appointments}</span>
              <ClipboardList size={20} className="text-info-subtle" />
            </h3>
          </Card>
        </Col>
        <Col lg={2.4} md={4} xs={6} className="col-lg">
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Pending Doctors</span>
            <h3 className="fw-bold text-warning mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{stats.pendingRequests}</span>
              <Clock size={20} className="text-warning-subtle" />
            </h3>
          </Card>
        </Col>
        <Col lg={2.4} md={4} xs={6} className="col-lg">
          <Card className="card-custom border-0 p-3 bg-white shadow-sm">
            <span className="text-secondary small">Total Revenue</span>
            <h3 className="fw-bold text-dark mb-0 mt-1 d-flex justify-content-between align-items-center">
              <span>{formatCurrency(stats.revenue)}</span>
              <DollarSign size={20} className="text-secondary" style={{ opacity: 0.3 }} />
            </h3>
          </Card>
        </Col>
      </Row>
      <Row className="gy-4 mb-4">
        {/* Appointments Chart */}
        <Col lg={8}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm h-100">
            <h4 className="fw-bold mb-4 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Monthly Appointments</h4>
            <div style={{ position: 'relative', height: '260px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        {/* Recent Activity */}
        <Col lg={4}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <Activity size={18} className="text-primary" />
              <span>Recent Activity Logs</span>
            </h5>
            {recentActivities.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle size={24} className="text-muted mb-2" />
                <p className="text-secondary small mb-0">No recent activity logs.</p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {recentActivities.map((act) => (
                  <ListGroup.Item key={act.id} className="px-0 py-2.5 small border-0 border-bottom">
                    <div>{act.activity}</div>
                    <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                      {new Date(act.time).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </Col>
      </Row>
      {/* Recent User Registrations */}
      <Row>
        <Col lg={12}>
          <Card className="card-custom border-0 p-4 bg-white shadow-sm">
            <h4 className="fw-bold mb-3 h5 border-bottom pb-2" style={{ fontFamily: 'Outfit' }}>Recent Patient Registrations</h4>
            {recentRegistrations.length === 0 ? (
              <p className="text-secondary text-center small py-4 mb-0">No patients registered yet.</p>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th className="small text-secondary fw-semibold border-bottom">Patient Details</th>
                      <th className="small text-secondary fw-semibold border-bottom">Email Address</th>
                      <th className="small text-secondary fw-semibold border-bottom">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRegistrations.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={user.profilePhoto?.startsWith('/uploads') ? user.profilePhoto : '/uploads/default-avatar.png'}
                              alt={user.name}
                              className="rounded-circle border"
                              width="32"
                              height="32"
                              style={{ objectFit: 'cover' }}
                            />
                            <span className="fw-semibold small">{user.name}</span>
                          </div>
                        </td>
                        <td className="small text-secondary">{user.email}</td>
                        <td className="small text-secondary">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AdminDashboard;