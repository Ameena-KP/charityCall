const db = require("../config/db");
const {
    createDonation,
    getMyDonations,
    getReceivedDonations,
    getAllDonations,
    updateDonationStatus
} = require("../models/donationModel");

const donateItem = (req, res) => {
    const donor_id = req.user ? req.user.id : req.body.donor_id;
    const { request_id, item_name, quantity } = req.body;

    if (!donor_id || !request_id || !item_name || !quantity) {
        return res.status(400).json({
            success: false,
            message: "Request ID, item name, and quantity are required"
        });
    }

    // Verify charity request exists and prevent user from donating to their own request
    const checkSql = "SELECT user_id FROM charity_requests WHERE id = ?";
    db.query(checkSql, [request_id], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Charity request not found"
            });
        }

        if (Number(rows[0].user_id) === Number(donor_id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot donate to your own charity request."
            });
        }

        createDonation(
            {
                donor_id,
                request_id,
                item_name,
                quantity
            },
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Thank you! Your donation pledge has been recorded."
                });
            }
        );
    });
};

const viewMyDonations = (req, res) => {
    const donorId = req.user.id;

    getMyDonations(donorId, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            total: results.length,
            donations: results
        });
    });
};

const viewReceivedDonations = (req, res) => {
    const receiverId = req.user.id;

    getReceivedDonations(receiverId, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            total: results.length,
            donations: results
        });
    });
};

const viewAllDonations = (req, res) => {
    getAllDonations((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            total: results.length,
            donations: results
        });
    });
};

const completeDonation = (req, res) => {
    const donationId = req.params.id;

    updateDonationStatus(donationId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Donation marked as Completed"
        });
    });
};

module.exports = {
    donateItem,
    viewMyDonations,
    viewReceivedDonations,
    viewAllDonations,
    completeDonation
};