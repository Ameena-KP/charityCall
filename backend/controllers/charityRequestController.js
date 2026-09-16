const {
    createCharityRequest,
    getUserRequests,
    getPendingRequests,
    updateRequestStatus,
    getApprovedRequests,
    getAllRequests,
    deleteRequestById
} = require("../models/charityRequestModel");

const createRequest = (req, res) => {
    const user_id = req.user.id;
    const { category, title, description, required_items } = req.body;
    const document = req.file ? req.file.filename : null;

    if (!category || !title || !description) {
        return res.status(400).json({
            success: false,
            message: "Category, Title, and Description are required"
        });
    }

    createCharityRequest(
        {
            user_id,
            category,
            title,
            description,
            document,
            required_items: required_items || null
        },
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Charity Request Submitted Successfully! Our verification team will review your application."
            });
        }
    );
};

const getMyRequests = (req, res) => {
    const userId = req.user.id;

    getUserRequests(userId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            totalRequests: result.length,
            requests: result
        });
    });
};

const viewPendingRequests = (req, res) => {
    getPendingRequests((err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            totalRequests: result.length,
            requests: result
        });
    });
};

const approveOrRejectRequest = (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;

    if (status !== "Approved" && status !== "Rejected") {
        return res.status(400).json({
            success: false,
            message: "Status must be Approved or Rejected"
        });
    }

    updateRequestStatus(requestId, status, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Request ${status} Successfully`
        });
    });
};

const viewApprovedRequests = (req, res) => {
    getApprovedRequests((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            total: results.length,
            data: results
        });
    });
};

const viewAllRequestsAdmin = (req, res) => {
    getAllRequests((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            total: results.length,
            requests: results
        });
    });
};

const deleteRequest = (req, res) => {
    const requestId = req.params.id;
    deleteRequestById(requestId, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Charity request deleted successfully"
        });
    });
};

module.exports = {
    createRequest,
    getMyRequests,
    viewPendingRequests,
    approveOrRejectRequest,
    viewApprovedRequests,
    viewAllRequestsAdmin,
    deleteRequest
};