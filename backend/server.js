const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cors = require('cors');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const imageRoutes = require('./routes/imageRoutes');
const { initGridFS } = require('./controllers/imageController');

const app = express();
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public/app-files')));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', imageRoutes);

app.set("view")

// marzipano files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    initGridFS(conn.connection);
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

connectDB();

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
