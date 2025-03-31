import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  if (!token) {
    return { valid: false, message: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, message: error.message };
  }
};
