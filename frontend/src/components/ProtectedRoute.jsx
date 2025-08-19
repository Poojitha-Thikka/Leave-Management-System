import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        // User not authenticated, redirect to login page
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // User authenticated but not authorized for this role, redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;