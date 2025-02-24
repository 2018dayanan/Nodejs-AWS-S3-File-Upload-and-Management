const express = require("express");
require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

const app = express();
const port = 3000;

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "learn-video-upload-25",
    key: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const random = Math.round(Math.random() * 10000);
      const uniqueName = `uploads/inksvilla-image-${Date.now()}-${random}${extension}`;
      cb(null, uniqueName);
    },
  }),
});

// Single file upload
app.post("/upload-image", (req, res) => {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "File upload failed",
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Image uploaded successfully!",
      imageUrl: req.file.location,
    });
  });
});

// Multiple file uploads
app.post("/multiple-image", (req, res) => {
  const uploadMultiple = upload.array("image", 10);

  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "File upload failed",
        error: err,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No files uploaded",
      });
    }

    const imageUrls = req.files.map((file) => file.location);
    return res.status(201).json({
      status: true,
      message: "Images uploaded successfully!",
      imageUrls,
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
