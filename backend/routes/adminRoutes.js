const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    loginAdmin,
    dashboard,
    viewAllUsers,
    blockUser,
    unblockUser,
    viewAllTeams,
    approveTeam,
    rejectTeam,
    removeUser,
    removeTeam,
    sendNotification,
    getNotificationsList,
    viewReports,
    viewFeedback
} = require("../controllers/adminController");

// Public Admin Auth
router.post("/login", loginAdmin);

// Dashboard
router.get("/dashboard", authMiddleware, dashboard);

// Users Management
router.get("/users", authMiddleware, viewAllUsers);
router.put("/users/:id/block", authMiddleware, blockUser);
router.put("/users/:id/unblock", authMiddleware, unblockUser);
router.delete("/users/:id", authMiddleware, removeUser);

// Teams Management & Approvals
router.get("/teams", authMiddleware, viewAllTeams);
router.put("/teams/:id/approve", authMiddleware, approveTeam);
router.put("/teams/:id/reject", authMiddleware, rejectTeam);
router.delete("/teams/:id", authMiddleware, removeTeam);

// Notifications
router.post("/notifications", authMiddleware, sendNotification);
router.get("/notifications", authMiddleware, getNotificationsList);

// Reports
router.get("/reports", authMiddleware, viewReports);

// User Feedback
router.get("/feedback", authMiddleware, viewFeedback);

module.exports = router;