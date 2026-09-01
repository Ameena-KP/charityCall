const jwt = require("jsonwebtoken");
const db = require("../config/db");


const {
    findTeamByEmail
} = require("../models/teamModel");

const loginTeam = (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });

    }

    findTeamByEmail(email, (err, result) => {

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

        const team = result[0];

        if (team.password !== password) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(
            {
                id: team.id,
                email: team.email,
                role: "team"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Team Login Successful",
            token
        });

    });

};
const approveRequest = (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE charity_requests
        SET status='Approved'
        WHERE id=?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Request Approved Successfully"
        });

    });

};

const rejectRequest = (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE charity_requests
        SET status='Rejected'
        WHERE id=?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Request Rejected Successfully"
        });

    });

};

// Get Pending Requests
const getPendingRequests = (req, res) => {

    const sql = `
        SELECT *
        FROM charity_requests
        WHERE status='Pending'
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};


module.exports = {
    getPendingRequests,
    approveRequest,
    rejectRequest,
    loginTeam
};