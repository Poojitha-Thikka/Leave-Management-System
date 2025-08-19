import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/EmployeeManagement.css';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees.');
      setEmployees([]);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/leave-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to fetch leave requests.');
      setLeaveRequests([]);
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = status === 'Approved' ? 'approve-leave' : 'reject-leave';
      const response = await axios.patch(
        `http://localhost:5000/${endpoint}/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setError('');
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      console.error(`Error ${status.toLowerCase()} leave request:`, err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(`Failed to ${status.toLowerCase()} leave request.`);
      }
      setMessage('');
    }
  };

  return (
    <div className="employee-management">
      <section className="employee-list-section">
        <h2>Employee List</h2>
        {error && <div className="message error">{error}</div>}
        {message && <div className="message success">{message}</div>}
        {employees.length === 0 ? (
          <p className="no-employees-message">No employees found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className={employee.status === 'Pending' ? 'status-pending' : ''}>
                    <td data-label="Name">{employee.name}</td>
                    <td data-label="Email">{employee.email}</td>
                    <td data-label="Department">{employee.department}</td>
                    <td data-label="Actions">
                      <button onClick={() => handleViewDetails(employee)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedEmployee.name}'s Leave Balances</h3>
            <p>Annual Leave: {selectedEmployee.leaveBalances?.annual || 0} days</p>
            <p>Sick Leave: {selectedEmployee.leaveBalances?.sick || 0} days</p>
            <p>Casual Leave: {selectedEmployee.leaveBalances?.casual || 0} days</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      <section className="leave-requests-section">
        <h2>All Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p className="no-requests-message">No leave requests found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id} className={request.status === 'Pending' ? 'status-pending' : ''}>
                    <td data-label="Employee Name">{request.employeeName}</td>
                    <td data-label="Start Date">{new Date(request.startDate).toLocaleDateString()}</td>
                    <td data-label="End Date">{new Date(request.endDate).toLocaleDateString()}</td>
                    <td data-label="Reason">{request.reason}</td>
                    <td className={`status-${request.status.toLowerCase()}`}>{request.status}</td>
                    <td data-label="Actions">
                      {request.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(request.id, 'Approved')}>Approve</button>
                          <button onClick={() => handleStatusUpdate(request.id, 'Rejected')} className="reject">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}