require("dotenv").config();
const db = require("../config/db");

async function migrate() {
    try {
        console.log("Starting DB schema updates...");

        // 1. Add status to users if not exists
        const [userCols] = await db.promise().query("SHOW COLUMNS FROM users LIKE 'status'");
        if (userCols.length === 0) {
            await db.promise().query("ALTER TABLE users ADD COLUMN status ENUM('Active', 'Blocked') DEFAULT 'Active'");
            console.log("Added status column to users");
        } else {
            console.log("users.status column already exists");
        }

        // 2. Add status to teams if not exists
        const [teamCols] = await db.promise().query("SHOW COLUMNS FROM teams LIKE 'status'");
        if (teamCols.length === 0) {
            await db.promise().query("ALTER TABLE teams ADD COLUMN status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'");
            console.log("Added status column to teams");
        } else {
            console.log("teams.status column already exists");
        }

        // 3. Sync team rows from team to teams
        const [existingTeams] = await db.promise().query("SELECT email FROM teams");
        const existingEmails = new Set(existingTeams.map(t => t.email));

        const [teamRows] = await db.promise().query("SELECT * FROM team");
        for (const t of teamRows) {
            if (!existingEmails.has(t.email)) {
                await db.promise().query(
                    "INSERT INTO teams (name, email, password, phone, status) VALUES (?, ?, ?, ?, ?)",
                    [t.name, t.email, t.password, t.phone, t.status || 'Pending']
                );
                console.log("Synced team member to teams:", t.name);
            }
        }

        // Set rahul@gmail.com to Approved for testing
        await db.promise().query("UPDATE teams SET status = 'Approved' WHERE email = 'rahul@gmail.com'");
        console.log("Set rahul@gmail.com to Approved");

        // 4. Add required_items to charity_requests if not exists
        const [reqCols] = await db.promise().query("SHOW COLUMNS FROM charity_requests LIKE 'required_items'");
        if (reqCols.length === 0) {
            await db.promise().query("ALTER TABLE charity_requests ADD COLUMN required_items VARCHAR(255) DEFAULT NULL");
            console.log("Added required_items column to charity_requests");
        } else {
            console.log("charity_requests.required_items already exists");
        }

        console.log("DB schema update completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
}

migrate();
