const db = require("../config/db");

const createCharityRequest = (requestData, callback) => {
    const sql = `
        INSERT INTO charity_requests
        (user_id, category, title, description, document, required_items)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            requestData.user_id,
            requestData.category,
            requestData.title,
            requestData.description,
            requestData.document,
            requestData.required_items
        ],
        callback
    );
};

const getUserRequests = (userId, callback) => {
    const sql = `
        SELECT
            id,
            category,
            title,
            description,
            document,
            required_items,
            status,
            created_at
        FROM charity_requests
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], callback);
};

const getPendingRequests = (callback) => {
    const sql = `
        SELECT
            charity_requests.id,
            charity_requests.user_id,
            users.name,
            users.email,
            users.phone,
            users.address,
            charity_requests.category,
            charity_requests.title,
            charity_requests.description,
            charity_requests.document,
            charity_requests.required_items,
            charity_requests.status,
            charity_requests.created_at
        FROM charity_requests
        INNER JOIN users ON charity_requests.user_id = users.id
        WHERE charity_requests.status = 'Pending'
        ORDER BY charity_requests.created_at DESC
    `;

    db.query(sql, callback);
};

const updateRequestStatus = (requestId, status, callback) => {
    const sql = `
        UPDATE charity_requests
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, requestId], callback);
};

const getApprovedRequests = (callback) => {
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
            users.phone AS user_phone,
            users.address AS user_address
        FROM charity_requests
        LEFT JOIN users ON charity_requests.user_id = users.id
        WHERE charity_requests.status = 'Approved'
        ORDER BY charity_requests.created_at DESC
    `;

    db.query(sql, callback);
};

const getAllRequests = (callback) => {
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
            users.phone AS user_phone
        FROM charity_requests
        LEFT JOIN users ON charity_requests.user_id = users.id
        ORDER BY charity_requests.created_at DESC
    `;

    db.query(sql, callback);
};

const deleteRequestById = (id, callback) => {
    const sql = `DELETE FROM charity_requests WHERE id = ?`;
    db.query(sql, [id], callback);
};

module.exports = {
    createCharityRequest,
    getUserRequests,
    getPendingRequests,
    updateRequestStatus,
    getApprovedRequests,
    getAllRequests,
    deleteRequestById
};