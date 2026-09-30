import mongoose from "mongoose";

const techCapabilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    line1: {
      type: Boolean,
      default: false,
    },

    line2: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const TechCapability =
  mongoose.models.TechCapability ||
  mongoose.model("TechCapability", techCapabilitySchema);

export default TechCapability;
