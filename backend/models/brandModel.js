import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    websiteUrl: {
      type: String,
      default: "",
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default Brand;
