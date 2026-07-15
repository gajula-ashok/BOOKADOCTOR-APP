import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medicare-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('medicare-token') || '';
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  // Setup default headers for Axios when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('medicare-token', token);
      fetchNotifications();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('medicare-token');
      setNotifications([]);
    }
  }, [token]);
  useEffect(() => {
    if (user) {
      localStorage.setItem('medicare-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medicare-user');
    }
  }, [user]);
  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setToken(response.data.token);
      console.log(response.data);
      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        age: response.data.age,
        gender: response.data.gender,
        address: response.data.address,
        profilePhoto: response.data.profilePhoto,
        role: response.data.role
      });
      console.log("Login Success",response.data)
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };
  // Register handler
  const register = async (formData) => {
    setLoading(true);
    try {
      // formData is a FormData object due to file upload
      const response = await axios.post('/api/auth/login', { email, password });

      const response = await axios.post('/api/auth/login', { email, password });

      setToken(response.data.token);

      const userData = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        age: response.data.age,
        gender: response.data.gender,
        address: response.data.address,
        profilePhoto: response.data.profilePhoto,
        role: response.data.role
      };

      setUser(userData);

      // Save login data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };
  // Logout handler
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('medicare-token');
    localStorage.removeItem('medicare-user');
  };
  // Load Profile
  const loadProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/auth/profile');
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  };
  // Update Profile
  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.put('/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.token) {
        setToken(response.data.token);
      }
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    } finally {
      setLoading(false);
    }
  };
  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  // Mark all notifications read
  const markNotificationsRead = async () => {
    if (!token) return;
    try {
      await axios.put('/api/notifications/read');
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking notifications read:', error);
    }
  };
  // Mark single notification read
  const markSingleNotificationRead = async (id) => {
    if (!token) return;
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        notifications,
        unreadCount,
        login,
        register,
        logout,
        loadProfile,
        updateProfile,
        fetchNotifications,
        markNotificationsRead,
        markSingleNotificationRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
