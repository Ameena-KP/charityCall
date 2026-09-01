const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    createRequest,
    getMyRequests,
    viewPendingRequests,
    approveOrRejectRequest,
    viewApprovedRequests
} = require("../controllers/charityRequestController");

router.post(
"/",
authMiddleware,upload.single("document"),createRequest);
router.get("/my-requests", authMiddleware, getMyRequests);
router.get("/pending", authMiddleware, viewPendingRequests);
router.put("/:id/status", authMiddleware, approveOrRejectRequest);
router.get("/approved",viewApprovedRequests);

module.exports = router;