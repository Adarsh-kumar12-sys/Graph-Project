// import jwt from "jsonwebtoken";

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// export default authMiddleware;
module.exports = authMiddleware; // Use CommonJS export for compatibility
// Note: If you are using ES6 modules, you can replace the above line with:
