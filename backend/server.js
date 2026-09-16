const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const path = require("path");

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

app.use("/api/users", userRoutes);
app.use("/api/charity", charityRequestRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donations", donationRoutes);

// ================= Home Route =================
app.get("/", (req, res) => {
    res.send("Welcome to CharityCall Backend");
});

// ================= Server =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});