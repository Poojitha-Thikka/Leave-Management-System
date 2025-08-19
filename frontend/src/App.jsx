import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import EmployeeManagement from './pages/EmployeeManagement.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
