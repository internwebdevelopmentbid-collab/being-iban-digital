import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from "../controllers/adminController.js";

import adminAuth from "../middlewares/adminAuth.js";

const adminRouter = express.Router();

// =====================================================
// ADMIN ACCOUNT ROUTES
// =====================================================

// Development / setup
adminRouter.post("/register", registerAdmin);

// Admin login
adminRouter.post("/login", loginAdmin);

// Current admin profile
adminRouter.get("/profile", adminAuth, getAdminProfile);

export default adminRouter;
