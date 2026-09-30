import Meeting from "../models/meetingModel.js";
import sendEmail from "../utils/email.js";

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

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "scheduled",
  "in-progress",
  "completed",
  "cancelled",
  "closed",
  "spam",
];

// =====================================================
// HELPERS
// =====================================================

const normalizePackage = (selectedPackage) => {
  if (
    selectedPackage === undefined ||
    selectedPackage === null ||
    selectedPackage === ""
  ) {
    return {
      value: null,
    };
  }

  if (!PACKAGE_OPTIONS.includes(selectedPackage)) {
    return {
      error: "Invalid package selected.",
    };
  }

  return {
    value: selectedPackage,
  };
};

const normalizeAdditionalServices = (additionalServices) => {
  if (additionalServices === undefined || additionalServices === null) {
    return {
      value: [],
    };
  }

  if (!Array.isArray(additionalServices)) {
    return {
      error: "Additional services must be an array.",
    };
  }

  const normalized = [
    ...new Set(
      additionalServices.map((service) =>
        typeof service === "string" ? service.trim() : service,
      ),
    ),
  ];

  const invalidServices = normalized.filter(
    (service) => !ADDITIONAL_SERVICE_OPTIONS.includes(service),
  );

  if (invalidServices.length > 0) {
    return {
      error: "One or more additional services are invalid.",
      invalidServices,
    };
  }

  return {
    value: normalized,
  };
};

const validateSelection = (selectedPackage, additionalServices) => {
  if (!selectedPackage && additionalServices.length === 0) {
    return false;
  }

  return true;
};

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
};

// =====================================================
// HTML ESCAPING
// =====================================================

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// =====================================================
// EMAIL HTML
// =====================================================

const createConfirmationEmail = ({
  name,
  email,
  phone,
  selectedPackage,
  additionalServices,
  message,
}) => {
  const packageText = selectedPackage || "Not selected";

  const servicesHtml =
    additionalServices.length > 0
      ? additionalServices
          .map(
            (service) => `
              <li
                style="
                  margin:0 0 8px;
                  color:#333333;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                ${escapeHtml(service)}
              </li>
            `,
          )
          .join("")
      : `
          <li
            style="
              margin:0;
              color:#777777;
              font-size:14px;
              line-height:1.6;
            "
          >
            None selected
          </li>
        `;

  const messageHtml =
    message && message.trim()
      ? escapeHtml(message).replace(/\n/g, "<br />")
      : "No additional message provided.";

  return `
<!DOCTYPE html>

<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Thank You - IBAN Digital
  </title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#080907;
    font-family:Arial,Helvetica,sans-serif;
    color:#171814;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:#080907;
      padding:40px 20px;
    "
  >

    <tr>

      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:680px;
            background:#f5f3ee;
            border:1px solid #c9a66b;
          "
        >

          <!-- HEADER -->

          <tr>

            <td
              style="
                padding:36px 40px 28px;
                border-bottom:1px solid #ded9cf;
              "
            >

              <div
                style="
                  color:#8c653c;
                  font-size:10px;
                  font-weight:bold;
                  letter-spacing:4px;
                  text-transform:uppercase;
                  margin-bottom:18px;
                "
              >
                IBAN Digital
              </div>

              <div
                style="
                  color:#171814;
                  font-size:34px;
                  line-height:1.08;
                  font-weight:400;
                  letter-spacing:-1.5px;
                "
              >
                Thank you for
                your submission.
              </div>

            </td>

          </tr>

          <!-- INTRO -->

          <tr>

            <td
              style="
                padding:34px 40px 10px;
              "
            >

              <p
                style="
                  margin:0 0 16px;
                  color:#171814;
                  font-size:17px;
                  line-height:1.6;
                "
              >
                Hi ${escapeHtml(name)},
              </p>

              <p
                style="
                  margin:0;
                  color:#55534d;
                  font-size:14px;
                  line-height:1.8;
                "
              >
                Thank you for reaching out
                to IBAN Digital. We have
                received your project enquiry
                successfully.
              </p>

            </td>

          </tr>

          <!-- DETAILS -->

          <tr>

            <td
              style="
                padding:30px 40px;
              "
            >

              <div
                style="
                  color:#8c653c;
                  font-size:10px;
                  font-weight:bold;
                  letter-spacing:3px;
                  text-transform:uppercase;
                  margin-bottom:18px;
                "
              >
                Your enquiry
              </div>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  border:1px solid #ded9cf;
                  background:#ffffff;
                "
              >

                <tr>

                  <td
                    width="38%"
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#77736c;
                      font-size:12px;
                    "
                  >
                    Name
                  </td>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#171814;
                      font-size:13px;
                      font-weight:600;
                    "
                  >
                    ${escapeHtml(name)}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#77736c;
                      font-size:12px;
                    "
                  >
                    Email
                  </td>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#171814;
                      font-size:13px;
                    "
                  >
                    ${escapeHtml(email)}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#77736c;
                      font-size:12px;
                    "
                  >
                    Phone
                  </td>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#171814;
                      font-size:13px;
                    "
                  >
                    ${escapeHtml(phone)}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#77736c;
                      font-size:12px;
                    "
                  >
                    Package
                  </td>

                  <td
                    style="
                      padding:14px 16px;
                      border-bottom:1px solid #eeeae3;
                      color:#171814;
                      font-size:13px;
                      font-weight:600;
                    "
                  >
                    ${escapeHtml(packageText)}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding:14px 16px;
                      color:#77736c;
                      font-size:12px;
                      vertical-align:top;
                    "
                  >
                    Additional services
                  </td>

                  <td
                    style="
                      padding:14px 16px;
                      color:#171814;
                      font-size:13px;
                    "
                  >

                    <ul
                      style="
                        margin:0;
                        padding-left:18px;
                      "
                    >
                      ${servicesHtml}
                    </ul>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

          <!-- MESSAGE -->

          <tr>

            <td
              style="
                padding:0 40px 32px;
              "
            >

              <div
                style="
                  color:#8c653c;
                  font-size:10px;
                  font-weight:bold;
                  letter-spacing:3px;
                  text-transform:uppercase;
                  margin-bottom:12px;
                "
              >
                Your message
              </div>

              <div
                style="
                  padding:18px;
                  background:#ffffff;
                  border:1px solid #ded9cf;
                  color:#55534d;
                  font-size:14px;
                  line-height:1.8;
                "
              >
                ${messageHtml}
              </div>

            </td>

          </tr>

          <!-- NEXT STEP -->

          <tr>

            <td
              style="
                padding:0 40px 38px;
              "
            >

              <div
                style="
                  padding:24px;
                  background:#11120f;
                  border-left:3px solid #c9a66b;
                "
              >

                <p
                  style="
                    margin:0;
                    color:#f5f3ee;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  Our team will contact you
                  shortly to discuss your
                  requirements and the next
                  steps.
                </p>

              </div>

            </td>

          </tr>

          <!-- FOOTER -->

          <tr>

            <td
              style="
                padding:24px 40px;
                border-top:1px solid #ded9cf;
              "
            >

              <p
                style="
                  margin:0;
                  color:#8a867e;
                  font-size:11px;
                  line-height:1.7;
                "
              >
                Being IBAN Digital
                <br />
                Strategy · Design · Development · Growth
              </p>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
  `;
};

// =====================================================
// CREATE CUSTOMER ENQUIRY
// =====================================================

/**
 * Public
 * POST /api/meeting
 */
export const createMeeting = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      package: selectedPackage,
      additionalServices,
      message,
      subject,
    } = req.body;

    // =====================================================
    // REQUIRED CLIENT DETAILS
    // =====================================================

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    if (typeof phone !== "string" || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // =====================================================
    // PACKAGE
    // =====================================================

    const packageResult = normalizePackage(selectedPackage);

    if (packageResult.error) {
      return res.status(400).json({
        success: false,
        message: packageResult.error,
      });
    }

    const normalizedPackage = packageResult.value;

    // =====================================================
    // ADDITIONAL SERVICES
    // =====================================================

    const servicesResult = normalizeAdditionalServices(additionalServices);

    if (servicesResult.error) {
      return res.status(400).json({
        success: false,
        message: servicesResult.error,
        ...(servicesResult.invalidServices
          ? {
              invalidServices: servicesResult.invalidServices,
            }
          : {}),
      });
    }

    const normalizedAdditionalServices = servicesResult.value;

    // =====================================================
    // PACKAGE OR SERVICE REQUIRED
    // =====================================================

    if (!validateSelection(normalizedPackage, normalizedAdditionalServices)) {
      return res.status(400).json({
        success: false,
        message: "Please select a package or at least one additional service.",
      });
    }

    // =====================================================
    // CREATE ENQUIRY FIRST
    // =====================================================

    const meeting = await Meeting.create({
      name: name.trim(),

      email: email.trim().toLowerCase(),

      phone: phone.trim(),

      package: normalizedPackage,

      additionalServices: normalizedAdditionalServices,

      message: typeof message === "string" ? message.trim() : "",

      subject:
        typeof subject === "string" && subject.trim()
          ? subject.trim()
          : "New Project Enquiry",

      status: "new",

      tags: [],
    });

    // =====================================================
    // EMAIL
    //
    // IMPORTANT:
    // Email failure does NOT fail the enquiry.
    // =====================================================

    let emailSent = false;

    try {
      const emailHtml = createConfirmationEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        selectedPackage: normalizedPackage,
        additionalServices: normalizedAdditionalServices,
        message: typeof message === "string" ? message.trim() : "",
      });

      await sendEmail(
        email.trim().toLowerCase(),
        "Thank You for Your Project Enquiry — IBAN Digital",
        emailHtml,
      );

      emailSent = true;
    } catch (emailError) {
      emailSent = false;

      console.error("Customer confirmation email failed:", emailError);
    }

    // =====================================================
    // EMAIL STATUS TAG
    // =====================================================

    const emailStatusTag = emailSent ? "email sent" : "email not sent";

    let updatedMeeting = meeting;

    try {
      updatedMeeting = await Meeting.findByIdAndUpdate(
        meeting._id,
        {
          $addToSet: {
            tags: emailStatusTag,
          },
        },
        {
          new: true,
        },
      );
    } catch (tagError) {
      console.error("Unable to add email status tag:", tagError);

      // Keep enquiry submission successful
      // even if the tag update fails.
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message:
        "Your enquiry has been submitted successfully. We'll be in touch soon.",

      emailSent,

      emailStatus: emailSent ? "email sent" : "email not sent",

      meeting: updatedMeeting || meeting,
    });
  } catch (error) {
    console.error("Create customer enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry.",
    });
  }
};

// =====================================================
// CREATE ENQUIRY FROM ADMIN
// =====================================================

/**
 * Admin
 * POST /api/meeting/admin
 */
export const createAdminMeeting = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      package: selectedPackage,
      additionalServices,
      message,
      subject,
      status,
      tags,
      adminNotes,
      assignedTo,
      lastContactedAt,
      scheduledAt,
    } = req.body;

    // =====================================================
    // REQUIRED CLIENT DETAILS
    // =====================================================

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    if (typeof phone !== "string" || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // =====================================================
    // PACKAGE
    // =====================================================

    const packageResult = normalizePackage(selectedPackage);

    if (packageResult.error) {
      return res.status(400).json({
        success: false,
        message: packageResult.error,
      });
    }

    const normalizedPackage = packageResult.value;

    // =====================================================
    // ADDITIONAL SERVICES
    // =====================================================

    const servicesResult = normalizeAdditionalServices(additionalServices);

    if (servicesResult.error) {
      return res.status(400).json({
        success: false,
        message: servicesResult.error,
        ...(servicesResult.invalidServices
          ? {
              invalidServices: servicesResult.invalidServices,
            }
          : {}),
      });
    }

    const normalizedAdditionalServices = servicesResult.value;

    // =====================================================
    // PACKAGE OR SERVICE REQUIRED
    // =====================================================

    if (!validateSelection(normalizedPackage, normalizedAdditionalServices)) {
      return res.status(400).json({
        success: false,
        message: "Please select a package or at least one additional service.",
      });
    }

    // =====================================================
    // STATUS
    // =====================================================

    const normalizedStatus = status || "new";

    if (!STATUS_OPTIONS.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status.",
      });
    }

    // =====================================================
    // CREATE ADMIN ENQUIRY
    // =====================================================

    const meeting = await Meeting.create({
      name: name.trim(),

      email: email.trim().toLowerCase(),

      phone: phone.trim(),

      package: normalizedPackage,

      additionalServices: normalizedAdditionalServices,

      message: typeof message === "string" ? message.trim() : "",

      subject:
        typeof subject === "string" && subject.trim()
          ? subject.trim()
          : "New Project Enquiry",

      status: normalizedStatus,

      tags: normalizeTags(tags),

      adminNotes: typeof adminNotes === "string" ? adminNotes.trim() : "",

      assignedTo: assignedTo || null,

      lastContactedAt: lastContactedAt || null,

      scheduledAt: scheduledAt || null,
    });

    const populatedMeeting = await Meeting.findById(meeting._id).populate(
      "assignedTo",
      "name username role",
    );

    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully.",
      meeting: populatedMeeting,
    });
  } catch (error) {
    console.error("Create admin enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create enquiry.",
    });
  }
};

// =====================================================
// GET ALL ENQUIRIES
// =====================================================

/**
 * Admin
 * GET /api/meeting/admin/all
 */
export const getAllMeetings = async (req, res) => {
  try {
    const {
      status,
      tag,
      search,
      package: selectedPackage,
      additionalService,
    } = req.query;

    const filter = {};

    // =====================================================
    // STATUS
    // =====================================================

    if (status) {
      if (!STATUS_OPTIONS.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid enquiry status.",
        });
      }

      filter.status = status;
    }

    // =====================================================
    // TAG
    // =====================================================

    if (tag) {
      filter.tags = tag;
    }

    // =====================================================
    // PACKAGE
    // =====================================================

    if (selectedPackage) {
      if (!PACKAGE_OPTIONS.includes(selectedPackage)) {
        return res.status(400).json({
          success: false,
          message: "Invalid package filter.",
        });
      }

      filter.package = selectedPackage;
    }

    // =====================================================
    // ADDITIONAL SERVICE
    // =====================================================

    if (additionalService) {
      if (!ADDITIONAL_SERVICE_OPTIONS.includes(additionalService)) {
        return res.status(400).json({
          success: false,
          message: "Invalid additional service filter.",
        });
      }

      filter.additionalServices = additionalService;
    }

    // =====================================================
    // SEARCH
    // =====================================================

    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        {
          name: searchRegex,
        },
        {
          email: searchRegex,
        },
        {
          phone: searchRegex,
        },
        {
          subject: searchRegex,
        },
        {
          message: searchRegex,
        },
        {
          package: searchRegex,
        },
        {
          additionalServices: searchRegex,
        },
        {
          tags: searchRegex,
        },
      ];
    }

    // =====================================================
    // FETCH
    // =====================================================

    const meetings = await Meeting.find(filter)
      .populate("assignedTo", "name username role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("Get all enquiries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiries.",
    });
  }
};

// =====================================================
// GET SINGLE ENQUIRY
// =====================================================

/**
 * Admin
 * GET /api/meeting/admin/:id
 */
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id).populate(
      "assignedTo",
      "name username role",
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Get enquiry by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiry.",
    });
  }
};

// =====================================================
// UPDATE ENQUIRY
// =====================================================

/**
 * Admin
 * PATCH /api/meeting/admin/:id
 */
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMeeting = await Meeting.findById(id);

    if (!existingMeeting) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    const allowedFields = [
      "status",
      "tags",
      "adminNotes",
      "assignedTo",
      "lastContactedAt",
      "scheduledAt",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // =====================================================
    // STATUS
    // =====================================================

    if (updateData.status !== undefined) {
      if (!STATUS_OPTIONS.includes(updateData.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid enquiry status.",
        });
      }
    }

    // =====================================================
    // TAGS
    // =====================================================

    if (updateData.tags !== undefined) {
      if (!Array.isArray(updateData.tags)) {
        return res.status(400).json({
          success: false,
          message: "Tags must be an array.",
        });
      }

      updateData.tags = normalizeTags(updateData.tags);
    }

    // =====================================================
    // PACKAGE UPDATE
    // =====================================================

    let nextPackage = existingMeeting.package;

    if (req.body.package !== undefined) {
      const packageResult = normalizePackage(req.body.package);

      if (packageResult.error) {
        return res.status(400).json({
          success: false,
          message: packageResult.error,
        });
      }

      nextPackage = packageResult.value;

      updateData.package = nextPackage;
    }

    // =====================================================
    // ADDITIONAL SERVICES UPDATE
    // =====================================================

    let nextAdditionalServices = existingMeeting.additionalServices || [];

    if (req.body.additionalServices !== undefined) {
      const servicesResult = normalizeAdditionalServices(
        req.body.additionalServices,
      );

      if (servicesResult.error) {
        return res.status(400).json({
          success: false,
          message: servicesResult.error,
          ...(servicesResult.invalidServices
            ? {
                invalidServices: servicesResult.invalidServices,
              }
            : {}),
        });
      }

      nextAdditionalServices = servicesResult.value;

      updateData.additionalServices = nextAdditionalServices;
    }

    // =====================================================
    // PACKAGE OR SERVICE MUST REMAIN
    // =====================================================

    if (!validateSelection(nextPackage, nextAdditionalServices)) {
      return res.status(400).json({
        success: false,
        message:
          "An enquiry must have a package or at least one additional service.",
      });
    }

    // =====================================================
    // UPDATE
    // =====================================================

    const meeting = await Meeting.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "name username role");

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully.",
      meeting,
    });
  } catch (error) {
    console.error("Update enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update enquiry.",
    });
  }
};

// =====================================================
// DELETE ENQUIRY
// =====================================================

/**
 * Admin
 * DELETE /api/meeting/admin/:id
 */
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete enquiry.",
    });
  }
};
