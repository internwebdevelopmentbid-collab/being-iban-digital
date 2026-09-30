import Media from "../models/mediaModel.js";
import cloudinary from "../config/cloudinary.js";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const MEDIA_CATEGORIES = ["website", "image", "video"];

/*
|--------------------------------------------------------------------------
| Cloudinary Upload Helper
|--------------------------------------------------------------------------
*/

const uploadToCloudinary = (
  buffer,
  { resourceType = "auto", folder = "iban-digital/media" } = {},
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

/*
|--------------------------------------------------------------------------
| Boolean Helper
|--------------------------------------------------------------------------
*/

const toBoolean = (value) => {
  return value === true || value === "true" || value === 1 || value === "1";
};

/*
|--------------------------------------------------------------------------
| Category Helper
|--------------------------------------------------------------------------
*/

const normalizeCategory = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

/*
|--------------------------------------------------------------------------
| Delete Cloudinary Asset
|--------------------------------------------------------------------------
*/

const deleteFromCloudinary = async (publicId, category) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: category === "video" ? "video" : "image",
    });
  } catch (error) {
    console.error("Cloudinary asset delete error:", error);
  }
};

/*
|--------------------------------------------------------------------------
| Validate Category
|--------------------------------------------------------------------------
*/

const isValidCategory = (category) => {
  return MEDIA_CATEGORIES.includes(category);
};

/*
|--------------------------------------------------------------------------
| Get Hero Media
|--------------------------------------------------------------------------
| GET /api/media/hero
|--------------------------------------------------------------------------
*/

export const getHeroMedia = async (req, res) => {
  try {
    const media = await Media.findOne({
      showInHero: true,
    })
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("Get hero media error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch hero media.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Hero Gallery
|--------------------------------------------------------------------------
| GET /api/media/hero/gallery
|--------------------------------------------------------------------------
*/

export const getHeroGallery = async (req, res) => {
  try {
    const media = await Media.find({
      showInHero: true,
    })
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    console.error("Get hero gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load hero gallery.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Portfolio Media
|--------------------------------------------------------------------------
| GET /api/media/portfolio
|
| Optional:
|
| ?category=website
| ?category=image
| ?category=video
| ?featured=true
|--------------------------------------------------------------------------
*/

export const getPortfolioMedia = async (req, res) => {
  try {
    const { category, featured } = req.query;

    const filter = {};

    if (category && category !== "all") {
      const normalizedCategory = normalizeCategory(category);

      if (isValidCategory(normalizedCategory)) {
        filter.category = normalizedCategory;
      }
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    const media = await Media.find(filter)
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    console.error("Get portfolio media error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch portfolio media.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Works CTA Media
|--------------------------------------------------------------------------
| GET /api/media/works-cta
|--------------------------------------------------------------------------
*/

export const getWorksCTA = async (req, res) => {
  try {
    const media = await Media.find({
      showInCTA: true,
    })
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .limit(3)
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    console.error("Get Works CTA error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Works CTA media.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Media
|--------------------------------------------------------------------------
| Admin
| GET /api/media/admin
|
| Query:
|
| ?category=website
| ?category=image
| ?category=video
| ?featured=true
| ?hero=true
| ?cta=true
| ?search=...
|--------------------------------------------------------------------------
*/

export const getAllMedia = async (req, res) => {
  try {
    const { category, featured, hero, cta, search } = req.query;

    const filter = {};

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (category && category !== "all") {
      const normalizedCategory = normalizeCategory(category);

      if (isValidCategory(normalizedCategory)) {
        filter.category = normalizedCategory;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Featured
    |--------------------------------------------------------------------------
    */

    if (featured === "true") {
      filter.isFeatured = true;
    }

    /*
    |--------------------------------------------------------------------------
    | Hero
    |--------------------------------------------------------------------------
    */

    if (hero === "true") {
      filter.showInHero = true;
    }

    /*
    |--------------------------------------------------------------------------
    | CTA
    |--------------------------------------------------------------------------
    */

    if (cta === "true") {
      filter.showInCTA = true;
    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");

      filter.$or = [
        {
          title: regex,
        },
        {
          category: regex,
        },
        {
          clientName: regex,
        },
        {
          customTag: regex,
        },
        {
          projectUrl: regex,
        },
      ];
    }

    const media = await Media.find(filter)
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error) {
    console.error("Get all media error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch media.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Upload Media
|--------------------------------------------------------------------------
| Admin
| POST /api/media/admin/upload
|
| FormData:
|
| media
| thumbnail
|
| title
| category
| clientName
| customTag
| projectUrl
| isFeatured
| showInCTA
| showInHero
|
|--------------------------------------------------------------------------
| Category behavior:
|
| website
|   -> thumbnail is required
|   -> projectUrl is required
|
| image
|   -> media image is required
|
| video
|   -> media video is required
|   -> NO thumbnail
|--------------------------------------------------------------------------
*/

export const uploadMedia = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Read Request Data
    |--------------------------------------------------------------------------
    */

    const {
      title = "",
      category = "",
      clientName = "",
      customTag = "",
      projectUrl = "",
      isFeatured = false,
      showInCTA = false,
      showInHero = false,
    } = req.body;

    const normalizedTitle = String(title).trim();

    const normalizedCategory = normalizeCategory(category);

    const normalizedClientName = String(clientName || "").trim();

    const normalizedCustomTag = String(customTag || "").trim();

    const normalizedProjectUrl = String(projectUrl || "").trim();

    /*
    |--------------------------------------------------------------------------
    | Validate Title
    |--------------------------------------------------------------------------
    */

    if (!normalizedTitle) {
      return res.status(400).json({
        success: false,
        message: "Media title is required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Category
    |--------------------------------------------------------------------------
    */

    if (!isValidCategory(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Category must be website, image, or video.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Website
    |--------------------------------------------------------------------------
    */

    if (normalizedCategory === "website") {
      if (!normalizedProjectUrl) {
        return res.status(400).json({
          success: false,
          message: "Project URL is required for website category.",
        });
      }

      if (!req.files?.thumbnail?.[0]) {
        return res.status(400).json({
          success: false,
          message: "Please select a website thumbnail.",
        });
      }

      const thumbnailFile = req.files.thumbnail[0];

      if (!thumbnailFile.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Website thumbnail must be an image.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Upload Website Thumbnail
      |--------------------------------------------------------------------------
      */

      const thumbnailResult = await uploadToCloudinary(thumbnailFile.buffer, {
        resourceType: "image",
        folder: "iban-digital/thumbnails",
      });

      /*
      |--------------------------------------------------------------------------
      | Create Website Record
      |--------------------------------------------------------------------------
      */

      const media = await Media.create({
        title: normalizedTitle,

        category: normalizedCategory,

        clientName: normalizedClientName,

        customTag: normalizedCustomTag,

        projectUrl: normalizedProjectUrl,

        mediaUrl: thumbnailResult.secure_url,

        publicId: thumbnailResult.public_id,

        thumbnail: thumbnailResult.secure_url,

        isFeatured: toBoolean(isFeatured),

        showInCTA: toBoolean(showInCTA),

        showInHero: toBoolean(showInHero),
      });

      return res.status(201).json({
        success: true,
        message: "Website media added successfully.",
        media,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Image / Video Actual Media
    |--------------------------------------------------------------------------
    */

    if (!req.files?.media?.[0]) {
      return res.status(400).json({
        success: false,
        message:
          normalizedCategory === "video"
            ? "Please select a video."
            : "Please select an image.",
      });
    }

    const mediaFile = req.files.media[0];

    /*
    |--------------------------------------------------------------------------
    | Image
    |--------------------------------------------------------------------------
    */

    if (normalizedCategory === "image") {
      if (!mediaFile.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "The selected file must be an image.",
        });
      }

      const mediaResult = await uploadToCloudinary(mediaFile.buffer, {
        resourceType: "image",
        folder: "iban-digital/images",
      });

      /*
      |--------------------------------------------------------------------------
      | Image uses itself as thumbnail
      |--------------------------------------------------------------------------
      */

      const media = await Media.create({
        title: normalizedTitle,

        category: normalizedCategory,

        clientName: normalizedClientName,

        customTag: normalizedCustomTag,

        projectUrl: normalizedProjectUrl,

        mediaUrl: mediaResult.secure_url,

        publicId: mediaResult.public_id,

        thumbnail: mediaResult.secure_url,

        isFeatured: toBoolean(isFeatured),

        showInCTA: toBoolean(showInCTA),

        showInHero: toBoolean(showInHero),
      });

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        media,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Video
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | No thumbnail is accepted or required.
    |
    */

    if (normalizedCategory === "video") {
      if (!mediaFile.mimetype.startsWith("video/")) {
        return res.status(400).json({
          success: false,
          message: "The selected file must be a video.",
        });
      }

      const mediaResult = await uploadToCloudinary(mediaFile.buffer, {
        resourceType: "video",
        folder: "iban-digital/videos",
      });

      /*
      |--------------------------------------------------------------------------
      | Create Video Record
      |--------------------------------------------------------------------------
      */

      const media = await Media.create({
        title: normalizedTitle,

        category: normalizedCategory,

        clientName: normalizedClientName,

        customTag: normalizedCustomTag,

        projectUrl: normalizedProjectUrl,

        mediaUrl: mediaResult.secure_url,

        publicId: mediaResult.public_id,

        thumbnail: "",

        isFeatured: toBoolean(isFeatured),

        showInCTA: toBoolean(showInCTA),

        showInHero: toBoolean(showInHero),
      });

      return res.status(201).json({
        success: true,
        message: "Video uploaded successfully.",
        media,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Unsupported media category.",
    });
  } catch (error) {
    console.error("Upload media error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload media.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Media
|--------------------------------------------------------------------------
| Admin
| PATCH /api/media/admin/:id
|--------------------------------------------------------------------------
*/

export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Text Fields
    |--------------------------------------------------------------------------
    */

    if (req.body.title !== undefined) {
      const title = String(req.body.title).trim();

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Media title is required.",
        });
      }

      media.title = title;
    }

    if (req.body.category !== undefined) {
      const category = normalizeCategory(req.body.category);

      if (!isValidCategory(category)) {
        return res.status(400).json({
          success: false,
          message: "Category must be website, image, or video.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Prevent Invalid Asset Changes
      |--------------------------------------------------------------------------
      |
      | Category describes the actual media type.
      | Do not silently convert an existing image/video
      | into another category through metadata editing.
      |
      */

      if (category !== media.category) {
        return res.status(400).json({
          success: false,
          message:
            "Media category cannot be changed here. Replace the media asset instead.",
        });
      }

      media.category = category;
    }

    if (req.body.clientName !== undefined) {
      media.clientName = String(req.body.clientName || "").trim();
    }

    if (req.body.customTag !== undefined) {
      media.customTag = String(req.body.customTag || "").trim();
    }

    if (req.body.projectUrl !== undefined) {
      media.projectUrl = String(req.body.projectUrl || "").trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Boolean Fields
    |--------------------------------------------------------------------------
    */

    if (req.body.isFeatured !== undefined) {
      media.isFeatured = toBoolean(req.body.isFeatured);
    }

    if (req.body.showInCTA !== undefined) {
      media.showInCTA = toBoolean(req.body.showInCTA);
    }

    if (req.body.showInHero !== undefined) {
      media.showInHero = toBoolean(req.body.showInHero);
    }

    /*
    |--------------------------------------------------------------------------
    | Website Validation
    |--------------------------------------------------------------------------
    */

    if (media.category === "website") {
      if (!media.projectUrl?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Project URL is required for website category.",
        });
      }

      if (!media.thumbnail?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Website thumbnail is required.",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Image Validation
    |--------------------------------------------------------------------------
    */

    if (media.category === "image") {
      if (!media.mediaUrl?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Image media URL is required.",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Video Validation
    |--------------------------------------------------------------------------
    |
    | No thumbnail required.
    |
    */

    if (media.category === "video") {
      if (!media.mediaUrl?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Video media URL is required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Ensure Video Has No Thumbnail
      |--------------------------------------------------------------------------
      */

      media.thumbnail = "";
    }

    await media.save();

    return res.status(200).json({
      success: true,
      message: "Media updated successfully.",
      media,
    });
  } catch (error) {
    console.error("Update media error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update media.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Replace Website Thumbnail
|--------------------------------------------------------------------------
| Admin
| PATCH /api/media/admin/:id/thumbnail
|
| Only Website media uses a separate thumbnail.
|--------------------------------------------------------------------------
*/

export const updateMediaThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a thumbnail image.",
      });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail must be an image.",
      });
    }

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Only Website Uses Separate Thumbnail
      |--------------------------------------------------------------------------
      */

    if (media.category !== "website") {
      return res.status(400).json({
        success: false,
        message: "Only website media can have a separate thumbnail.",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      resourceType: "image",
      folder: "iban-digital/thumbnails",
    });

    media.thumbnail = result.secure_url;

    media.mediaUrl = result.secure_url;

    media.publicId = result.public_id;

    await media.save();

    return res.status(200).json({
      success: true,
      message: "Website thumbnail updated successfully.",
      media,
    });
  } catch (error) {
    console.error("Update thumbnail error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update thumbnail.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Replace Actual Media
|--------------------------------------------------------------------------
| Admin
| PATCH /api/media/admin/:id/media
|
| Only Image and Video categories use this endpoint.
|--------------------------------------------------------------------------
*/

export const updateMediaAsset = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image or video.",
      });
    }

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Website
      |--------------------------------------------------------------------------
      */

    if (media.category === "website") {
      return res.status(400).json({
        success: false,
        message: "Website media uses the thumbnail endpoint.",
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Image
      |--------------------------------------------------------------------------
      */

    if (media.category === "image") {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image.",
        });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        resourceType: "image",
        folder: "iban-digital/images",
      });

      await deleteFromCloudinary(media.publicId, "image");

      media.mediaUrl = result.secure_url;

      media.publicId = result.public_id;

      media.thumbnail = result.secure_url;

      await media.save();

      return res.status(200).json({
        success: true,
        message: "Image replaced successfully.",
        media,
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Video
      |--------------------------------------------------------------------------
      */

    if (media.category === "video") {
      if (!req.file.mimetype.startsWith("video/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload a video.",
        });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        resourceType: "video",
        folder: "iban-digital/videos",
      });

      await deleteFromCloudinary(media.publicId, "video");

      media.mediaUrl = result.secure_url;

      media.publicId = result.public_id;

      /*
        |--------------------------------------------------------------------------
        | Video NEVER Has A Thumbnail
        |--------------------------------------------------------------------------
        */

      media.thumbnail = "";

      await media.save();

      return res.status(200).json({
        success: true,
        message: "Video replaced successfully.",
        media,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Unsupported media category.",
    });
  } catch (error) {
    console.error("Update media asset error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to replace media.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Media
|--------------------------------------------------------------------------
| Admin
| DELETE /api/media/admin/:id
|--------------------------------------------------------------------------
*/

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Main Cloudinary Asset
    |--------------------------------------------------------------------------
    */

    await deleteFromCloudinary(media.publicId, media.category);

    /*
    |--------------------------------------------------------------------------
    | Delete Database Record
    |--------------------------------------------------------------------------
    */

    await Media.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error("Delete media error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete media.",
    });
  }
};
