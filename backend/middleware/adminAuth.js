const jwt = require("jsonwebtoken");

const isAdminAuthenticated = async (req, res, next) => {
  try {
    let adminToken = req.cookies.adminToken;

    if (!adminToken && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      adminToken = req.headers.authorization.split(" ")[1];
    }

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required. Please log in.",
      });
    }

    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    const decoded = jwt.verify(adminToken, secret);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token. Please log in again.",
    });
  }
};

module.exports = { isAdminAuthenticated };
