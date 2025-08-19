import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('ProtectedRoute - Token:', token);
    console.log('ProtectedRoute - Role from localStorage:', role, 'Type:', typeof role);
    console.log('ProtectedRoute - Required Role:', requiredRole, 'Type:', typeof requiredRole);
    console.log('ProtectedRoute - Role === Required Role:', role === requiredRole);

    if (!token) {
        // User not authenticated, redirect to login page
        return <Navigate to="/" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        // User authenticated but not authorized for this role, redirect to dashboard
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;