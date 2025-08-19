import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/ApplyLeave.css';

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit function entered');
    console.log('handleSubmit called');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Error: No authentication token found. Please log in.');
        return;
      }
      console.log('Token found:', token);

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
      console.log('Calculated days:', diffDays);
      console.log('Sending request with data:', { startDate, endDate, reason, days: diffDays, leaveType });
      debugger; // Add debugger here
      const response = await axios.post('http://localhost:5000/leave/apply', {
        startDate,
        endDate,
        reason,
        days: diffDays,
        leaveType,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Axios response:', response);
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      console.error('Error applying for leave:', error);
      console.log('Error response:', error.response);
      setError(error.response?.data?.message || 'Failed to apply for leave.');
      setMessage('');
    }
  };

  return (
    <div className="apply-leave">
      <h1>Apply for Leave</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type:</label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value.toUpperCase())}
            required
          >
            <option value="">Select Leave Type</option>
            <option value="ANNUAL">Annual Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="CASUAL">Casual Leave</option>
            <option value="MATERNITY">Maternity Leave</option>
            <option value="PATERNITY">Paternity Leave</option>
            <option value="BEREAVEMENT">Bereavement Leave</option>
            <option value="SABBATICAL">Sabbatical Leave</option>
            <option value="UNPAID">Unpaid Leave</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit">Submit Leave Request</button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};