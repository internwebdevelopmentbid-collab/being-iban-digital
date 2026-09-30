import express from "express";

import {
  createMeeting,
  createAdminMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meetingController.js";

import adminAuth from "../middlewares/adminAuth.js";

const meetingRouter = express.Router();

// =====================================================
// PUBLIC
// =====================================================

// Customer project enquiry
meetingRouter.post("/", createMeeting);

// =====================================================
// ADMIN
// =====================================================

// Admin manually creates an enquiry
meetingRouter.post("/admin", adminAuth, createAdminMeeting);

// Get all enquiries
meetingRouter.get("/admin/all", adminAuth, getAllMeetings);

// Get single enquiry
meetingRouter.get("/admin/:id", adminAuth, getMeetingById);

// Update enquiry
meetingRouter.patch("/admin/:id", adminAuth, updateMeeting);

// Delete enquiry
meetingRouter.delete("/admin/:id", adminAuth, deleteMeeting);

export default meetingRouter;
