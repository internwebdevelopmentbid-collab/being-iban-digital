import Brand from "../models/brandModel.js";
import Service from "../models/serviceModel.js";
import Stat from "../models/statModel.js";
import TechCapability from "../models/techCapabilityModel.js";
import Review from "../models/reviewModel.js";

import cloudinary from "../config/cloudinary.js";

/* =========================================================
   MODELS
   ========================================================= */

const models = {
  brands: Brand,
  services: Service,
  stats: Stat,
  techCapabilities: TechCapability,
  reviews: Review,
};

/* =========================================================
   GET MODEL
   ========================================================= */

const getModel = (type) => {
  const Model = models[type];

  if (!Model) {
    throw new Error("Invalid website content type");
  }

  return Model;
};

/* =========================================================
   CLOUDINARY UPLOAD HELPERS
   ========================================================= */

const uploadBrandLogo = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "being-iban-digital/brands",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

const uploadServiceIcon = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "being-iban-digital/services",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

const uploadTechCapabilityIcon = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "being-iban-digital/tech-capabilities",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

const uploadReviewLogo = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "being-iban-digital/reviews",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

/* =========================================================
   CLOUDINARY DELETE HELPER
   ========================================================= */

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl) {
    return;
  }

  try {
    const url = new URL(imageUrl);

    const uploadIndex = url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return;
    }

    let publicId = url.pathname.substring(uploadIndex + "/upload/".length);

    const parts = publicId.split("/");

    const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));

    if (versionIndex !== -1) {
      publicId = parts.slice(versionIndex + 1).join("/");
    }

    publicId = publicId.replace(/\.[^/.]+$/, "");

    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary image deletion failed:", error.message);
  }
};

/* =========================================================
   SERVICE FEATURES NORMALIZER
   ========================================================= */

const normalizeServiceFeatures = (features) => {
  if (Array.isArray(features)) {
    return features.map((feature) => String(feature).trim()).filter(Boolean);
  }

  if (typeof features === "string") {
    try {
      const parsed = JSON.parse(features);

      if (Array.isArray(parsed)) {
        return parsed.map((feature) => String(feature).trim()).filter(Boolean);
      }
    } catch {
      // Continue with newline/comma parsing.
    }

    return features
      .split(/\r?\n|,/)
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  return [];
};

/* =========================================================
   SERVICE DATA NORMALIZER
   ========================================================= */

const normalizeServiceData = (body = {}) => {
  return {
    title: typeof body.title === "string" ? body.title.trim() : "",

    shortDescription:
      typeof body.shortDescription === "string"
        ? body.shortDescription.trim()
        : "",

    features: normalizeServiceFeatures(body.features),
  };
};

/* =========================================================
   TECH CAPABILITY DATA NORMALIZER
   ========================================================= */

const normalizeTechCapabilityData = (body = {}) => {
  return {
    title: typeof body.title === "string" ? body.title.trim() : "",

    line1: body.line1 === true || body.line1 === "true",

    line2: body.line2 === true || body.line2 === "true",
  };
};

/* =========================================================
   REVIEW DATA NORMALIZER
   ========================================================= */

const normalizeReviewData = (body = {}) => {
  const rating = Number(body.rating);

  return {
    name: typeof body.name === "string" ? body.name.trim() : "",

    rating: Number.isFinite(rating) ? rating : 0,

    review: typeof body.review === "string" ? body.review.trim() : "",
  };
};

/* =========================================================
   PUBLIC - GET CONTENT
   ========================================================= */

export const getPublicContent = async (req, res) => {
  try {
    const { type } = req.params;

    console.log(`Public website request: /${type}`);

    const Model = getModel(type);

    /* ===============================================
         BRANDS
         =============================================== */

    if (type === "brands") {
      const items = await Brand.find({})
        .sort({
          createdAt: -1,
        })
        .lean();

      console.log(`Brands found: ${items.length}`);

      return res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    }

    /* ===============================================
         STATS
         =============================================== */

    if (type === "stats") {
      const items = await Stat.find({})
        .sort({
          createdAt: -1,
        })
        .lean();

      return res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    }

    /* ===============================================
         SERVICES
         =============================================== */

    if (type === "services") {
      const items = await Service.find({})
        .sort({
          createdAt: -1,
        })
        .lean();

      return res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    }

    /* ===============================================
         TECH CAPABILITIES
         =============================================== */

    if (type === "techCapabilities") {
      const items = await TechCapability.find({})
        .sort({
          createdAt: -1,
        })
        .lean();

      return res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    }

    /* ===============================================
         REVIEWS
         =============================================== */

    if (type === "reviews") {
      const items = await Review.find({})
        .sort({
          createdAt: -1,
        })
        .lean();

      return res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    }

    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  } catch (error) {
    console.error("Get public website content error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

/* =========================================================
   PUBLIC - CREATE REVIEW
   =========================================================

   POST:
   /api/website/reviews

   multipart/form-data:

   name
   rating
   review
   logo

   IMPORTANT:
   This is intentionally separate from createContent()
   because /reviews has no :type route parameter.
   ========================================================= */

export const createPublicReview = async (req, res) => {
  try {
    console.log("========================================");

    console.log("PUBLIC REVIEW SUBMISSION");

    console.log("Body:", req.body);

    console.log(
      "File:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null,
    );

    console.log("========================================");

    /* =============================================
         NORMALIZE
         ============================================= */

    const data = normalizeReviewData(req.body);

    /* =============================================
         VALIDATE NAME
         ============================================= */

    if (!data.name) {
      return res.status(400).json({
        success: false,
        message: "Review name is required",
      });
    }

    /* =============================================
         VALIDATE RATING
         ============================================= */

    if (!Number.isFinite(data.rating) || data.rating < 1 || data.rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Review rating must be between 1 and 5",
      });
    }

    /* =============================================
         VALIDATE REVIEW
         ============================================= */

    if (!data.review) {
      return res.status(400).json({
        success: false,
        message: "Review text is required",
      });
    }

    /* =============================================
         VALIDATE LOGO
         ============================================= */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Review logo is required",
      });
    }

    /* =============================================
         UPLOAD LOGO
         ============================================= */

    const uploadResult = await uploadReviewLogo(req.file.buffer);

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    data.logo = uploadResult.secure_url;

    /* =============================================
         CREATE REVIEW
         ============================================= */

    const review = await Review.create(data);

    console.log("Review created successfully:", review._id);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create public review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit review",
    });
  }
};

/* =========================================================
   ADMIN - GET ALL
   ========================================================= */

export const getAdminContent = async (req, res) => {
  try {
    const { type } = req.params;

    const Model = getModel(type);

    const items = await Model.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get admin website content error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - GET ONE
   ========================================================= */

export const getAdminContentById = async (req, res) => {
  try {
    const Model = getModel(req.params.type);

    const item = await Model.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get website content by ID error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - CREATE
   ========================================================= */

export const createContent = async (req, res) => {
  try {
    const { type } = req.params;

    const Model = getModel(type);

    /* ===============================================
         SERVICES
         =============================================== */

    if (type === "services") {
      const data = normalizeServiceData(req.body);

      if (!data.title) {
        return res.status(400).json({
          success: false,
          message: "Service title is required",
        });
      }

      if (!data.shortDescription) {
        return res.status(400).json({
          success: false,
          message: "Service short description is required",
        });
      }

      if (!data.features.length) {
        return res.status(400).json({
          success: false,
          message: "At least one service feature is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Service icon is required",
        });
      }

      const uploadResult = await uploadServiceIcon(req.file.buffer);

      data.icon = uploadResult.secure_url;

      const service = await Model.create(data);

      return res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    }

    /* ===============================================
         STATS
         =============================================== */

    if (type === "stats") {
      const stat = await Model.create({
        value: req.body.value,
        suffix: req.body.suffix || "",
        label: req.body.label,
      });

      return res.status(201).json({
        success: true,
        message: "Stat created successfully",
        data: stat,
      });
    }

    /* ===============================================
         BRANDS
         =============================================== */

    if (type === "brands") {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Brand logo is required",
        });
      }

      const data = {
        name: typeof req.body.name === "string" ? req.body.name.trim() : "",

        websiteUrl: req.body.websiteUrl || "",

        isFeatured:
          req.body.isFeatured === true || req.body.isFeatured === "true",
      };

      const uploadResult = await uploadBrandLogo(req.file.buffer);

      data.logoUrl = uploadResult.secure_url;

      const brand = await Model.create(data);

      return res.status(201).json({
        success: true,
        message: "Brand created successfully",
        data: brand,
      });
    }

    /* ===============================================
         TECH CAPABILITIES
         =============================================== */

    if (type === "techCapabilities") {
      const data = normalizeTechCapabilityData(req.body);

      if (!data.title) {
        return res.status(400).json({
          success: false,
          message: "Technology capability title is required",
        });
      }

      if (!data.line1 && !data.line2) {
        return res.status(400).json({
          success: false,
          message: "Select Line 1 or Line 2",
        });
      }

      if (data.line1 && data.line2) {
        return res.status(400).json({
          success: false,
          message: "A technology capability can belong to only one line",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Technology capability icon is required",
        });
      }

      const uploadResult = await uploadTechCapabilityIcon(req.file.buffer);

      data.icon = uploadResult.secure_url;

      const capability = await Model.create(data);

      return res.status(201).json({
        success: true,
        message: "Technology capability created successfully",
        data: capability,
      });
    }

    /* ===============================================
         REVIEWS - ADMIN
         =============================================== */

    if (type === "reviews") {
      const data = normalizeReviewData(req.body);

      if (!data.name) {
        return res.status(400).json({
          success: false,
          message: "Review name is required",
        });
      }

      if (!Number.isFinite(data.rating) || data.rating < 1 || data.rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Review rating must be between 1 and 5",
        });
      }

      if (!data.review) {
        return res.status(400).json({
          success: false,
          message: "Review text is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Review logo is required",
        });
      }

      const uploadResult = await uploadReviewLogo(req.file.buffer);

      data.logo = uploadResult.secure_url;

      const review = await Model.create(data);

      return res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
      });
    }

    /* ===============================================
         OTHER CONTENT
         =============================================== */

    const item = await Model.create({
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Create website content error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - UPDATE
   ========================================================= */

export const updateContent = async (req, res) => {
  try {
    const { type, id } = req.params;

    const Model = getModel(type);

    const existingItem = await Model.findById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    /* ===============================================
         SERVICES
         =============================================== */

    if (type === "services") {
      const data = normalizeServiceData(req.body);

      if (!data.title) {
        return res.status(400).json({
          success: false,
          message: "Service title is required",
        });
      }

      if (!data.shortDescription) {
        return res.status(400).json({
          success: false,
          message: "Service short description is required",
        });
      }

      if (!data.features.length) {
        return res.status(400).json({
          success: false,
          message: "At least one service feature is required",
        });
      }

      if (req.file) {
        const uploadResult = await uploadServiceIcon(req.file.buffer);

        data.icon = uploadResult.secure_url;
      }

      const service = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (req.file && existingItem.icon && existingItem.icon !== service.icon) {
        await deleteCloudinaryImage(existingItem.icon);
      }

      return res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    }

    /* ===============================================
         STATS
         =============================================== */

    if (type === "stats") {
      const stat = await Model.findByIdAndUpdate(
        id,
        {
          value: req.body.value,

          suffix: req.body.suffix || "",

          label: req.body.label,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return res.json({
        success: true,
        message: "Stat updated successfully",
        data: stat,
      });
    }

    /* ===============================================
         BRANDS
         =============================================== */

    if (type === "brands") {
      const data = {
        name: typeof req.body.name === "string" ? req.body.name.trim() : "",

        websiteUrl: req.body.websiteUrl || "",

        isFeatured:
          req.body.isFeatured === true || req.body.isFeatured === "true",
      };

      if (req.file) {
        const uploadResult = await uploadBrandLogo(req.file.buffer);

        data.logoUrl = uploadResult.secure_url;
      }

      const brand = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (
        req.file &&
        existingItem.logoUrl &&
        existingItem.logoUrl !== brand.logoUrl
      ) {
        await deleteCloudinaryImage(existingItem.logoUrl);
      }

      return res.json({
        success: true,
        message: "Brand updated successfully",
        data: brand,
      });
    }

    /* ===============================================
         TECH CAPABILITIES
         =============================================== */

    if (type === "techCapabilities") {
      const data = normalizeTechCapabilityData(req.body);

      if (!data.title) {
        return res.status(400).json({
          success: false,
          message: "Technology capability title is required",
        });
      }

      if (!data.line1 && !data.line2) {
        return res.status(400).json({
          success: false,
          message: "Select Line 1 or Line 2",
        });
      }

      if (data.line1 && data.line2) {
        return res.status(400).json({
          success: false,
          message: "A technology capability can belong to only one line",
        });
      }

      if (req.file) {
        const uploadResult = await uploadTechCapabilityIcon(req.file.buffer);

        data.icon = uploadResult.secure_url;
      } else {
        data.icon = existingItem.icon || "";
      }

      const capability = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (
        req.file &&
        existingItem.icon &&
        existingItem.icon !== capability.icon
      ) {
        await deleteCloudinaryImage(existingItem.icon);
      }

      return res.json({
        success: true,
        message: "Technology capability updated successfully",
        data: capability,
      });
    }

    /* ===============================================
         REVIEWS
         =============================================== */

    if (type === "reviews") {
      const data = normalizeReviewData(req.body);

      if (!data.name) {
        return res.status(400).json({
          success: false,
          message: "Review name is required",
        });
      }

      if (!Number.isFinite(data.rating) || data.rating < 1 || data.rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Review rating must be between 1 and 5",
        });
      }

      if (!data.review) {
        return res.status(400).json({
          success: false,
          message: "Review text is required",
        });
      }

      if (req.file) {
        const uploadResult = await uploadReviewLogo(req.file.buffer);

        data.logo = uploadResult.secure_url;
      } else {
        data.logo = existingItem.logo || "";
      }

      if (!data.logo) {
        return res.status(400).json({
          success: false,
          message: "Review logo is required",
        });
      }

      const review = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (req.file && existingItem.logo && existingItem.logo !== review.logo) {
        await deleteCloudinaryImage(existingItem.logo);
      }

      return res.json({
        success: true,
        message: "Review updated successfully",
        data: review,
      });
    }

    /* ===============================================
         OTHER CONTENT
         =============================================== */

    const item = await Model.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.json({
      success: true,
      message: "Content updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Update website content error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - DELETE
   ========================================================= */

export const deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;

    const Model = getModel(type);

    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    await Model.findByIdAndDelete(id);

    /* ===============================================
         BRAND IMAGE
         =============================================== */

    if (type === "brands" && item.logoUrl) {
      await deleteCloudinaryImage(item.logoUrl);
    }

    /* ===============================================
         SERVICE IMAGE
         =============================================== */

    if (type === "services" && item.icon) {
      await deleteCloudinaryImage(item.icon);
    }

    /* ===============================================
         TECH CAPABILITY IMAGE
         =============================================== */

    if (type === "techCapabilities" && item.icon) {
      await deleteCloudinaryImage(item.icon);
    }

    /* ===============================================
         REVIEW IMAGE
         =============================================== */

    if (type === "reviews" && item.logo) {
      await deleteCloudinaryImage(item.logo);
    }

    return res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete website content error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
