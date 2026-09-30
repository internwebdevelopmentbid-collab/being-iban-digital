import bcrypt from "bcryptjs";

import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js";

// =====================================================
// REGISTER ADMIN
// =====================================================

const registerAdmin = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // -----------------------------
    // Validate fields
    // -----------------------------

    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, username and password are required.",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // -----------------------------
    // Validate username
    // -----------------------------

    if (normalizedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters.",
      });
    }

    // -----------------------------
    // Validate password
    // -----------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // -----------------------------
    // Check existing admin
    // -----------------------------

    const existingAdmin = await Admin.findOne({
      username: normalizedUsername,
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------
    // Create admin
    // -----------------------------

    const admin = await Admin.create({
      name: name.trim(),
      username: normalizedUsername,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Register admin error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN LOGIN
// =====================================================

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // -----------------------------
    // Validate fields
    // -----------------------------

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // -----------------------------
    // Find admin
    // -----------------------------

    const admin = await Admin.findOne({
      username: normalizedUsername,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // -----------------------------
    // Check active status
    // -----------------------------

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive.",
      });
    }

    // -----------------------------
    // Compare password
    // -----------------------------

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // -----------------------------
    // Generate token
    // -----------------------------

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,

      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET CURRENT ADMIN PROFILE
// =====================================================

const getAdminProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      admin: {
        id: req.admin._id,
        name: req.admin.name,
        username: req.admin.username,
        role: req.admin.role,
        isActive: req.admin.isActive,
        createdAt: req.admin.createdAt,
        updatedAt: req.admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

export { registerAdmin, loginAdmin, getAdminProfile };
