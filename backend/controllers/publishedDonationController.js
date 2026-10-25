const publishedDonationModel = require("../models/publishedDonationModel");

// Create a new published donation
const createDonation = (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.body.user_id;
        const {
            title,
            category,
            item_name,
            quantity,
            item_condition,
            description,
            location,
            contact_phone,
            image,
            status
        } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required to publish donations."
            });
        }

        if (!title || !category || !item_name) {
            return res.status(400).json({
                success: false,
                message: "Title, category, and item name are required."
            });
        }

        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 5 || trimmedTitle.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title must be between 5 and 150 characters."
            });
        }

        const trimmedItem = item_name.trim();
        if (trimmedItem.length < 2 || trimmedItem.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Item name must be between 2 and 100 characters."
            });
        }

        const parsedQty = Number(quantity);
        if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 10000) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a valid number between 1 and 10,000."
            });
        }

        let cleanPhone = "";
        if (contact_phone) {
            cleanPhone = contact_phone.toString().replace(/\D/g, "");
            if (cleanPhone.length !== 10) {
                return res.status(400).json({
                    success: false,
                    message: "Contact phone must be exactly 10 digits."
                });
            }
        }

        const data = {
            user_id: userId,
            title: trimmedTitle,
            category: category.trim(),
            item_name: trimmedItem,
            quantity: parsedQty,
            item_condition: item_condition || "Good",
            description: description ? description.trim() : "",
            location: location ? location.trim() : "",
            contact_phone: cleanPhone,
            image: image || null,
            status: status || "Available"
        };

        publishedDonationModel.createPublishedDonation(data, (err, result) => {
            if (err) {
                console.error("Error creating published donation:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error while saving donation offer."
                });
            }

            res.status(201).json({
                success: true,
                message: "Donation item published successfully!",
                donationId: result.insertId
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Get all published donations with optional filtering
const getAllDonations = (req, res) => {
    try {
        const { category, status, search, exclude_user_id } = req.query;
        // Don't exclude for admin, but exclude current user's items for regular users or if specified
        const excludeUserId = (req.user && req.user.role === "admin")
            ? (exclude_user_id || null)
            : (req.user ? req.user.id : (exclude_user_id || null));

        publishedDonationModel.getAllPublishedDonations(
            { category, status, search, exclude_user_id: excludeUserId },
            (err, results) => {
                if (err) {
                    console.error("Error fetching published donations:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to fetch published donations."
                    });
                }

                res.status(200).json({
                    success: true,
                    count: results.length,
                    data: results
                });
            }
        );
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Get items published by the logged-in user
const getMyDonations = (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.query.user_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required."
            });
        }

        publishedDonationModel.getUserPublishedDonations(userId, (err, results) => {
            if (err) {
                console.error("Error fetching user's published donations:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch your published donations."
                });
            }

            res.status(200).json({
                success: true,
                count: results.length,
                data: results
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Update an existing published donation
const updateDonation = (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.body.user_id;
        const { id } = req.params;
        const {
            title,
            category,
            item_name,
            quantity,
            item_condition,
            description,
            location,
            contact_phone
        } = req.body;

        if (!title || !category || !item_name) {
            return res.status(400).json({
                success: false,
                message: "Title, category, and item name are required."
            });
        }

        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 5 || trimmedTitle.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title must be between 5 and 150 characters."
            });
        }

        const trimmedItem = item_name.trim();
        if (trimmedItem.length < 2 || trimmedItem.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Item name must be between 2 and 100 characters."
            });
        }

        const parsedQty = Number(quantity);
        if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 10000) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a valid number between 1 and 10,000."
            });
        }

        let cleanPhone = "";
        if (contact_phone) {
            cleanPhone = contact_phone.toString().replace(/\D/g, "");
            if (cleanPhone.length !== 10) {
                return res.status(400).json({
                    success: false,
                    message: "Contact phone must be exactly 10 digits."
                });
            }
        }

        const data = {
            title: trimmedTitle,
            category: category.trim(),
            item_name: trimmedItem,
            quantity: parsedQty,
            item_condition: item_condition || "Good",
            description: description ? description.trim() : "",
            location: location ? location.trim() : "",
            contact_phone: cleanPhone
        };

        publishedDonationModel.updatePublishedDonation(id, userId, data, (err, result) => {
            if (err) {
                console.error("Error updating published donation:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update donation item."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Donation item not found or you are not authorized to edit it."
                });
            }

            res.status(200).json({
                success: true,
                message: "Donation item updated successfully!"
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Update donation status (Available / Reserved / Donated)
const updateStatus = (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.body.user_id;
        const role = req.user ? req.user.role : null;
        const isAdmin = role === "admin" || role === "team";
        const { id } = req.params;
        const { status } = req.body;

        if (!["Available", "Reserved", "Donated"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed: Available, Reserved, Donated."
            });
        }

        publishedDonationModel.updatePublishedDonationStatus(id, userId, status, isAdmin, (err, result) => {
            if (err) {
                console.error("Error updating donation status:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update status."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Donation item not found or unauthorized."
                });
            }

            res.status(200).json({
                success: true,
                message: `Donation item marked as ${status}!`
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Delete a published donation
const deleteDonation = (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.body.user_id;
        const role = req.user ? req.user.role : null;
        const isAdmin = role === "admin";
        const { id } = req.params;

        publishedDonationModel.deletePublishedDonation(id, userId, isAdmin, (err, result) => {
            if (err) {
                console.error("Error deleting donation item:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete donation item."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Donation item not found or unauthorized."
                });
            }

            res.status(200).json({
                success: true,
                message: "Donation item removed successfully."
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    createDonation,
    getAllDonations,
    getMyDonations,
    updateDonation,
    updateStatus,
    deleteDonation
};
