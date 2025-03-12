const express = require("express");
const { runQuery } = require("../database/database");
const router = express.Router();

router.get("/read_all_user_data/:id?", async (req, res) => {
    try {
        let query = `
            SELECT users.*, 
                   job_department_data.id AS job_department_id,
                   job_department_data.department_name AS job_department_name
            FROM users
            LEFT JOIN job_department_data 
            ON users.job_department_id = job_department_data.id
            WHERE users.status = 1
        `;
        let params = [];

        if (req.params.id) {
            query += " AND users.id = ?";
            params.push(req.params.id);
        }

        const users = await runQuery(req.db, query, params);

        const formattedUsers = users.map(user => ({
            id: user.id,
            user_full_name: user.user_full_name || "",
            user_name: user.user_name || "",
            mobile_no: user.mobile_no || "",
            email_id: user.email_id || "",
            password: user.password || "",
            device_id: user.device_id || "",
            dob: user.dob || 0,
            gender: user.gender ?? true,
            about_as: user.about_as || "",
            profile_image: user.profile_image || "",
            address: user.address || "",
            business_type: user.business_type || "",
            is_employ: user.is_employ ?? true,
            status: user.status ?? true,
            work_fields: user.work_fields ? JSON.parse(user.work_fields) : [],
            job_department_info: {
                job_department_id: user.job_department_id || null,
                job_department_name: user.job_department_name || ""
            },
            company_info: {
                company_name: user.company_name || "",
                company_mobile_no: user.company_mobile_no || "",
                company_email_id: user.company_email_id || "",
                company_about_as: user.company_about_as || "",
                company_address: user.company_address || ""
            }
        }));

        if (req.params.id && formattedUsers.length === 0) {
            return res.status(404).json({ status: false, status_code: 404, message: "User not found" });
        }

        res.json({ 
            status: true, 
            status_code: 200, 
            message: "Data received successfully", 
            data: req.params.id ? formattedUsers[0] : formattedUsers
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ status: false, status_code: 500, message: "Internal Server Error" });
    }
});

router.post("/add_new_user_data", async (req, res) => {
    const {
        user_full_name, user_name, mobile_no, email_id, password, device_id,
        dob, gender, about_as, profile_image, address, business_type,
        is_employ, status, work_fields, job_department_id, company_info
    } = req.body;

    if (!user_full_name || !mobile_no || !email_id || !password) {
        return res.status(400).json({ status: false, status_code: 400, message: "Missing required fields" });
    }

    try {
        const existingUser = await runQuery(req.db, "SELECT * FROM users WHERE mobile_no = ? OR email_id = ?", [mobile_no, email_id]);

        if (existingUser.length > 0) {
            return res.status(400).json({ status: false, status_code: 400, message: "User already exists" });
        }

        const department = await runQuery(req.db, "SELECT * FROM job_department_data WHERE id = ?", [job_department_id]);
        if (department.length === 0) {
            return res.status(400).json({ status: false, status_code: 400, message: "Invalid job department ID" });
        }

        await runQuery(req.db, `
          INSERT INTO users (
            user_full_name, user_name, mobile_no, email_id, password, device_id,
            dob, gender, about_as, profile_image, address, business_type,
            is_employ, status, work_fields, job_department_id,
            company_name, company_mobile_no, company_email_id, company_about_as, company_address
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user_full_name, user_name, mobile_no, email_id, password, device_id,
            dob, gender, about_as, profile_image, address, business_type,
            is_employ, status, JSON.stringify(work_fields || []), job_department_id,
            company_info?.company_name || "", company_info?.company_mobile_no || "",
            company_info?.company_email_id || "", company_info?.company_about_as || "", company_info?.company_address || ""
        ]);

        res.status(200).json({ status: true, status_code: 200, message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ status: false, status_code: 500, message: "Internal Server Error" });
    }
});

router.put("/update_user_data/:id", async (req, res) => {
    const {
        user_full_name, user_name, mobile_no, email_id, password, device_id,
        dob, gender, about_as, profile_image, address, business_type,
        is_employ, status, work_fields, job_department_id, company_info
    } = req.body;

    try {
        const userExists = await runQuery(req.db, "SELECT * FROM users WHERE id = ?", [req.params.id]);
        if (userExists.length === 0) {
            return res.status(404).json({ status: false, status_code: 404, message: "User not found" });
        }

        const department = await runQuery(req.db, "SELECT * FROM job_department_data WHERE id = ?", [job_department_id]);
        if (department.length === 0) {
            return res.status(400).json({ status: false, status_code: 400, message: "Invalid job department ID" });
        }

        await runQuery(req.db, `
          UPDATE users SET
            user_full_name = ?, user_name = ?, mobile_no = ?, email_id = ?, password = ?, device_id = ?,
            dob = ?, gender = ?, about_as = ?, profile_image = ?, address = ?, business_type = ?,
            is_employ = ?, status = ?, work_fields = ?, job_department_id = ?,
            company_name = ?, company_mobile_no = ?, company_email_id = ?, company_about_as = ?, company_address = ?
          WHERE id = ?
        `, [
            user_full_name, user_name, mobile_no, email_id, password, device_id,
            dob, gender, about_as, profile_image, address, business_type,
            is_employ, status, JSON.stringify(work_fields || []), job_department_id,
            company_info?.company_name || "", company_info?.company_mobile_no || "",
            company_info?.company_email_id || "", company_info?.company_about_as || "", company_info?.company_address || "",
            req.params.id
        ]);

        res.json({ status: true, status_code: 200, message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ status: false, status_code: 500, message: "Internal Server Error" });
    }
});

router.delete("/delete_user_data/:id", async (req, res) => {
    try {
        const userExists = await runQuery(req.db, "SELECT * FROM users WHERE id = ?", [req.params.id]);
        if (userExists.length === 0) {
            return res.status(404).json({ status: false, status_code: 404, message: "User not found" });
        }

        await runQuery(req.db, "DELETE FROM users WHERE id = ?", [req.params.id]);

        res.json({ status: true, status_code: 200, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ status: false, status_code: 500, message: "Internal Server Error" });
    }
});

module.exports = router;
