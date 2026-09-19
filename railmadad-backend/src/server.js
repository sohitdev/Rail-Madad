const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { db, ensureSchema } = require('./config/db');

// Import routes
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket client connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket client disconnected:', socket.id));
});

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/', complaintRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_req, res) => {
  res.json({ success: true, service: 'railmadad-backend' });
});

app.get('/', (_req, res) => {
  res.send('RailMadad API is running!');
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
      server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (schemaError) {
      console.error('Schema initialization failed:', schemaError);
      process.exit(1);
    }
  });
}

startServer();
