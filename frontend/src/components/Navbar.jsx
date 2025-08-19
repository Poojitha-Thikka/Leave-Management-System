import { Link } from 'react-router-dom';

import React from 'react';
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
          <>
            <li><Link to="/" className="hover:text-gray-300">Login</Link></li>
            <li><Link to="/signup" className="hover:text-gray-300">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;