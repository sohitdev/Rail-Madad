const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const DEPARTMENTS = [
  'Cleanliness and Hygiene Department',
  'Catering and On-Board Services',
  'Security',
  'Ticketing and Reservations',
  'Punctuality and Train Reservations',
  'Customer Services and Grievances',
  'Staff Behaviour',
  'Luggage and Parcels',
  'Station Facilities',
  'Medical and Emergency',
  'Technical Support',
  'Environmental and Safety Compliance',
  'General'
];

const ALLOWED_STATUS = ['Pending', 'In Progress', 'Resolved'];

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname || '')}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'railmadad'
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function normalizeDepartment(department) {
  if (!department) return null;
  const exactMatch = DEPARTMENTS.find((d) => d.toLowerCase() === String(department).toLowerCase());
  return exactMatch || null;
}

function keywordClassify(description = '') {
  const text = String(description).toLowerCase();

  if (/dirty|toilet|washroom|clean|hygiene|garbage/.test(text)) return 'Cleanliness and Hygiene Department';
  if (/food|meal|cater|water bottle|vendor/.test(text)) return 'Catering and On-Board Services';
  if (/steal|theft|fight|harass|security|police/.test(text)) return 'Security';
  if (/ticket|reservation|booking|refund|waitlist/.test(text)) return 'Ticketing and Reservations';
  if (/late|delay|punctual|reschedule/.test(text)) return 'Punctuality and Train Reservations';
  if (/staff|rude|behavior|behaviour|misconduct/.test(text)) return 'Staff Behaviour';
  if (/luggage|parcel|bag|baggage/.test(text)) return 'Luggage and Parcels';
  if (/platform|station|escalator|lift|announcement/.test(text)) return 'Station Facilities';
  if (/medical|injury|emergency|doctor|ambulance/.test(text)) return 'Medical and Emergency';
  if (/app|website|server|technical|error|bug/.test(text)) return 'Technical Support';
  if (/smoke|fire|safety|pollution|environment/.test(text)) return 'Environmental and Safety Compliance';

  return 'Customer Services and Grievances';
}

function extractJson(rawText = '') {
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function classifyComplaint(description) {
  const fallbackDepartment = keywordClassify(description);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      department: fallbackDepartment,
      confidence: 0.45,
      reason: 'Keyword fallback (Gemini key not configured)',
      method: 'keyword'
    };
  }

  const prompt = [
    'Classify the railway complaint into exactly one department from this list:',
    DEPARTMENTS.join(' | '),
    '',
    `Complaint: ${description}`,
    '',
    'Return ONLY JSON in this shape:',
    '{"department":"...","confidence":0.0,"reason":"..."}'
  ].join('\n');

  try {
    const modelCandidates = ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-flash-lite-latest'];
    let lastError = null;

    for (const model of modelCandidates) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        lastError = new Error(`Gemini API error: ${response.status} (${model})`);
        continue;
      }

      const data = await response.json();
      const outputText =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

      const parsed = extractJson(outputText) || {};
      const department = normalizeDepartment(parsed.department) || fallbackDepartment;
      const confidence = Number(parsed.confidence);

      return {
        department,
        confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0.7,
        reason: parsed.reason
          ? String(parsed.reason).slice(0, 255)
          : `Gemini classification (${model})`,
        method: 'gemini'
      };
    }

    throw lastError || new Error('Gemini API did not return a usable response');
  } catch (error) {
    console.error('Classification fallback used:', error.message);
    return {
      department: fallbackDepartment,
      confidence: 0.5,
      reason: `Keyword fallback (${error.message})`,
      method: 'keyword'
    };
  }
}

function toSqlDate(input) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mobile_number VARCHAR(20),
      otp VARCHAR(10),
      pnr_number VARCHAR(20),
      recent_station VARCHAR(100),
      incident_date DATE,
      file_path VARCHAR(255),
      description TEXT,
      status VARCHAR(20) DEFAULT 'Pending',
      remark TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mobile_number VARCHAR(20),
      otp VARCHAR(10),
      pnr_number VARCHAR(20),
      rating INT,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const complaintColumns = await query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'complaints'
  `);

  const existing = new Set(complaintColumns.map((row) => row.COLUMN_NAME));

  if (!existing.has('department')) {
    await query("ALTER TABLE complaints ADD COLUMN department VARCHAR(100) DEFAULT 'General'");
  }
  if (!existing.has('classification_confidence')) {
    await query('ALTER TABLE complaints ADD COLUMN classification_confidence DECIMAL(4,3) NULL');
  }
  if (!existing.has('classification_reason')) {
    await query('ALTER TABLE complaints ADD COLUMN classification_reason VARCHAR(255) NULL');
  }
  if (!existing.has('classification_method')) {
    await query("ALTER TABLE complaints ADD COLUMN classification_method VARCHAR(20) DEFAULT 'keyword'");
  }
}

function validateComplaintPayload(payload) {
  const mobile = String(payload.mobile_number || '').trim();
  const otp = String(payload.otp || '').trim();
  const pnr = String(payload.pnr_number || '').trim();
  const description = String(payload.description || '').trim();

  if (!/^\d{10}$/.test(mobile)) return 'Mobile number must be 10 digits';
  if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
  if (pnr && !/^\d{10}$/.test(pnr)) return 'PNR number must be 10 digits';
  if (description.length < 10) return 'Description should be at least 10 characters';

  return null;
}

app.post('/submit-complaint', upload.single('file'), async (req, res) => {
  try {
    const validationError = validateComplaintPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const {
      mobile_number,
      otp,
      pnr_number,
      recent_station,
      incident_date,
      description
    } = req.body;

    const classification = await classifyComplaint(description);
    const file_path = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO complaints
      (mobile_number, otp, pnr_number, recent_station, incident_date, file_path, description, status, department, classification_confidence, classification_reason, classification_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      String(mobile_number).trim(),
      String(otp).trim(),
      String(pnr_number || '').trim() || null,
      String(recent_station || '').trim() || null,
      toSqlDate(incident_date),
      file_path,
      String(description).trim(),
      classification.department,
      classification.confidence,
      classification.reason,
      classification.method
    ]);

    res.json({
      success: true,
      message: 'Complaint submitted successfully',
      complaintId: result.insertId,
      classification: {
        department: classification.department,
        confidence: classification.confidence,
        method: classification.method
      }
    });
  } catch (err) {
    console.error('Error saving complaint:', err);
    res.status(500).json({ success: false, message: 'Database error while submitting complaint' });
  }
});

app.get('/track-complaint', async (req, res) => {
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
      data: {
        id: c.id,
        status: c.status,
        department: c.department || 'General',
        remark: c.remark || '',
        description: c.description || '',
        created_at: c.created_at
      }
    });
  } catch (err) {
    console.error('Error tracking complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to track complaint' });
  }
});

app.get('/admin/complaints', async (req, res) => {
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
});

app.post('/submit-feedback', async (req, res) => {
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
});

app.get('/admin/summary', async (_req, res) => {
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
});

app.put('/admin/complaint/:id', async (req, res) => {
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

    res.json({ success: true, message: 'Complaint updated successfully' });
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to update complaint' });
  }
});

app.get('/meta/departments', (_req, res) => {
  res.json({ success: true, data: DEPARTMENTS });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, service: 'railmadad-backend' });
});

async function startServer() {
  db.connect(async (err) => {
    if (err) {
      console.error('MySQL connection failed:', err);
      process.exit(1);
    }

    try {
      await ensureSchema();
      console.log('MySQL Connected and schema ready');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (schemaError) {
      console.error('Schema initialization failed:', schemaError);
      process.exit(1);
    }
  });
}

startServer();
