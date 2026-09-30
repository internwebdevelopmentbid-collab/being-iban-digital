import mongoose from "mongoose";

const PACKAGE_OPTIONS = ["Build", "Dominate", "Improve"];

const ADDITIONAL_SERVICE_OPTIONS = [
  "Website Development",
  "Graphics Designing",
  "App Development",
  "Content Marketing",
  "E-Commerce Website",
  "SEO Services",
  "Google Ads Management",
  "LinkedIn / YouTube Marketing",
  "Photography & Videography",
  "Meta Ads Marketing",
  "Influencer Marketing",
  "Social Media Marketing",
  "GMB Profile Setup",
];

const meetingSchema = new mongoose.Schema(
  {
    // =====================================================
    // CLIENT DETAILS
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // SERVICE SELECTION
    // =====================================================

    package: {
      type: String,
      enum: PACKAGE_OPTIONS,
      default: null,
    },

    additionalServices: {
      type: [String],
      enum: ADDITIONAL_SERVICE_OPTIONS,
      default: [],
    },

    // =====================================================
    // CLIENT MESSAGE
    // =====================================================

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // ENQUIRY META
    // =====================================================

    subject: {
      type: String,
      trim: true,
      default: "New Project Enquiry",
    },

    // =====================================================
    // ADMIN CRM
    // =====================================================

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "scheduled",
        "in-progress",
        "completed",
        "cancelled",
        "closed",
        "spam",
      ],
      default: "new",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    lastContactedAt: {
      type: Date,
      default: null,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Meeting =
  mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);

export default Meeting;
