const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());





app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });           

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'railmadad'
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Complaint submission endpoint
app.post('/submit-complaint', upload.single('file'), (req, res) => {
  const {
    mobile_number,
    otp,
    pnr_number,
    recent_station,
    incident_date,
    description
  } = req.body;

  const file_path = req.file ? req.file.filename : null;

  const sql = `INSERT INTO complaints 
      (mobile_number, otp, pnr_number, recent_station, incident_date, file_path, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    mobile_number, otp, pnr_number, recent_station, incident_date, file_path, description
  ], (err, result) => {
    if (err) {
      console.error("Error saving to DB:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Complaint submitted successfully" });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));







// Fetch all complaints for admin panel
app.get('/admin/complaints', (req, res) => {
  const sql = `SELECT * FROM complaints ORDER BY created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching complaints:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch complaints" });
    }

    res.json({ success: true, data: results });
  });
});


//feedback
app.post('/submit-feedback', (req, res) => {
  const { mobile, otp, pnr, rating, feedbackText } = req.body;

  const sql = `
    INSERT INTO feedback (mobile_number, otp, pnr_number, rating, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [mobile, otp, pnr, rating, feedbackText], (err, result) => {
    if (err) {
      console.error('❌ Feedback insert error:', err);
      return res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
    res.json({ success: true, message: '✅ Feedback submitted successfully!' });
  });
});




// Get summary stats for admin dashboard
app.get('/admin/summary', (req, res) => {
  const sql = `
  SELECT 
    COUNT(*) AS total,
    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS resolved,
    COUNT(CASE WHEN status != 'Resolved' THEN 1 END) AS pending
  FROM complaints
`;


  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching summary:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, ...results[0] });
  });
});


// Update complaint status and remark
app.put('/admin/complaint/:id', (req, res) => {
  const id = req.params.id;
  const { status, remark } = req.body;

  const sql = `UPDATE complaints SET status = ?, remark = ? WHERE id = ?`;

  db.query(sql, [status, remark, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating complaint:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, message: "✅ Complaint updated successfully" });
  });
});

