const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const initGridFS = (conn) => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
};

const uploadImage = (req, res) => {
  if (req.file) {
    res.json({ file: req.file });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
};

const getImage = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
};

module.exports = {
  initGridFS,
  uploadImage,
  getImage,
};