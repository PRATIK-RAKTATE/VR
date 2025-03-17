const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
    },
    data: {
      type: Buffer, // Store the binary image data
    },
    contentType: {
      type: String, // Store the image MIME type (e.g., "image/png", "image/jpeg")
    },
    eventName: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const ImageModel = mongoose.model("images", imageSchema);

module.exports = { ImageModel };
