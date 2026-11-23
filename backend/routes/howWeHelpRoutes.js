import express from "express";
import multer from "multer";

import {
  getHowWeHelpEntries,
  getAllHowWeHelpEntries,
  createHowWeHelpEntry,
  updateHowWeHelpEntry,
  deleteHowWeHelpEntry,
} from "../controllers/howWeHelpController.js";

import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

// Store uploaded image temporarily in memory before sending it to Cloudinary.
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }

    callback(null, true);
  },
});

// ========================================
// PUBLIC ROUTES
// ========================================

// Get active How We Help entries
router.get("/", getHowWeHelpEntries);

// ========================================
// ADMIN ROUTES
// ========================================

// Get all entries, including inactive entries
router.get("/admin/all", adminAuth, getAllHowWeHelpEntries);

// Create entry with logo image upload
router.post(
  "/admin",
  adminAuth,
  imageUpload.single("logo"),
  createHowWeHelpEntry,
);

// Update entry, optionally replacing its logo
router.patch(
  "/admin/:id",
  adminAuth,
  imageUpload.single("logo"),
  updateHowWeHelpEntry,
);

// Delete entry
router.delete("/admin/:id", adminAuth, deleteHowWeHelpEntry);

export default router;
