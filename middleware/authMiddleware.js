import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        console.log("No Authorization header");
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }
    const token = authHeader.split(" ")[1]; 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT Error:", err.name, "-", err.message);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please login again" });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

export default authenticateUser;
