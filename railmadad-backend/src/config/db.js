const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'railmadad',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mobile_number VARCHAR(20),
      email VARCHAR(100),
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
      email VARCHAR(100),
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

  if (!existing.has('email')) {
    await query("ALTER TABLE complaints ADD COLUMN email VARCHAR(100) NULL AFTER mobile_number");
  }
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
  if (!existing.has('priority')) {
    await query("ALTER TABLE complaints ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium'");
  }
}

module.exports = { db, query, ensureSchema };
