const db = require("../config/db");

const findTeamByEmail = (email, callback) => {

    const sql = `
        SELECT *
        FROM teams
        WHERE email = ?
    `;

    db.query(sql, [email], callback);

};

module.exports = {
    findTeamByEmail
};