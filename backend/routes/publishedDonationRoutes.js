const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

const {
    createDonation,
    getAllDonations,
    getMyDonations,
    updateDonation,
    updateStatus,
    deleteDonation
} = require("../controllers/publishedDonationController");

// Optional auth for reading public list
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                req.user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                // Ignore expired/invalid token for public browsing
            }
        }
    }
    next();
};

// Browse all published items
router.get("/", optionalAuth, getAllDonations);

// View my published items
router.get("/my", authMiddleware, getMyDonations);

// Publish a new item to donate
router.post("/", authMiddleware, createDonation);

// Update published item details
router.put("/:id", authMiddleware, updateDonation);

// Update item status
router.patch("/:id/status", authMiddleware, updateStatus);

// Delete published item
router.delete("/:id", authMiddleware, deleteDonation);

module.exports = router;
