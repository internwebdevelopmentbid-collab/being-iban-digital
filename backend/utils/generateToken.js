import jwt from "jsonwebtoken";

const generateToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (!adminId) {
    throw new Error("Admin ID is required to generate token");
  }

  return jwt.sign(
    {
      id: adminId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export default generateToken;
