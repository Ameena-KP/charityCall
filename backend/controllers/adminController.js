const jwt = require("jsonwebtoken");
const db = require("../config/db");

const {
    findAdminByEmail,
    getDashboardStats,
    getAllUsers,
    getAllTeams,
    deleteUser,
    deleteTeam
} = require("../models/adminModel");

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
            token
        });

    });

};

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



module.exports = {
    loginAdmin,
    dashboard,
    viewAllUsers,
    viewAllTeams,
    removeUser,
    removeTeam
};