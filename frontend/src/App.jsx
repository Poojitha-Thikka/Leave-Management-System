import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
