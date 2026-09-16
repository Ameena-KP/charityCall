const jwt = require("jsonwebtoken");
const db = require("../config/db");

const {
    findAdminByEmail,
    getDashboardStats,
    getAllUsers,
    getAllTeams,
    setUserStatus,
    setTeamStatus,
    deleteUser,
    deleteTeam,
    insertNotification,
    getAllNotifications,
    getReportsData,
    getAllFeedback
} = require("../models/adminModel");

// Admin Login
const loginAdmin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    findAdminByEmail(email, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const admin = result[0];

        if (admin.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Admin Login Successful",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: "admin"
            }
        });
    });
};

// Dashboard Stats
const dashboard = (req, res) => {
    getDashboardStats((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            dashboard: result[0]
        });
    });
};

// View All Users
const viewAllUsers = (req, res) => {
    getAllUsers((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            totalUsers: result.length,
            users: result
        });
    });
};

// Block User
const blockUser = (req, res) => {
    const userId = req.params.id;
    setUserStatus(userId, "Blocked", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({
            success: true,
            message: "User blocked successfully"
        });
    });
};

// Unblock User
const unblockUser = (req, res) => {
    const userId = req.params.id;
    setUserStatus(userId, "Active", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({
            success: true,
            message: "User unblocked successfully"
        });
    });
};

// View All Teams
const viewAllTeams = (req, res) => {
    getAllTeams((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            totalTeams: result.length,
            teams: result
        });
    });
};

// Approve Team Registration
const approveTeam = (req, res) => {
    const teamId = req.params.id;
    setTeamStatus(teamId, "Approved", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({
            success: true,
            message: "Team registration approved successfully"
        });
    });
};

// Reject Team Registration
const rejectTeam = (req, res) => {
    const teamId = req.params.id;
    setTeamStatus(teamId, "Rejected", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({
            success: true,
            message: "Team registration rejected"
        });
    });
};

// Delete User
const removeUser = (req, res) => {
    const userId = req.params.id;

    deleteUser(userId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    });
};

// Delete Team Member
const removeTeam = (req, res) => {
    const teamId = req.params.id;

    deleteTeam(teamId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Team member deleted successfully"
        });
    });
};

// Send Notification (to user or broadcast to all)
const sendNotification = (req, res) => {
    const { user_id, message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Notification message is required"
        });
    }

    insertNotification(user_id, message.trim(), (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(201).json({
            success: true,
            message: user_id && user_id !== "all"
                ? "Notification sent to user successfully"
                : "Broadcast notification sent to all users"
        });
    });
};

// Get All Sent Notifications
const getNotificationsList = (req, res) => {
    getAllNotifications((err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({ success: true, notifications: result });
    });
};

// Reports
const viewReports = (req, res) => {
    getReportsData((err, categoryStats) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        getDashboardStats((err, overallStats) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            res.status(200).json({
                success: true,
                summary: overallStats[0],
                categoryBreakdown: categoryStats
            });
        });
    });
};

// View User Feedback
const viewFeedback = (req, res) => {
    getAllFeedback((err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).json({ success: true, feedback: results });
    });
};

module.exports = {
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
};