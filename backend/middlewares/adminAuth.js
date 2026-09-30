import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // -----------------------------
    // Check authorization header
    // -----------------------------

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Admin token required.",
      });
    }

    // -----------------------------
    // Get token
    // -----------------------------

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin token is missing.",
      });
    }

    // -----------------------------
    // Verify token
    // -----------------------------

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token.",
      });
    }

    // -----------------------------
    // Find admin
    // -----------------------------

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    // -----------------------------
    // Check admin status
    // -----------------------------

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive.",
      });
    }

    // -----------------------------
    // Attach admin to request
    // -----------------------------

    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

export default adminAuth;
