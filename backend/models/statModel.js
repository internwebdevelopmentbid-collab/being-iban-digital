import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },

    suffix: {
      type: String,
      default: "",
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Stat = mongoose.models.Stat || mongoose.model("Stat", statSchema);

export default Stat;
