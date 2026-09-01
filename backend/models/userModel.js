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
        SELECT id, name, email, phone, address
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

module.exports = {
    createUser,
    findUserByEmail ,
    findUserById,
    updateUserProfile
};