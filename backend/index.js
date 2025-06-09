require('dotenv').config();

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

// Route imports\ nconst userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const { protect, isAdmin } = require("./middleware/authMiddleware");
const { ImageModel } = require("./models/image.models");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount user & admin routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Image upload endpoint (admin only)
app.post(
  "/single",
  protect,
  isAdmin,
  upload.single("eventImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const { eventName, location } = req.body;
      const image = new ImageModel({
        filename: req.file.filename,
        filepath: `/uploads/${req.file.filename}`,
        contentType: req.file.mimetype,
        eventName,
        location,
      });

      await image.save();

      res.status(200).json({
        message: "Image uploaded successfully",
        filePath: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      });
    } catch (e) {
      console.error("Upload error:", e);
      res.status(500).json({ error: "Unable to upload image" });
    }
  }
);

// Fetch images endpoint
app.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find({}, "filename filepath eventName location");
    const imageList = images.map(img => ({
      filename: img.filename,
      url: `${req.protocol}://${req.get('host')}${img.filepath}`,
      eventName: img.eventName || "Unknown Event",
      location: img.location || "Unknown Location",
    }));
    res.json(imageList);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Unable to fetch images" });
  }
});

// Connect to MongoDB and start server
mongoose.connect("mongodb+srv://pratik:45WIi5VlfWOUV9Nc@cluster0.rclew.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database is connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Database connection error:", err));