
const {
    createDonation,
    getMyDonations,
    getAllDonations,
    updateDonationStatus
} = require("../models/donationModel");

const donateItem = (req, res) => {

    const {
        donor_id,
        request_id,
        item_name,
        quantity
    } = req.body;

    // Check if all fields are provided
    if (!donor_id || !request_id || !item_name || !quantity) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    createDonation(req.body, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.status(201).json({
            success: true,
            message: "Item donated successfully"
        });

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
    viewAllDonations,
    completeDonation
};