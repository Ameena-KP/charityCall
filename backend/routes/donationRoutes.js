const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    donateItem,
    viewMyDonations,
    viewReceivedDonations,
    viewAllDonations,
    completeDonation
} = require("../controllers/donationController");

// Donate an item (User)
router.post("/", authMiddleware, donateItem);

// View logged-in donor's donation history (User)
router.get("/my", authMiddleware, viewMyDonations);

// View donations received for requests submitted by logged-in user (User / Receiver)
router.get("/received", authMiddleware, viewReceivedDonations);

// View all donations across the system (Admin & Team)
router.get("/all", authMiddleware, viewAllDonations);

// Update status to Completed (Team & Admin)
router.put("/:id/complete", authMiddleware, completeDonation);

module.exports = router;