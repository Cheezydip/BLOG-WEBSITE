const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ message: 'Admin credentials not configured on server.' });
  }

  // Check email
  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Compare passwords — support both plain-text (dev) and bcrypt hashes
  let passwordMatch = false;
  if (adminPassword.startsWith('$2')) {
    // bcrypt hash
    passwordMatch = await bcrypt.compare(password, adminPassword);
  } else {
    // plain-text comparison (dev convenience)
    passwordMatch = password === adminPassword;
  }

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { email: adminEmail, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    admin: { email: adminEmail, role: 'admin' }
  });
});

// GET /api/auth/me — verify token and return admin info
router.get('/me', verifyToken, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
