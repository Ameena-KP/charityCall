const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. No token provided."
        });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token."
        });
    }

    try {

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store user data in request
        req.user = decoded;

        // Continue to next function
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token."
        });

    }

};

module.exports = authMiddleware;