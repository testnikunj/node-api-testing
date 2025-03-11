const sqlite3 = require('sqlite3').verbose();

// Create or open the SQLite database file
const db = new sqlite3.Database('./user_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the user_data table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS user_data (
            id INTEGER PRIMARY KEY,
            user_full_name TEXT NOT NULL,
            user_name TEXT NOT NULL,
            mobile_no TEXT NOT NULL,
            email_id TEXT NOT NULL,
            dob INTEGER,
            gender INTEGER,
            about_as TEXT,
            profile_image TEXT,
            address TEXT,
            business_type TEXT,
            is_employ INTEGER,
            work_fields TEXT,
            department_info TEXT,
            company_info TEXT
        )`);
    }
});

module.exports = db;