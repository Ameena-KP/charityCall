const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createRequest,
    getMyRequests,
    viewPendingRequests,
    approveOrRejectRequest,
    viewApprovedRequests,
    viewAllRequestsAdmin,
    deleteRequest
} = require("../controllers/charityRequestController");

// Public / User Routes
router.post("/", authMiddleware, upload.single("document"), createRequest);
router.get("/my-requests", authMiddleware, getMyRequests);
router.get("/approved", viewApprovedRequests);

// Team / Admin Review Routes
router.get("/pending", authMiddleware, viewPendingRequests);
router.put("/:id/status", authMiddleware, approveOrRejectRequest);
router.get("/all", authMiddleware, viewAllRequestsAdmin);
router.delete("/:id", authMiddleware, deleteRequest);

module.exports = router;