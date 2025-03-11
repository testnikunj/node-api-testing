const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// Get all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM user_data', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Parse JSON strings back to objects
        const users = rows.map(row => ({
            ...row,
            work_fields: JSON.parse(row.work_fields),
            department_info: JSON.parse(row.department_info),
            company_info: JSON.parse(row.company_info)
        }));
        res.json(users);
    });
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM user_data WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Parse JSON strings back to objects
        const user = {
            ...row,
            work_fields: JSON.parse(row.work_fields),
            department_info: JSON.parse(row.department_info),
            company_info: JSON.parse(row.company_info)
        };
        res.json(user);
    });
});

// Create a new user
app.post('/add_user', (req, res) => {
    const userData = req.body;
    // Convert nested objects to JSON strings
    const workFields = JSON.stringify(userData.work_fields);
    const departmentInfo = JSON.stringify(userData.department_info);
    const companyInfo = JSON.stringify(userData.company_info);

    db.run(
        `INSERT INTO user_data (
            id, user_full_name, user_name, mobile_no, email_id, dob, gender, about_as, profile_image, address, business_type, is_employ, work_fields, department_info, company_info
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userData.id, userData.user_full_name, userData.user_name, userData.mobile_no, userData.email_id, userData.dob, userData.gender, userData.about_as, userData.profile_image, userData.address, userData.business_type, userData.is_employ, workFields, departmentInfo, companyInfo
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, ...userData });
        }
    );
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    // Convert nested objects to JSON strings
    const workFields = JSON.stringify(userData.work_fields);
    const departmentInfo = JSON.stringify(userData.department_info);
    const companyInfo = JSON.stringify(userData.company_info);

    db.run(
        `UPDATE user_data SET
            user_full_name = ?, user_name = ?, mobile_no = ?, email_id = ?, dob = ?, gender = ?, about_as = ?, profile_image = ?, address = ?, business_type = ?, is_employ = ?, work_fields = ?, department_info = ?, company_info = ?
        WHERE id = ?`,
        [
            userData.user_full_name, userData.user_name, userData.mobile_no, userData.email_id, userData.dob, userData.gender, userData.about_as, userData.profile_image, userData.address, userData.business_type, userData.is_employ, workFields, departmentInfo, companyInfo, userId
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: userId, ...userData });
        }
    );
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM user_data WHERE id = ?', [userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});