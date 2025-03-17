const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const { ImageModel } = require("./models/image.models");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static images

// ✅ Configure Multer to store files in 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ Upload Image Endpoint (Now storing images in 'uploads/' folder)
app.post("/single", upload.single("eventImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { eventName, location } = req.body;

    // ✅ Save image details in DB (only filename & path, not binary data)
    const image = new ImageModel({
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`, // Store path instead of binary data
      contentType: req.file.mimetype,
      eventName,
      location,
    });

    await image.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      filePath: `http://localhost:8080/uploads/${req.file.filename}`,
    });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: "Unable to upload image" });
  }
});

// ✅ Fetch Images (Get images from DB instead of just folder)
app.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find(
      {},
      "filename filepath eventName location"
    );

    const imageList = images.map((img) => ({
      filename: img.filename,
      url: `http://localhost:8080/uploads/${img.filename}`, // Public image URL
      eventName: img.eventName || "Unknown Event", // Default if missing
      location: img.location || "Unknown Location", // Default if missing
    }));

    res.json(imageList);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Unable to fetch images" });
  }
});

// ✅ Start Server & Connect to MongoDB
app.listen(8080, async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rohit11:rohit123@cluster0.mzy8f.mongodb.net/UploadImage"
    );
    console.log("Database is connected!");
    console.log("Server is running on port 8080");
  } catch (e) {
    console.log("Database connection error:", e);
  }
});
