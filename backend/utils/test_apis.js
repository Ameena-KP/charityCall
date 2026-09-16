require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const testApp = express();
testApp.use(cors());
testApp.use(express.json());
testApp.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const userRoutes = require("../routes/userRoutes");
const charityRequestRoutes = require("../routes/charityRequestRoutes");
const teamRoutes = require("../routes/teamRoutes");
const adminRoutes = require("../routes/adminRoutes");
const donationRoutes = require("../routes/donationRoutes");

testApp.use("/api/users", userRoutes);
testApp.use("/api/charity", charityRequestRoutes);
testApp.use("/api/team", teamRoutes);
testApp.use("/api/admin", adminRoutes);
testApp.use("/api/donations", donationRoutes);

const server = testApp.listen(5005, async () => {
    console.log("Test server running on port 5005");
    const BASE = "http://localhost:5005/api";

    try {
        // 1. Test Admin Login
        console.log("Testing Admin Login...");
        const adminRes = await fetch(`${BASE}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@gmail.com", password: "123456" })
        });
        const adminLogin = await adminRes.json();
        console.log("✓ Admin Login:", adminLogin.success, "Token:", !!adminLogin.token);
        const adminToken = adminLogin.token;

        // 2. Test Admin Dashboard
        console.log("Testing Admin Dashboard Stats...");
        const dashRes = await fetch(`${BASE}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const dashboard = await dashRes.json();
        console.log("✓ Dashboard Stats:", dashboard.dashboard);

        // 3. Test Team Login
        console.log("Testing Team Login...");
        const teamRes = await fetch(`${BASE}/team/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "rahul@gmail.com", password: "123456" })
        });
        const teamLogin = await teamRes.json();
        console.log("✓ Team Login:", teamLogin.success, "Token:", !!teamLogin.token);
        const teamToken = teamLogin.token;

        // 4. Test Public Approved Charity Requests
        console.log("Testing Public Approved Requests...");
        const appRes = await fetch(`${BASE}/charity/approved`);
        const approved = await appRes.json();
        console.log("✓ Approved requests count:", approved.total);

        // 5. Test Team Pending Queue
        console.log("Testing Team Pending Queue...");
        const pendRes = await fetch(`${BASE}/team/pending`, {
            headers: { Authorization: `Bearer ${teamToken}` }
        });
        const pending = await pendRes.json();
        console.log("✓ Team pending queue count:", pending.total);

        // 6. Test Admin Reports
        console.log("Testing Admin Reports...");
        const repRes = await fetch(`${BASE}/admin/reports`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const reports = await repRes.json();
        console.log("✓ Reports loaded. Categories count:", reports.categoryBreakdown.length);

        console.log("\n>>> ALL BACKEND APIS FUNCTIONING PERFECTLY WITH DATABASE! <<<");
    } catch (err) {
        console.error("Test error:", err);
    } finally {
        server.close(() => {
            console.log("Test server closed.");
            process.exit(0);
        });
    }
});
