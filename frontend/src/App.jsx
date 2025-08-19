import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import ApplyLeave from './pages/ApplyLeave';

const Navbar = ({ isAuthenticated, isAdmin, onLogout }) => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard" className="hover:text-gray-300">Employee Dashboard</Link></li>
            <li><Link to="/apply-leave" className="hover:text-gray-300">Apply Leave</Link></li>
            {isAdmin && (
              <>
                <li><Link to="/admin-dashboard" className="hover:text-gray-300">Admin Dashboard</Link></li>
                <li><Link to="/employee-management" className="hover:text-gray-300">Employee Management</Link></li>
              </>
            )}
            <li><button onClick={onLogout} className="hover:text-gray-300">Logout</button></li>
          </>
        ) : (
          <li><Link to="/" className="hover:text-gray-300">Login</Link></li>
          <li><Link to="/signup" className="hover:text-gray-300">Sign Up</Link></li>
        )}
      </ul>
    </nav>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      if (role === 'admin') {
        setIsAdmin(true);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/apply-leave" element={<ApplyLeave />} />
            {isAdmin && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/employee-management" element={<EmployeeManagement />} />
              </>
            )}
          </>
        ) : (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </>
  );
}

export default App;
