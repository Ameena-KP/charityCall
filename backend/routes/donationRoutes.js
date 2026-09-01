const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    donateItem,
    viewMyDonations
} = require("../controllers/donationController");

// Donate an item
router.post("/", donateItem);

// View logged-in donor's donation history
router.get(
    "/my",
    authMiddleware,
    viewMyDonations
);

module.exports = router;