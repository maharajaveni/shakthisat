require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const { initDb, run, get, all } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb()
  .then(() => {
    console.log('Database initialized successfully.');
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
  });

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Superadmin authorization middleware
function authorizeSuperadmin(req, res, next) {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Superadmin access required' });
  }
}

// 1. Submit registration
app.post('/api/submissions', async (req, res) => {
  try {
    const { fullName, email, phone, shakthiResponse } = req.body;

    // Validate inputs
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Simple phone regex validation (supports international formats)
    const phoneRegex = /^[+0-9\s-]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number' });
    }

    if (!shakthiResponse || typeof shakthiResponse !== 'string' || shakthiResponse.trim() === '') {
      return res.status(400).json({ success: false, message: 'Response is required' });
    }

    const trimmedResponse = shakthiResponse.trim();
    const words = trimmedResponse.split(/\s+/);
    if (words.length > 2) {
      return res.status(400).json({ success: false, message: 'Response must be at most two words' });
    }

    const timestamp = new Date().toISOString();

    const result = await run(
      'INSERT INTO submissions (fullName, email, phone, shakthiResponse, createdAt) VALUES (?, ?, ?, ?, ?)',
      [fullName.trim(), email.trim().toLowerCase(), phone.trim(), trimmedResponse, timestamp]
    );

    res.status(201).json({
      success: true,
      submission: {
        id: result.lastID,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        shakthiResponse: trimmedResponse,
        createdAt: timestamp
      }
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 2. Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const admin = await get('SELECT * FROM admins WHERE username = ?', [username.trim()]);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 3. Get Submissions (Protected Admin route)
app.get('/api/admin/submissions', authenticateToken, async (req, res) => {
  try {
    const { search, startDate, endDate, limit, offset } = req.query;

    let query = 'SELECT * FROM submissions WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM submissions WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      const searchPattern = `%${search}%`;
      query += ' AND (fullName LIKE ? OR email LIKE ? OR phone LIKE ? OR shakthiResponse LIKE ?)';
      countQuery += ' AND (fullName LIKE ? OR email LIKE ? OR phone LIKE ? OR shakthiResponse LIKE ?)';
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (startDate) {
      query += ' AND createdAt >= ?';
      countQuery += ' AND createdAt >= ?';
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      const adjustedEndDate = endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`;
      query += ' AND createdAt <= ?';
      countQuery += ' AND createdAt <= ?';
      params.push(adjustedEndDate);
      countParams.push(adjustedEndDate);
    }

    // Sorting by date descending by default
    query += ' ORDER BY createdAt DESC';

    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    if (!isNaN(parsedLimit)) {
      query += ' LIMIT ?';
      params.push(parsedLimit);
      if (!isNaN(parsedOffset)) {
        query += ' OFFSET ?';
        params.push(parsedOffset);
      }
    }

    const data = await all(query, params);
    const countResult = await get(countQuery, countParams);

    res.json({
      success: true,
      submissions: data,
      totalCount: countResult ? countResult.total : 0
    });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 3b. Clear all submissions (Superadmin only)
app.post('/api/admin/submissions/clear', authenticateToken, authorizeSuperadmin, async (req, res) => {
  try {
    await run('DELETE FROM submissions');
    await run("DELETE FROM sqlite_sequence WHERE name='submissions'");
    res.json({
      success: true,
      message: 'All participant registrations cleared successfully.'
    });
  } catch (error) {
    console.error('Error clearing submissions:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 4. Create Admin Account (Superadmin only)
app.post('/api/admin/users', authenticateToken, authorizeSuperadmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields (username, password, role) are required' });
    }

    if (role !== 'admin' && role !== 'superadmin') {
      return res.status(400).json({ success: false, message: 'Role must be admin or superadmin' });
    }

    const existingUser = await get('SELECT * FROM admins WHERE username = ?', [username.trim()]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await run('INSERT INTO admins (username, passwordHash, role) VALUES (?, ?, ?)', [
      username.trim(),
      passwordHash,
      role
    ]);

    res.status(201).json({
      success: true,
      message: `Admin user '${username}' created successfully as ${role}.`
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 5. Get all Admin accounts (Superadmin only)
app.get('/api/admin/users', authenticateToken, authorizeSuperadmin, async (req, res) => {
  try {
    const adminsList = await all('SELECT id, username, role FROM admins ORDER BY id ASC');
    res.json({
      success: true,
      users: adminsList
    });
  } catch (error) {
    console.error('Error retrieving admin users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 6. Delete Admin Account (Superadmin only)
app.delete('/api/admin/users/:id', authenticateToken, authorizeSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if trying to delete self
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const userToDelete = await get('SELECT * FROM admins WHERE id = ?', [id]);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if it's the last superadmin
    if (userToDelete.role === 'superadmin') {
      const superadminsCount = await get('SELECT COUNT(*) as count FROM admins WHERE role = ?', ['superadmin']);
      if (superadminsCount && superadminsCount.count <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the only remaining superadmin' });
      }
    }

    await run('DELETE FROM admins WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Admin account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
