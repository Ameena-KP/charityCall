const db = require("../config/db");

const createTeam = (teamData, callback) => {
    const sql = `
        INSERT INTO teams (name, email, phone, password, status)
        VALUES (?, ?, ?, ?, 'Pending')
    `;
    db.query(
        sql,
        [teamData.name, teamData.email, teamData.phone, teamData.password],
        callback
    );
};

const findTeamByEmail = (email, callback) => {
    const sql = `
        SELECT *
        FROM teams
        WHERE email = ?
    `;
    db.query(sql, [email], callback);
};

const findTeamById = (id, callback) => {
    const sql = `
        SELECT id, name, email, phone, status, created_at
        FROM teams
        WHERE id = ?
    `;
    db.query(sql, [id], callback);
};

const updateRequestCategory = (requestId, category, callback) => {
    const sql = `
        UPDATE charity_requests
        SET category = ?
        WHERE id = ?
    `;
    db.query(sql, [category, requestId], callback);
};

module.exports = {
    createTeam,
    findTeamByEmail,
    findTeamById,
    updateRequestCategory
};