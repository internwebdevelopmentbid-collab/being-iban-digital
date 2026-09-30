import mongoose from "mongoose";

const MEDIA_CATEGORIES = ["website", "image", "video"];

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: MEDIA_CATEGORIES,
      lowercase: true,
      trim: true,
    },

    clientName: {
      type: String,
      trim: true,
      default: "",
    },

    customTag: {
      type: String,
      trim: true,
      default: "",
    },

    projectUrl: {
      type: String,
      trim: true,
      default: "",
    },

    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    showInCTA: {
      type: Boolean,
      default: false,
    },

    showInHero: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
|
| Website:
| - projectUrl is required
| - thumbnail is allowed
|
| Image:
| - mediaUrl is required
| - no separate thumbnail is required
|
| Video:
| - mediaUrl is required
| - NO separate thumbnail
| - NO poster
|--------------------------------------------------------------------------
*/

mediaSchema.pre("validate", function () {
  /*
    |--------------------------------------------------------------------------
    | WEBSITE
    |--------------------------------------------------------------------------
    */

  if (this.category === "website" && !this.projectUrl?.trim()) {
    this.invalidate(
      "projectUrl",
      "Project URL is required for website category.",
    );
  }

  /*
    |--------------------------------------------------------------------------
    | IMAGE / VIDEO
    |--------------------------------------------------------------------------
    */

  if (
    (this.category === "image" || this.category === "video") &&
    !this.mediaUrl?.trim()
  ) {
    this.invalidate(
      "mediaUrl",
      "Media URL is required for image or video category.",
    );
  }

  /*
    |--------------------------------------------------------------------------
    | VIDEO MUST NOT HAVE A SEPARATE THUMBNAIL
    |--------------------------------------------------------------------------
    */

  if (this.category === "video") {
    this.thumbnail = "";
  }
});

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);

export default Media;
