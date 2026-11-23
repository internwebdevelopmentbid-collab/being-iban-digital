import mongoose from "mongoose";
import HowWeHelp from "../models/howWeHelpModel.js";
import cloudinary from "../config/cloudinary.js";

// ========================================
// HELPERS
// ========================================

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Treat as newline-separated values.
    }

    return trimmed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseBoolean = (value, fallback = true) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
};

const uploadHowWeHelpLogo = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "being-iban-digital/how-we-help",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

const buildPayload = (body = {}) => ({
  clientName: String(body.clientName || "").trim(),
  businessNeeds: normalizeList(body.businessNeeds),
  bidApproach: normalizeList(body.bidApproach),
  resultMetric: String(body.resultMetric || "").trim(),
  isActive: parseBoolean(body.isActive, true),
  sortOrder: Math.max(0, Number(body.sortOrder) || 0),
});

const validatePayload = (payload) => {
  if (!payload.clientName) {
    return "Client name is required.";
  }

  if (!payload.businessNeeds.length) {
    return "Add at least one business need.";
  }

  if (!payload.bidApproach.length) {
    return "Add at least one BID approach item.";
  }

  return null;
};

// ========================================
// PUBLIC: GET ACTIVE ENTRIES
// ========================================

export const getHowWeHelpEntries = async (_req, res) => {
  try {
    const entries = await HowWeHelp.find({
      isActive: true,
    }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("Get public How We Help entries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load How We Help entries.",
    });
  }
};

// ========================================
// ADMIN: GET ALL ENTRIES
// ========================================

export const getAllHowWeHelpEntries = async (_req, res) => {
  try {
    const entries = await HowWeHelp.find().sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("Get admin How We Help entries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load How We Help entries.",
    });
  }
};

// ========================================
// ADMIN: CREATE ENTRY
// ========================================

export const createHowWeHelpEntry = async (req, res) => {
  try {
    const payload = buildPayload(req.body);

    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "A client logo image is required.",
      });
    }

    const uploadedLogo = await uploadHowWeHelpLogo(req.file.buffer);

    payload.logoUrl = uploadedLogo.secure_url;

    const entry = await HowWeHelp.create(payload);

    return res.status(201).json({
      success: true,
      message: "How We Help entry created.",
      entry,
    });
  } catch (error) {
    console.error("Create How We Help entry error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create How We Help entry.",
    });
  }
};

// ========================================
// ADMIN: UPDATE ENTRY
// ========================================

export const updateHowWeHelpEntry = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry ID.",
      });
    }

    const entry = await HowWeHelp.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "How We Help entry not found.",
      });
    }

    const payload = buildPayload(req.body);

    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // Replace logo only when a new image is uploaded.
    if (req.file) {
      const uploadedLogo = await uploadHowWeHelpLogo(req.file.buffer);
      payload.logoUrl = uploadedLogo.secure_url;
    }

    Object.assign(entry, payload);

    await entry.save();

    return res.status(200).json({
      success: true,
      message: "How We Help entry updated.",
      entry,
    });
  } catch (error) {
    console.error("Update How We Help entry error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update How We Help entry.",
    });
  }
};

// ========================================
// ADMIN: DELETE ENTRY
// ========================================

export const deleteHowWeHelpEntry = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry ID.",
      });
    }

    const entry = await HowWeHelp.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "How We Help entry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "How We Help entry deleted.",
    });
  } catch (error) {
    console.error("Delete How We Help entry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete How We Help entry.",
    });
  }
};
