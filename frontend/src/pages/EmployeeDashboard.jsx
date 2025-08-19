import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSignOutAlt, faUserCircle, faBell, faCalendarAlt, faSun, faMoon, faInfoCircle, faQuestionCircle, faCog, faChartBar, faTasks, faEnvelope, faUsers, faClipboardList, faFileAlt, faPlusCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [companyAnnouncements, setCompanyAnnouncements] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchLeaveRequests();
    fetchUpcomingHolidays();
    fetchCompanyAnnouncements();
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.parse(isDarkMode));
  }, [isDarkMode]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please login again.');
      navigate('/login');
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/leave-requests/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to fetch leave requests.');
    }
  };

  const fetchUpcomingHolidays = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/holidays/upcoming');
      setUpcomingHolidays(response.data);
    } catch (error) {
      console.error('Error fetching upcoming holidays:', error);
      toast.error('Failed to fetch upcoming holidays.');
    }
  };

  const fetchCompanyAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements');
      setCompanyAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching company announcements:', error);
      toast.error('Failed to fetch company announcements.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading dashboard...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 flex justify-between items-center`}>
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-xl" />
          </button>
          <FontAwesomeIcon icon={faBell} className="text-xl cursor-pointer" />
          <div className="relative">
            <FontAwesomeIcon icon={faUserCircle} className="text-xl cursor-pointer" />
            <span className="ml-2 font-medium">{user.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Leave Summary Card */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FontAwesomeIcon icon={faClipboardList} className="mr-3 text-blue-500" />Leave Summary</h2>
          <p>Annual Leave: <span className="font-bold">{user.leaveBalances?.annual || 0} days</span></p>
          <p>Sick Leave: <span className="font-bold">{user.leaveBalances?.sick || 0} days</span></p>
          <p>Casual Leave: <span className="font-bold">{user.leaveBalances?.casual || 0} days</span></p>
          <Link to="/apply-leave" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors">
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />Apply for Leave
          </Link>
        </div>

        {/* Upcoming Holidays Card */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-green-500" />Upcoming Holidays</h2>
          {upcomingHolidays.length > 0 ? (
            <ul className="list-disc pl-5">
              {upcomingHolidays.map((holiday) => (
                <li key={holiday._id} className="mb-2">
                  <span className="font-medium">{holiday.name}</span>: {new Date(holiday.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming holidays.</p>
          )}
        </div>

        {/* Company Announcements Card */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FontAwesomeIcon icon={faEnvelope} className="mr-3 text-purple-500" />Company Announcements</h2>
          {companyAnnouncements.length > 0 ? (
            <ul className="list-disc pl-5">
              {companyAnnouncements.map((announcement) => (
                <li key={announcement._id} className="mb-2">
                  <span className="font-medium">{announcement.title}</span>: {announcement.content.substring(0, 70)}...
                  <Link to={`/announcement/${announcement._id}`} className="text-blue-500 hover:underline ml-2">
                    <FontAwesomeIcon icon={faEye} className="mr-1" />Read More
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent announcements.</p>
          )}
        </div>

        {/* My Leave Requests Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 lg:col-span-3`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FontAwesomeIcon icon={faTasks} className="mr-3 text-orange-500" />My Leave Requests</h2>
          {leaveRequests.length === 0 ? (
            <p>You have no leave requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Type</th>
                    <th className="py-3 px-6 text-left">Start Date</th>
                    <th className="py-3 px-6 text-left">End Date</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Reason</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                  {leaveRequests.map((request) => (
                    <tr key={request._id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{request.leaveType}</td>
                      <td className="py-3 px-6 text-left">{new Date(request.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-left">{new Date(request.endDate).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`py-1 px-3 rounded-full text-xs ${request.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : request.status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">{request.reason}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <Link to={`/edit-leave/${request._id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <button
                            onClick={() => {
                              // Implement delete functionality
                              toast.info('Delete functionality coming soon!');
                            }}
                            className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 text-center text-gray-600 dark:text-gray-300`}>
        <p>&copy; 2023 Leave Management System. All rights reserved.</p>
      </footer>
    </div>
  );
} 

export default EmployeeDashboard;