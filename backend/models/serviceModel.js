import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
