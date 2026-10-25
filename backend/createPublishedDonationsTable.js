require("dotenv").config();
const db = require("./config/db");

const sqlCreate = `
CREATE TABLE IF NOT EXISTS published_donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    item_condition VARCHAR(50) DEFAULT 'Good',
    description TEXT,
    location VARCHAR(255),
    contact_phone VARCHAR(50),
    image VARCHAR(255),
    status ENUM('Available', 'Reserved', 'Donated') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

db.query(sqlCreate, (err) => {
    if (err) {
        console.error("Error creating published_donations table:", err);
        process.exit(1);
    }
    console.log("published_donations table verified/created successfully!");

    db.query("SELECT COUNT(*) as count FROM published_donations", (errCount, countRes) => {
        if (!errCount && countRes[0].count === 0) {
            const seedSql = `
                INSERT INTO published_donations 
                (user_id, title, category, item_name, quantity, item_condition, description, location, contact_phone, status)
                VALUES 
                (1, 'School Backpacks & Geometry Boxes for Children', 'Education', 'School Bags & Stationery', 8, 'Brand New', 'Set of 8 waterproof school backpacks with notebooks and stationery sets for school children in need.', 'Kochi, Kerala', '9876543210', 'Available'),
                (1, 'Warm Winter Blankets & Cotton Bedding', 'Shelter', 'Double Layer Blankets', 12, 'Brand New', '12 clean, packed warm blankets suitable for homeless shelter relief or flood-affected families.', 'Malappuram, Kerala', '9876543211', 'Available'),
                (1, 'Adult Mobility Crutches & Foldable Wheelchair', 'Medicine', 'Medical Mobility Aids', 2, 'Like New', 'Gently used adjustable aluminum crutches and one foldable wheelchair in perfect working condition.', 'Kozhikode, Kerala', '9876543212', 'Available')
            `;
            db.query(seedSql, (errSeed) => {
                if (errSeed) console.error("Error seeding sample items:", errSeed);
                else console.log("Seeded 3 starter published donation items!");
                process.exit(0);
            });
        } else {
            console.log("Published donations table already has entries.");
            process.exit(0);
        }
    });
});
