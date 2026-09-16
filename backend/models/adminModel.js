const db = require("../config/db");

const findAdminByEmail = (email, callback) => {
    const sql = `
        SELECT *
        FROM admins
        WHERE email = ?
    `;
    db.query(sql, [email], callback);
};

const getDashboardStats = (callback) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT COUNT(*) FROM users WHERE status = 'Blocked') AS blockedUsers,
            (SELECT COUNT(*) FROM teams) AS totalTeams,
            (SELECT COUNT(*) FROM teams WHERE status = 'Pending') AS pendingTeams,
            (SELECT COUNT(*) FROM teams WHERE status = 'Approved') AS approvedTeams,
            (SELECT COUNT(*) FROM charity_requests) AS totalRequests,
            (SELECT COUNT(*) FROM charity_requests WHERE status = 'Pending') AS pendingRequests,
            (SELECT COUNT(*) FROM charity_requests WHERE status = 'Approved') AS approvedRequests,
            (SELECT COUNT(*) FROM charity_requests WHERE status = 'Rejected') AS rejectedRequests,
            (SELECT COUNT(*) FROM donations) AS totalDonations,
            (SELECT COUNT(*) FROM donations WHERE donation_status = 'Completed') AS completedDonations,
            (SELECT COUNT(*) FROM feedback) AS totalFeedback
    `;
    db.query(sql, callback);
};

const getAllUsers = (callback) => {
    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            address,
            status,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;
    db.query(sql, callback);
};

const getAllTeams = (callback) => {
    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            status,
            created_at
        FROM teams
        ORDER BY created_at DESC
    `;
    db.query(sql, callback);
};

const setUserStatus = (userId, status, callback) => {
    const sql = `
        UPDATE users
        SET status = ?
        WHERE id = ?
    `;
    db.query(sql, [status, userId], callback);
};

const setTeamStatus = (teamId, status, callback) => {
    const sql = `
        UPDATE teams
        SET status = ?
        WHERE id = ?
    `;
    db.query(sql, [status, teamId], callback);
};

const deleteUser = (userId, callback) => {
    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;
    db.query(sql, [userId], callback);
};

const deleteTeam = (teamId, callback) => {
    const sql = `
        DELETE FROM teams
        WHERE id = ?
    `;
    db.query(sql, [teamId], callback);
};

const insertNotification = (userId, message, callback) => {
    // If userId is 'all' or null, insert with user_id = null (broadcast to all)
    const targetId = (!userId || userId === "all") ? null : userId;
    const sql = `
        INSERT INTO notifications (user_id, message, status)
        VALUES (?, ?, 'Unread')
    `;
    db.query(sql, [targetId, message], callback);
};

const getAllNotifications = (callback) => {
    const sql = `
        SELECT
            notifications.id,
            notifications.user_id,
            notifications.message,
            notifications.status,
            notifications.created_at,
            users.name AS user_name,
            users.email AS user_email
        FROM notifications
        LEFT JOIN users ON notifications.user_id = users.id
        ORDER BY notifications.created_at DESC
    `;
    db.query(sql, callback);
};

const getReportsData = (callback) => {
    const sql = `
        SELECT
            category,
            COUNT(*) AS total_requests,
            SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected
        FROM charity_requests
        GROUP BY category
    `;
    db.query(sql, callback);
};

const getAllFeedback = (callback) => {
    const sql = `
        SELECT
            feedback.id,
            feedback.message,
            feedback.created_at,
            users.name AS user_name,
            users.email AS user_email,
            users.phone AS user_phone
        FROM feedback
        LEFT JOIN users ON feedback.user_id = users.id
        ORDER BY feedback.created_at DESC
    `;
    db.query(sql, callback);
};

module.exports = {
    findAdminByEmail,
    getDashboardStats,
    getAllUsers,
    getAllTeams,
    setUserStatus,
    setTeamStatus,
    deleteUser,
    deleteTeam,
    insertNotification,
    getAllNotifications,
    getReportsData,
    getAllFeedback
};