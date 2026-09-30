import Review from "../models/reviewModel.js";

/*
|--------------------------------------------------------------------------
| Public - Get active reviews
|--------------------------------------------------------------------------
*/

export const getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      isActive: true,
    })
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get public reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Public - Get featured reviews
|--------------------------------------------------------------------------
*/

export const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get featured reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load featured reviews.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Get all reviews
|--------------------------------------------------------------------------
*/

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Get review by ID
|--------------------------------------------------------------------------
*/

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Get review by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load review.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Create review
|--------------------------------------------------------------------------
*/

export const createReview = async (req, res) => {
  try {
    const {
      name,
      role,
      company,
      avatarUrl,
      rating,
      review,
      service,
      project,
      isFeatured,
      isActive,
      sortOrder,
      tags,
      adminNotes,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Review name is required.",
      });
    }

    if (!review) {
      return res.status(400).json({
        success: false,
        message: "Review content is required.",
      });
    }

    const numericRating = Number(rating ?? 5);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const normalizedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

    const newReview = await Review.create({
      name: name.trim(),
      role: role?.trim() || "",
      company: company?.trim() || "",
      avatarUrl: avatarUrl?.trim() || "",
      rating: numericRating,
      review: review.trim(),
      service: service?.trim() || "",
      project: project?.trim() || "",
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== false,
      sortOrder: Number(sortOrder || 0),
      tags: normalizedTags,
      adminNotes: adminNotes?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully.",
      review: newReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create review.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Update review
|--------------------------------------------------------------------------
*/

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const {
      name,
      role,
      company,
      avatarUrl,
      rating,
      review: reviewText,
      service,
      project,
      isFeatured,
      isActive,
      sortOrder,
      tags,
      adminNotes,
    } = req.body;

    if (rating !== undefined && (Number(rating) < 1 || Number(rating) > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review name cannot be empty.",
      });
    }

    if (reviewText !== undefined && !reviewText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review content cannot be empty.",
      });
    }

    if (name !== undefined) {
      review.name = name.trim();
    }

    if (role !== undefined) {
      review.role = role.trim();
    }

    if (company !== undefined) {
      review.company = company.trim();
    }

    if (avatarUrl !== undefined) {
      review.avatarUrl = avatarUrl.trim();
    }

    if (rating !== undefined) {
      review.rating = Number(rating);
    }

    if (reviewText !== undefined) {
      review.review = reviewText.trim();
    }

    if (service !== undefined) {
      review.service = service.trim();
    }

    if (project !== undefined) {
      review.project = project.trim();
    }

    if (isFeatured !== undefined) {
      review.isFeatured = Boolean(isFeatured);
    }

    if (isActive !== undefined) {
      review.isActive = Boolean(isActive);
    }

    if (sortOrder !== undefined) {
      review.sortOrder = Number(sortOrder);
    }

    if (tags !== undefined) {
      review.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [];
    }

    if (adminNotes !== undefined) {
      review.adminNotes = adminNotes.trim();
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update review.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Delete review
|--------------------------------------------------------------------------
*/

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete review.",
    });
  }
};
