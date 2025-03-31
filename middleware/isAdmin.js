import { verifyToken } from "../services/verifyToken.services.js";
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }
  const token = authHeader.split(" ")[1];
  const verification = verifyToken(token);
  console.log("Token Verification:", verification);
  if (!verification.valid) {
    return res.status(401).json({ message: verification.message });
  }
  if (verification.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  req.user = verification.user;
  next();
};
