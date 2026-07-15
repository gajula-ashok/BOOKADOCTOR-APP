import { createContext, useContext, useState } from "react";
import axios from "axios";

const AppContext = createContext();

const API = axios.create({
  baseURL: "https://bookadoctor-app-5.onrender.com/api" // <- deployed url
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/user/login", { email, password });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };
  const register = async (formData) => {
    try {
      setLoading(true);
      const { data } = await API.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" } // important for file upload
      });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AppContext.Provider value={{ login, logout, user, token, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);