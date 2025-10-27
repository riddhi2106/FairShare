// backend/server.js
// Entry point: sets up Express app, connects to MongoDB, and mounts routes.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const groupRoutes = require('./routes/groupRoutes');
app.use('/api/groups', groupRoutes);

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/fairshare';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
