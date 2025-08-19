import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    joiningDate: ''
  });

  const departments = ['HR', 'IT', 'Finance', 'Operations', 'Marketing'];

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/employees');
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.joiningDate) {
      setError('All fields are required');
      return;
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      setError('Please enter a valid email');
      return;
    }
    
    try {
      const response = await axios.post('/add-employee', newEmployee);
      setEmployees([...employees, response.data]);
      setSuccess('Employee added successfully');
      setError('');
      setNewEmployee({
        name: '',
        email: '',
        department: '',
        joiningDate: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
      setSuccess('');
    }
  };

  // Fetch leave balance for selected employee
  const fetchLeaveBalance = async (employeeId) => {
    try {
      const response = await axios.get(`/leave-balance/${employeeId}`);
      setLeaveBalance(response.data);
      setError('');
    } catch (err) {
      setLeaveBalance(null);
      setError('Employee not found or error fetching leave balance');
    }
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>
      
      {/* Add Employee Form */}
      <div className="add-employee-form">
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={newEmployee.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={newEmployee.email} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div>
            <label>Department:</label>
            <select 
              name="department" 
              value={newEmployee.department} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label>Joining Date:</label>
            <input 
              type="date" 
              name="joiningDate" 
              value={newEmployee.joiningDate} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <button type="submit">Add Employee</button>
        </form>
        
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
      
      {/* Employees List */}
      <div className="employees-list">
        <h3>Employees</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Leave Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                <td>{employee.leaveBalance || 'N/A'}</td>
                <td>
                  <button onClick={() => {
                    setSelectedEmployee(employee.id);
                    fetchLeaveBalance(employee.id);
                  }}>
                    View Leave Balance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Leave Balance Section */}
      {selectedEmployee && (
        <div className="leave-balance">
          <h3>Leave Balance Details</h3>
          {leaveBalance ? (
            <div>
              <p>Employee: {employees.find(e => e.id === selectedEmployee)?.name}</p>
              <p>Available Leave Days: {leaveBalance.availableDays}</p>
              <p>Used Leave Days: {leaveBalance.usedDays}</p>
            </div>
          ) : (
            <p>Loading leave balance...</p>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;