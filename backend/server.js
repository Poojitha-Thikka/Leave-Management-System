require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { format } = require('date-fns');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET:', JWT_SECRET);

app.use(express.json());
app.use(cors());

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.sendStatus(403); // Invalid token
    }
    req.user = user;
    next();
  });
};

// Middleware to check for Admin role
const authorizeAdmin = (req, res, next) => {

  if (req.user.role !== 'ADMIN') {
    return res.sendStatus(403); // Forbidden
  }
  next();
};

// User Signup
app.post('/signup', async (req, res) => {
  const { name, email, department, joiningDate, password, adminSecretKey } = req.body;
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'default_admin_secret'; // Use a strong secret in .env

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = adminSecretKey === ADMIN_SECRET ? 'ADMIN' : 'EMPLOYEE';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        department,
        joiningDate: new Date(joiningDate),
        passwordHash: hashedPassword,
        role,
      },
    });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password, isAdmin } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If isAdmin is true, ensure the user has the ADMIN role
    if (isAdmin && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Not an admin.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Apply for Leave
app.post('/leave/apply', authenticateToken, async (req, res) => {
  const { startDate, endDate, reason, days, leaveType } = req.body; // Add leaveType here
  try {
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: parseInt(days),
        reason,
        leaveType, // Add leaveType here
      },
    });
    res.status(201).json({ message: 'Leave request submitted', leaveRequest });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({ error: 'Error submitting leave request', details: error.message });
  }
});

// Approve/Reject Leave (Admin only)
app.put('/api/leave-requests/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, decisionNote } = req.body;

  try {
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id: id },
      data: {
        status,
        decisionBy: req.user.id,
        decisionNote,
      },
    });
    res.json({ message: 'Leave request updated', updatedLeaveRequest });
  } catch (error) {
    console.error('Error updating leave request:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Error updating leave request', details: error.message });
  }
});

// Get all leave requests (Admin only)
app.get('/api/leave-requests', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      include: {
        user: {
          select: { name: true },
        },
      },
    });
    const formattedLeaveRequests = leaveRequests.map(request => ({
      ...request,
      employeeName: request.user.name,
      status: request.status.toUpperCase(),
    }));
    res.json(formattedLeaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    console.error('Prisma error details:', error.message); // Add this line for more details
    res.status(500).json({ error: 'Error fetching leave requests', details: error.message });
  }
});

// Get leave requests for the logged-in employee
// Get user data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, department: true, role: true, leaveBalances: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data', details: error.message });
  }
});

// Get upcoming holidays
app.get('/api/holidays/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const holidays = await prisma.holiday.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    res.json(holidays);
  } catch (error) {
    console.error('Error fetching upcoming holidays:', error);
    res.status(500).json({ error: 'Error fetching upcoming holidays', details: error.message });
  }
});

// Get company announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching company announcements:', error);
    res.status(500).json({ error: 'Error fetching company announcements', details: error.message });
  }
});

app.get('/api/leave-requests/my-requests', authenticateToken, async (req, res) => {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching employee leave requests:', error);
    res.status(500).json({ error: 'Error fetching employee leave requests', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Leave Management System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});