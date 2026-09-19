const { query } = require('../config/db');
const { ALLOWED_STATUS, DEPARTMENTS } = require('../config/constants');
const { sendStatusUpdate } = require('../utils/mailer');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '12h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const department = String(req.query.department || '').trim();
    const status = String(req.query.status || '').trim();

    const whereParts = [];
    const params = [];

    if (department) {
      whereParts.push('department = ?');
      params.push(department);
    }
    if (status) {
      whereParts.push('status = ?');
      params.push(status);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';
    const sql = `SELECT * FROM complaints ${whereClause} ORDER BY created_at DESC`;

    const results = await query(sql, params);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
  }
};

exports.getSummary = async (_req, res) => {
  try {
    const [row] = await query(`
      SELECT
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS resolved,
        COUNT(CASE WHEN status != 'Resolved' THEN 1 END) AS pending
      FROM complaints
    `);

    res.json({ success: true, ...row });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status || '').trim();
    const remark = String(req.body.remark || '').trim();

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid complaint id' });
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const result = await query('UPDATE complaints SET status = ?, remark = ? WHERE id = ?', [status, remark || null, id]);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Fetch the updated complaint to get the email address
    const [updatedComplaint] = await query('SELECT * FROM complaints WHERE id = ?', [id]);
    if (updatedComplaint && updatedComplaint.email) {
      await sendStatusUpdate(updatedComplaint.email, id, status, remark);
    }

    req.app.get('io').emit('complaint_updated', { id, status, remark });

    res.json({ success: true, message: 'Complaint updated successfully' });
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to update complaint' });
  }
};

exports.getDepartments = (_req, res) => {
  res.json({ success: true, data: DEPARTMENTS });
};
