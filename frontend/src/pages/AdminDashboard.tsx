import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css'; // Styles for Admin Dashboard

const AdminDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/leave-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaveRequests(response.data);
      setPendingRequests(response.data.filter(request => request.status === 'PENDING').length);
    } catch (err) {
      setError('Failed to fetch leave requests.');
      console.error('Error fetching leave requests:', err);
      console.log('Axios error response:', err.response);
      console.log('Axios error request:', err.request);
      console.log('Axios error message:', err.message);
    }
  };

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/leave-requests/${id}`, { status, decisionNote: reason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLeaveRequests();
      setMessage(`Leave request ${id} ${status.toLowerCase()}.`);
      setError('');
    } catch (err) {
      setError('Failed to update leave request status.');
      setMessage('');
      console.error('Error updating leave request status:', err);
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filterStatus === 'All') return true;
    return request.status === filterStatus.toUpperCase();
  });

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div className="summary-cards">
        <div className="card">
          <h3>Total Leave Requests</h3>
          <p>{leaveRequests.length}</p>
        </div>
        <div className="card">
          <h3>Pending Requests</h3>
          <p>{pendingRequests}</p>
        </div>
      </div>

      <div className="filter-controls">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="PENDING">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <h2>Leave Requests</h2>
      {filteredRequests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id} className={request.status === 'PENDING' ? 'pending-request' : ''}>
                <td>{request.id}</td>
                <td>{request.employeeName}</td>
                <td>{request.leaveType}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(request.id, 'APPROVED')}>Approve</button>
                      <button 
                        onClick={() => {
                          const reason = prompt('Please enter rejection reason:');
                          if (reason) {
                            handleStatusUpdate(request.id, 'REJECTED', reason);
                          }
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;