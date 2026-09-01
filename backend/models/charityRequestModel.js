const db = require("../config/db");

const createCharityRequest = (requestData, callback) => {

    const sql = `
        INSERT INTO charity_requests
        (user_id, category, title, description, document)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            requestData.user_id,
            requestData.category,
            requestData.title,
            requestData.description,
            requestData.document
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
            users.name,
            users.email,
            charity_requests.category,
            charity_requests.title,
            charity_requests.description,
            charity_requests.document,
            charity_requests.status,
            charity_requests.created_at
        FROM charity_requests
        INNER JOIN users
        ON charity_requests.user_id = users.id
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
            id,
            category,
            title,
            description,
            document,
            status,
            created_at
        FROM charity_requests
        WHERE status = 'Approved'
        ORDER BY created_at DESC
    `;

    db.query(sql, callback);

};



module.exports = {
    createCharityRequest,
    getUserRequests,
    getPendingRequests,
    updateRequestStatus,
    getApprovedRequests
};