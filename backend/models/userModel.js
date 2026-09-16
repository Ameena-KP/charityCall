const db = require("../config/db");

// Create User
const createUser = (userData, callback) => {

    const sql = `
        INSERT INTO users (name, email, phone, password, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userData.name,
            userData.email,
            userData.phone,
            userData.password,
            userData.address
        ],
        callback
    );
};

// Find User By Email
const findUserByEmail = (email, callback) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

const findUserById = (id, callback) => {

    const sql = `
        SELECT id, name, email, phone, address, status, role, created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

};

const updateUserProfile = (userData, callback) => {

    const sql = `
        UPDATE users
        SET
            name = ?,
            phone = ?,
            address = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            userData.name,
            userData.phone,
            userData.address,
            userData.id
        ],
        callback
    );

};

const getUserNotifications = (userId, callback) => {
    const sql = `
        SELECT id, user_id, message, status, created_at
        FROM notifications
        WHERE user_id = ? OR user_id IS NULL
        ORDER BY created_at DESC
    `;
    db.query(sql, [userId], callback);
};

const markNotificationAsRead = (notifId, callback) => {
    const sql = `
        UPDATE notifications
        SET status = 'Read'
        WHERE id = ?
    `;
    db.query(sql, [notifId], callback);
};

const saveFeedback = (userId, message, callback) => {
    const sql = `
        INSERT INTO feedback (user_id, message)
        VALUES (?, ?)
    `;
    db.query(sql, [userId, message], callback);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserProfile,
    getUserNotifications,
    markNotificationAsRead,
    saveFeedback
};