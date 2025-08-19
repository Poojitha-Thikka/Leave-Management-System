import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [password, setPassword] = useState('');
    const [adminSecretKey, setAdminSecretKey] = useState(''); // New state for admin secret key
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', {
                name,
                email,
                department,
                joiningDate,
                password,
                adminSecretKey, // Include adminSecretKey in the request
            });
            setMessage(response.data.message);
            setError('');
            if (response.status === 201) {
                navigate('/login'); // Redirect to login page after successful signup
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed');
            setMessage('');
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department:</label>
                    <input
                        type="text"
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="joiningDate">Joining Date:</label>
                    <input
                        type="date"
                        id="joiningDate"
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="adminSecretKey">Admin Secret Key (Optional):</label>
                    <input
                        type="password"
                        id="adminSecretKey"
                        value={adminSecretKey}
                        onChange={(e) => setAdminSecretKey(e.target.value)}
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
        </div>
    );
};

export default Signup;