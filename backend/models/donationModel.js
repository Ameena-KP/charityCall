const db = require("../config/db");

const createDonation = (donationData, callback) => {
    const sql = `
        INSERT INTO donations
        (donor_id, request_id, item_name, quantity)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            donationData.donor_id,
            donationData.request_id,
            donationData.item_name,
            donationData.quantity
        ],
        callback
    );
};

const getMyDonations = (donorId, callback) => {
    const sql = `
        SELECT
            donations.id,
            donations.item_name,
            donations.quantity,
            donations.donation_status,
            donations.donated_at,
            charity_requests.title,
            charity_requests.category
        FROM donations
        JOIN charity_requests ON donations.request_id = charity_requests.id
        WHERE donor_id = ?
        ORDER BY donated_at DESC
    `;

    db.query(sql, [donorId], callback);
};

const getReceivedDonations = (receiverId, callback) => {
    const sql = `
        SELECT
            donations.id,
            donations.item_name,
            donations.quantity,
            donations.donation_status,
            donations.donated_at,
            charity_requests.title AS request_title,
            charity_requests.id AS request_id,
            users.name AS donor_name,
            users.email AS donor_email,
            users.phone AS donor_phone
        FROM donations
        JOIN charity_requests ON donations.request_id = charity_requests.id
        JOIN users ON donations.donor_id = users.id
        WHERE charity_requests.user_id = ?
        ORDER BY donations.donated_at DESC
    `;

    db.query(sql, [receiverId], callback);
};

const getAllDonations = (callback) => {
    const sql = `
        SELECT
            donations.id,
            users.name AS donor_name,
            users.email AS donor_email,
            users.phone AS donor_phone,
            charity_requests.title AS request_title,
            charity_requests.category,
            donations.item_name,
            donations.quantity,
            donations.donation_status,
            donations.donated_at
        FROM donations
        JOIN users ON donations.donor_id = users.id
        JOIN charity_requests ON donations.request_id = charity_requests.id
        ORDER BY donations.donated_at DESC
    `;

    db.query(sql, callback);
};

const updateDonationStatus = (id, callback) => {
    const sql = `
        UPDATE donations
        SET donation_status = 'Completed'
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

module.exports = {
    createDonation,
    getMyDonations,
    getReceivedDonations,
    getAllDonations,
    updateDonationStatus
};