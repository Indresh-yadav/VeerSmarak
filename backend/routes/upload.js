const express = require("express");
const multer = require("multer");
const cloudinary = require("../seed/cloudinaryConfig");
const { Readable } = require("stream");
const Hero = require("../models/Hero"); 
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload/:id", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null); 

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        bufferStream.pipe(stream);
      });
    };

    const result = await uploadToCloudinary();

    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      { $set: { image: result.secure_url, imagePublicId: result.public_id } }, 
      { new: true }
    );

    res.status(200).json({
      message: "Image uploaded and hero updated",
      url: result.secure_url,
      hero,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
});

module.exports = router;
