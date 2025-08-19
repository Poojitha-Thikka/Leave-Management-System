import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import Signup from './pages/Signup.jsx';

import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ApplyLeave from './pages/ApplyLeave.jsx';
import EmployeeManagement from './pages/EmployeeManagement.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    if (userData.role === 'EMPLOYEE') {
      navigate('/employee-dashboard');
    } else if (userData.role === 'ADMIN') {
      navigate('/admin-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <>
      {user && <Navbar isAuthenticated={!!user} user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute requiredRole="EMPLOYEE">
              <EmployeeDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute requiredRole="EMPLOYEE">
              <ApplyLeave user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-management"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <EmployeeManagement user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
