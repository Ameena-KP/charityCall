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

            (SELECT COUNT(*) FROM teams) AS totalTeams,

            (SELECT COUNT(*) FROM charity_requests) AS totalRequests,

            (SELECT COUNT(*) FROM charity_requests
             WHERE status='Pending') AS pendingRequests,

            (SELECT COUNT(*) FROM charity_requests
             WHERE status='Approved') AS approvedRequests,

            (SELECT COUNT(*) FROM charity_requests
             WHERE status='Rejected') AS rejectedRequests
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
            created_at
        FROM teams
        ORDER BY created_at DESC
    `;

    db.query(sql, callback);

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



module.exports = {
    findAdminByEmail,
    getDashboardStats,
    getAllUsers,
    getAllTeams,
    deleteUser,
    deleteTeam
};