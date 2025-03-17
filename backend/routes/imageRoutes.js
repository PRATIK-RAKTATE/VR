const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { uploadImage, getImage } = require('../controllers/imageController');

const MONGO_URI = process.env.MONGO_URI;
const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads',
    };
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), uploadImage);
router.get('/image/:filename', getImage);

module.exports = router;