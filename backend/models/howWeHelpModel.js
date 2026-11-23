import mongoose from "mongoose";

const howWeHelpSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    businessNeeds: {
      type: [String],
      required: true,
      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length > 0 &&
          items.every((item) => typeof item === "string" && item.trim()),
        message: "At least one business need is required.",
      },
    },

    bidApproach: {
      type: [String],
      required: true,
      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length > 0 &&
          items.every((item) => typeof item === "string" && item.trim()),
        message: "At least one BID approach item is required.",
      },
    },

    resultMetric: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

howWeHelpSchema.index({ isActive: 1, sortOrder: 1 });

const HowWeHelp =
  mongoose.models.HowWeHelp || mongoose.model("HowWeHelp", howWeHelpSchema);

export default HowWeHelp;
