const db = require("../config/db");

// Create a new published donation offer
const createPublishedDonation = (data, callback) => {
    const sql = `
        INSERT INTO published_donations
        (user_id, title, category, item_name, quantity, item_condition, description, location, contact_phone, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.user_id,
            data.title,
            data.category,
            data.item_name,
            data.quantity || 1,
            data.item_condition || "Good",
            data.description || "",
            data.location || "",
            data.contact_phone || "",
            data.image || null,
            data.status || "Available"
        ],
        callback
    );
};

// Get all published donations (with donor details, optional filters)
const getAllPublishedDonations = (filters = {}, callback) => {
    let sql = `
        SELECT
            pd.id,
            pd.user_id,
            pd.title,
            pd.category,
            pd.item_name,
            pd.quantity,
            pd.item_condition,
            pd.description,
            pd.location,
            pd.contact_phone,
            pd.image,
            pd.status,
            pd.created_at,
            u.name AS donor_name,
            u.email AS donor_email,
            u.phone AS donor_user_phone
        FROM published_donations pd
        JOIN users u ON pd.user_id = u.id
        WHERE 1 = 1
    `;

    const params = [];

    if (filters.exclude_user_id) {
        sql += " AND pd.user_id != ?";
        params.push(filters.exclude_user_id);
    }

    if (filters.status && filters.status !== "All") {
        sql += " AND pd.status = ?";
        params.push(filters.status);
    }

    if (filters.category && filters.category !== "All") {
        sql += " AND pd.category = ?";
        params.push(filters.category);
    }

    if (filters.search && filters.search.trim() !== "") {
        sql += " AND (pd.title LIKE ? OR pd.item_name LIKE ? OR pd.description LIKE ? OR pd.location LIKE ?)";
        const term = `%${filters.search.trim()}%`;
        params.push(term, term, term, term);
    }

    sql += " ORDER BY pd.created_at DESC";

    db.query(sql, params, callback);
};

// Get published donations by a specific user (donor)
const getUserPublishedDonations = (userId, callback) => {
    const sql = `
        SELECT
            id,
            user_id,
            title,
            category,
            item_name,
            quantity,
            item_condition,
            description,
            location,
            contact_phone,
            image,
            status,
            created_at
        FROM published_donations
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], callback);
};

// Get single published donation by ID
const getPublishedDonationById = (id, callback) => {
    const sql = `
        SELECT
            pd.*,
            u.name AS donor_name,
            u.email AS donor_email,
            u.phone AS donor_user_phone
        FROM published_donations pd
        JOIN users u ON pd.user_id = u.id
        WHERE pd.id = ?
    `;

    db.query(sql, [id], callback);
};

// Update an existing published donation
const updatePublishedDonation = (id, userId, data, callback) => {
    const sql = `
        UPDATE published_donations
        SET
            title = ?,
            category = ?,
            item_name = ?,
            quantity = ?,
            item_condition = ?,
            description = ?,
            location = ?,
            contact_phone = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [
            data.title,
            data.category,
            data.item_name,
            data.quantity,
            data.item_condition,
            data.description,
            data.location,
            data.contact_phone,
            id,
            userId
        ],
        callback
    );
};

// Update status of published donation (Available / Reserved / Donated)
const updatePublishedDonationStatus = (id, userId, status, isAdmin = false, callback) => {
    let sql = `
        UPDATE published_donations
        SET status = ?
        WHERE id = ?
    `;
    const params = [status, id];

    if (!isAdmin) {
        sql += " AND user_id = ?";
        params.push(userId);
    }

    db.query(sql, params, callback);
};

// Delete a published donation
const deletePublishedDonation = (id, userId, isAdmin = false, callback) => {
    let sql = "DELETE FROM published_donations WHERE id = ?";
    const params = [id];

    if (!isAdmin) {
        sql += " AND user_id = ?";
        params.push(userId);
    }

    db.query(sql, params, callback);
};

module.exports = {
    createPublishedDonation,
    getAllPublishedDonations,
    getUserPublishedDonations,
    getPublishedDonationById,
    updatePublishedDonation,
    updatePublishedDonationStatus,
    deletePublishedDonation
};
