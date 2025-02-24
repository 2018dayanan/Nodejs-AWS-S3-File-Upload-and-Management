const express = require("express");
const upload = require("./config/uploadConfig");

const app = express();
const port = 3000;

// Single File Upload
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

// Multiple File Upload
app.post("/multiple-image", (req, res) => {
  const uploadMultiple = upload.array("images", 10);

  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "File upload failed",
        error: err.message,
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
