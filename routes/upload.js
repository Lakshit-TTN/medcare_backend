import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file?.path; 
    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }
    res.json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
