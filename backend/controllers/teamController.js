const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const {
    createTeam,
    findTeamByEmail,
    findTeamById,
    updateRequestCategory
} = require("../models/teamModel");

// Team Registration (Defaults to 'Pending' approval)
const registerTeam = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields (name, email, phone, password) are required"
        });
    }

    findTeamByEmail(email, async (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: "A team account with this email already exists"
            });
        }

        // Store password
        const hashedPassword = await bcrypt.hash(password, 10);

        createTeam(
            { name, email, phone, password: hashedPassword },
            (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }
                res.status(201).json({
                    success: true,
                    message: "Team registration submitted successfully! Your account is pending admin approval before you can log in."
                });
            }
        );
    });
};

// Team Login (Requires status === 'Approved')
const loginTeam = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    findTeamByEmail(email, async (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Team account not found"
            });
        }

        const team = result[0];

        // Check password (supports hashed or plaintext legacy)
        let isMatch = false;
        if (team.password.startsWith("$2b$") || team.password.startsWith("$2a$")) {
            isMatch = await bcrypt.compare(password, team.password);
        } else {
            isMatch = (team.password === password);
        }

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Check verification status
        if (team.status === "Pending") {
            return res.status(403).json({
                success: false,
                message: "Your team account is pending administrator approval. Please check back later."
            });
        }

        if (team.status === "Rejected") {
            return res.status(403).json({
                success: false,
                message: "Your team registration was rejected by administrator."
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
            token,
            user: {
                id: team.id,
                name: team.name,
                email: team.email,
                phone: team.phone,
                role: "team",
                status: team.status
            }
        });
    });
};

// Approve Charity Request
const approveRequest = (req, res) => {
    const id = req.params.id;
    const { category } = req.body;

    let sql = `UPDATE charity_requests SET status='Approved' WHERE id=?`;
    let params = [id];

    if (category) {
        sql = `UPDATE charity_requests SET status='Approved', category=? WHERE id=?`;
        params = [category, id];
    }

    db.query(sql, params, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({
            success: true,
            message: "Request Approved Successfully and published for donors."
        });
    });
};

// Reject Charity Request
const rejectRequest = (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE charity_requests SET status='Rejected' WHERE id=?`;

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({
            success: true,
            message: "Request Rejected Successfully."
        });
    });
};

// Update Request Category
const updateCategory = (req, res) => {
    const id = req.params.id;
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
    }

    updateRequestCategory(id, category, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Category updated successfully" });
    });
};

// Get Pending Requests with User verification details
const getPendingRequests = (req, res) => {
    const sql = `
        SELECT
            charity_requests.id,
            charity_requests.user_id,
            charity_requests.category,
            charity_requests.title,
            charity_requests.description,
            charity_requests.document,
            charity_requests.required_items,
            charity_requests.status,
            charity_requests.created_at,
            users.name AS user_name,
            users.email AS user_email,
            users.phone AS user_phone,
            users.address AS user_address,
            users.status AS user_status
        FROM charity_requests
        LEFT JOIN users ON charity_requests.user_id = users.id
        WHERE charity_requests.status = 'Pending'
        ORDER BY charity_requests.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({
            success: true,
            total: result.length,
            requests: result
        });
    });
};

// Get All Approved Requests for Team Monitoring
const getApprovedRequests = (req, res) => {
    const sql = `
        SELECT
            charity_requests.id,
            charity_requests.user_id,
            charity_requests.category,
            charity_requests.title,
            charity_requests.description,
            charity_requests.document,
            charity_requests.required_items,
            charity_requests.status,
            charity_requests.created_at,
            users.name AS user_name,
            users.email AS user_email,
            users.phone AS user_phone,
            users.address AS user_address
        FROM charity_requests
        LEFT JOIN users ON charity_requests.user_id = users.id
        WHERE charity_requests.status = 'Approved'
        ORDER BY charity_requests.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({
            success: true,
            total: result.length,
            requests: result
        });
    });
};

module.exports = {
    registerTeam,
    loginTeam,
    getPendingRequests,
    getApprovedRequests,
    approveRequest,
    rejectRequest,
    updateCategory
};