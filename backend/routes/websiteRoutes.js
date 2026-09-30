import express from "express";

import {
  getPublicContent,
  getAdminContent,
  getAdminContentById,
  createContent,
  createPublicReview,
  updateContent,
  deleteContent,
} from "../controllers/websiteController.js";

import adminAuth from "../middlewares/adminAuth.js";
import upload from "../middlewares/upload.js";

const websiteRouter = express.Router();

/* =========================================================
   ADMIN - GET ALL
   ========================================================= */

websiteRouter.get("/admin/:type", adminAuth, getAdminContent);

/* =========================================================
   ADMIN - GET ONE
   ========================================================= */

websiteRouter.get("/admin/:type/:id", adminAuth, getAdminContentById);

/* =========================================================
   ADMIN - CREATE
   ========================================================= */

websiteRouter.post(
  "/admin/:type",
  adminAuth,
  (req, res, next) => {
    const type = req.params.type;

    /*
     * These content types require
     * multipart/form-data because
     * they contain an image.
     */

    if (
      type === "brands" ||
      type === "services" ||
      type === "techCapabilities" ||
      type === "reviews"
    ) {
      let fieldName = "icon";

      if (type === "brands") {
        fieldName = "logo";
      }

      if (type === "reviews") {
        fieldName = "logo";
      }

      return upload.single(fieldName)(req, res, next);
    }

    next();
  },
  createContent,
);

/* =========================================================
   ADMIN - UPDATE
   ========================================================= */

websiteRouter.patch(
  "/admin/:type/:id",
  adminAuth,
  (req, res, next) => {
    const type = req.params.type;

    /*
     * Image upload is optional
     * during update.
     */

    if (
      type === "brands" ||
      type === "services" ||
      type === "techCapabilities" ||
      type === "reviews"
    ) {
      let fieldName = "icon";

      if (type === "brands") {
        fieldName = "logo";
      }

      if (type === "reviews") {
        fieldName = "logo";
      }

      return upload.single(fieldName)(req, res, next);
    }

    next();
  },
  updateContent,
);

/* =========================================================
   ADMIN - DELETE
   ========================================================= */

websiteRouter.delete("/admin/:type/:id", adminAuth, deleteContent);

/* =========================================================
   PUBLIC - CREATE REVIEW
   =========================================================

   POST:

   /api/website/reviews

   FormData:

   name
   rating
   review
   logo

   IMPORTANT:
   This MUST use createPublicReview(),
   NOT createContent().

   createContent() expects:

   req.params.type

   but this route has no :type.
   ========================================================= */

websiteRouter.post("/reviews", upload.single("logo"), createPublicReview);

/* =========================================================
   PUBLIC - GET WEBSITE CONTENT
   =========================================================

   Examples:

   GET /api/website/brands
   GET /api/website/services
   GET /api/website/stats
   GET /api/website/techCapabilities
   GET /api/website/reviews
   ========================================================= */

websiteRouter.get("/:type", getPublicContent);

export default websiteRouter;
