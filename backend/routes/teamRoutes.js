const express = require("express");
const {
    viewAllDonations,
    completeDonation
} = require("../controllers/donationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
    loginTeam
} = require("../controllers/teamController");

const {

    getPendingRequests,
    approveRequest,
    rejectRequest

} = require("../controllers/teamController");


router.post("/login", loginTeam);
router.get(
    "/donations",
    authMiddleware,
    viewAllDonations
);

router.put(
    "/donations/:id",
    authMiddleware,
    completeDonation
);

router.get("/pending", getPendingRequests);
router.put("/approve/:id", approveRequest);

router.put("/reject/:id", rejectRequest);

module.exports = router;