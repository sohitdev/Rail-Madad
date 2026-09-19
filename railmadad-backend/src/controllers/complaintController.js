const { query } = require('../config/db');
const { classifyComplaint } = require('../utils/classifier');
const { sendOTP } = require('../utils/mailer');

const otpStore = new Map();

function toSqlDate(input) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function validateComplaintPayload(payload) {
  const mobile = String(payload.mobile_number || '').trim();
  const email = String(payload.email || '').trim();
  const otp = String(payload.otp || '').trim();
  const pnr = String(payload.pnr_number || '').trim();
  const description = String(payload.description || '').trim();

  if (!/^\d{10}$/.test(mobile)) return 'Mobile number must be 10 digits';
  if (!email || !/\S+@\S+\.\S+/.test(email)) return 'Valid email is required';
  if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
  if (pnr && !/^\d{10}$/.test(pnr)) return 'PNR number must be 10 digits';
  if (description.length < 10) return 'Description should be at least 10 characters';

  return null;
}

exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  // Expire OTP after 10 mins
  setTimeout(() => otpStore.delete(email), 10 * 60 * 1000);

  const sent = await sendOTP(email, otp);
  if (sent) {
    res.json({ success: true, message: 'OTP sent successfully to email' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send OTP. Check SMTP settings.' });
  }
};

exports.submitComplaint = async (req, res) => {
  try {
    const validationError = validateComplaintPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const {
      mobile_number,
      email,
      otp,
      pnr_number,
      recent_station,
      incident_date,
      description
    } = req.body;

    // Verify OTP
    const storedOtp = otpStore.get(email);
    if (storedOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    // Delete OTP after successful use
    otpStore.delete(email);

    const classification = await classifyComplaint(description);
    const file_path = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO complaints
      (mobile_number, email, otp, pnr_number, recent_station, incident_date, file_path, description, status, department, priority, classification_confidence, classification_reason, classification_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      String(mobile_number).trim(),
      String(email).trim(),
      String(otp).trim(),
      String(pnr_number || '').trim() || null,
      String(recent_station || '').trim() || null,
      toSqlDate(incident_date),
      file_path,
      String(description).trim(),
      classification.department,
      classification.priority,
      classification.confidence,
      classification.reason,
      classification.method
    ]);

    req.app.get('io').emit('new_complaint', {
      id: result.insertId,
      department: classification.department,
      priority: classification.priority,
      status: 'Pending'
    });

    res.json({
      success: true,
      message: 'Complaint submitted successfully',
      complaintId: result.insertId,
      classification: {
        department: classification.department,
        priority: classification.priority,
        confidence: classification.confidence,
        method: classification.method
      }
    });
  } catch (err) {
    console.error('Error saving complaint:', err);
    res.status(500).json({ success: false, message: 'Database error while submitting complaint' });
  }
};

exports.trackComplaint = async (req, res) => {
  try {
    const mobile = String(req.query.mobile_number || '').trim();
    const pnr = String(req.query.pnr_number || '').trim();

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number is required' });
    }
    if (pnr && !/^\d{10}$/.test(pnr)) {
      return res.status(400).json({ success: false, message: 'PNR must be 10 digits when provided' });
    }

    let sql = 'SELECT * FROM complaints WHERE mobile_number = ?';
    const params = [mobile];

    if (pnr) {
      sql += ' AND pnr_number = ?';
      params.push(pnr);
    }

    sql += ' ORDER BY created_at DESC LIMIT 1';

    const rows = await query(sql, params);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'No complaint found for provided details' });
    }

    const c = rows[0];
    res.json({
      success: true,
      data: [{
        id: c.id,
        status: c.status,
        department: c.department || 'General',
        priority: c.priority || 'Medium',
        remark: c.remark || '',
        description: c.description || '',
        file_path: c.file_path || null,
        created_at: c.created_at,
        recent_station: c.recent_station || null
      }]
    });
  } catch (err) {
    console.error('Error tracking complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to track complaint' });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const mobile = String(req.body.mobile || '').trim();
    const otp = String(req.body.otp || '').trim();
    const pnr = String(req.body.pnr || '').trim();
    const rating = Number(req.body.rating);
    const feedbackText = String(req.body.feedbackText || '').trim();

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be 10 digits' });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'OTP must be 6 digits' });
    }
    if (pnr && !/^\d{10}$/.test(pnr)) {
      return res.status(400).json({ success: false, message: 'PNR must be 10 digits when provided' });
    }
    if (!feedbackText) {
      return res.status(400).json({ success: false, message: 'Feedback text is required' });
    }

    await query(
      `INSERT INTO feedback (mobile_number, otp, pnr_number, rating, message) VALUES (?, ?, ?, ?, ?)`,
      [mobile, otp, pnr || null, Number.isFinite(rating) ? rating : null, feedbackText]
    );

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback insert error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};
