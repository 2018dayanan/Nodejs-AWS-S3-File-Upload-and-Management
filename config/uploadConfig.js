const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
require("dotenv").config();

// Configure S3 Client
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const allowedMimeTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1 * 1024 * 1024;

// Multer configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "learn-video-upload-25",
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const random = Math.round(Math.random() * 10000);
      const uniqueName = `uploads/inksvilla-image-${Date.now()}-${random}${extension}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPG and PNG are allowed."),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
