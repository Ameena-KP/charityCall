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
            charity_requests.title
        FROM donations
        JOIN charity_requests
        ON donations.request_id = charity_requests.id
        WHERE donor_id = ?
        ORDER BY donated_at DESC
    `;

    db.query(sql, [donorId], callback);

};

const getAllDonations = (callback) => {

    const sql = `
        SELECT
            donations.id,
            users.name AS donor_name,
            charity_requests.title,
            donations.item_name,
            donations.quantity,
            donations.donation_status,
            donations.donated_at
        FROM donations
        JOIN users
        ON donations.donor_id = users.id
        JOIN charity_requests
        ON donations.request_id = charity_requests.id
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
    getAllDonations,
    updateDonationStatus
};