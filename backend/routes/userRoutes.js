const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getNotifications,
    markNotificationRead,
    submitFeedback
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Notifications
router.get("/notifications", authMiddleware, getNotifications);
router.put("/notifications/:id/read", authMiddleware, markNotificationRead);

// Feedback
router.post("/feedback", authMiddleware, submitFeedback);

module.exports = router;