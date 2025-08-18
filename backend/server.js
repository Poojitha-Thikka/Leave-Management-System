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

app.use(express.json());
app.use(cors());

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
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
  const { name, email, department, joiningDate, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        department,
        joiningDate: new Date(joiningDate),
        passwordHash: hashedPassword,
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
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
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
  const { startDate, endDate, reason, days } = req.body;
  try {
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: parseInt(days),
        reason,
      },
    });
    res.status(201).json({ message: 'Leave request submitted', leaveRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting leave request' });
  }
});

// Approve/Reject Leave (Admin only)
app.put('/leave/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, decisionNote } = req.body;
  try {
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        decisionBy: req.user.id,
        decisionNote,
      },
    });
    res.json({ message: 'Leave request updated', updatedLeaveRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating leave request' });
  }
});

app.get('/', (req, res) => {
  res.send('Leave Management System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});