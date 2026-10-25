const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("./config/db");

const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Routes =================
const userRoutes = require("./routes/userRoutes");
const charityRequestRoutes = require("./routes/charityRequestRoutes");
const teamRoutes = require("./routes/teamRoutes");
const adminRoutes = require("./routes/adminRoutes");
const donationRoutes = require("./routes/donationRoutes");
const publishedDonationRoutes = require("./routes/publishedDonationRoutes");

app.use("/api/users", userRoutes);
app.use("/api/charity", charityRequestRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/published-donations", publishedDonationRoutes);

// ================= Home Route =================
app.get("/", (req, res) => {
    res.send("Welcome to CharityCall Backend");
});

// ================= Server =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});