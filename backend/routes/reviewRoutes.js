import express from "express";

import {
  getPublicReviews,
  getFeaturedReviews,
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import adminAuth from "../middlewares/adminAuth.js";

const reviewRouter = express.Router();

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

reviewRouter.get("/", getPublicReviews);

reviewRouter.get("/featured", getFeaturedReviews);

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/

reviewRouter.get("/admin/all", adminAuth, getAllReviews);

reviewRouter.get("/admin/:id", adminAuth, getReviewById);

reviewRouter.post("/admin", adminAuth, createReview);

reviewRouter.patch("/admin/:id", adminAuth, updateReview);

reviewRouter.delete("/admin/:id", adminAuth, deleteReview);

export default reviewRouter;
