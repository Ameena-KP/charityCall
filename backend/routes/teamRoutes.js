const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    registerTeam,
    loginTeam,
    getPendingRequests,
    getApprovedRequests,
    approveRequest,
    rejectRequest,
    updateCategory
} = require("../controllers/teamController");

const {
    viewAllDonations,
    completeDonation
} = require("../controllers/donationController");

// Authentication
router.post("/register", registerTeam);
router.post("/login", loginTeam);

// Verification Queue & Requests
router.get("/pending", authMiddleware, getPendingRequests);
router.get("/approved", authMiddleware, getApprovedRequests);
router.put("/approve/:id", authMiddleware, approveRequest);
router.put("/reject/:id", authMiddleware, rejectRequest);
router.put("/category/:id", authMiddleware, updateCategory);

// Donations
router.get("/donations", authMiddleware, viewAllDonations);
router.put("/donations/:id", authMiddleware, completeDonation);

module.exports = router;