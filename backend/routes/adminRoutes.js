const express = require("express");

const router = express.Router();

const {
    loginAdmin,
    dashboard,
    viewAllUsers,
    viewAllTeams,
    removeUser,
    removeTeam
} = require("../controllers/adminController");

// Login
router.post("/login", loginAdmin);

// Dashboard
router.get("/dashboard", dashboard);

// Users
router.get("/users", viewAllUsers);
router.delete("/users/:id", removeUser);

// Team
router.get("/teams", viewAllTeams);
router.delete("/teams/:id", removeTeam);

module.exports = router;