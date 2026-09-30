import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER and EMAIL_PASS are not configured in .env");
    }

    if (typeof to !== "string" || !to.trim()) {
      throw new Error("Recipient email address is required.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Being Iban Digital" <${process.env.EMAIL_USER}>`,
      to: to.trim(),
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);

    return true;
  } catch (error) {
    console.error("Email sending error:", error);

    throw new Error("Unable to send email");
  }
};

export default sendEmail;
