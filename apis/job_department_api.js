const express = require('express');
const router = express.Router();
const { runQuery } = require('../database/database');

router.post('/add_job_department', async (req, res) => {
  const { name, fields } = req.body;

  try {
    await runQuery(req.db, `INSERT INTO job_department_data (department_name, fields, status) VALUES (?, ?, ?)`, [
      name,
      JSON.stringify(fields),
      true
    ]);
    res.status(200).json({ "status": true, "status_code": 200, "message": "Diamond added successfully" });
  } catch (error) {
    res.status(500).json({ "status": false, "status_code": 500, "message": error.message });
  }
});

router.get('/read_job_department', async (req, res) => {
  try {
    const jobData = await runQuery(req.db, 'SELECT * FROM job_department_data WHERE `status` = 1');
    jobData.forEach(d => d.fields = JSON.parse(d.fields));

    res.json({"status": true, "status_code": 200, "message": "data received success", "data": jobData});
  } catch (error) {
    res.status(500).json({ "status": false, "status_code": 500, "message": error.message });
  }
});

router.put('/update_job_department/:id', async (req, res) => {
  const { name, fields, status } = req.body;

  try {
    const result = await runQuery(
      req.db,
      'UPDATE job_department_data SET department_name = ?, fields = ?, status = ? WHERE id = ?',
      [name, JSON.stringify(fields), status, req.params.id]
    );

    if (result.changes === 0) {
        return res.status(404).json({ "status": false, "status_code": 404, "message": "Job Department not found" });
    }

    res.json({ "status": true, "status_code": 200, "message": "Job Department data update successfully" });
  } catch (error) {
    res.status(500).json({ "status": false, "status_code": 500, "message": error.message });
  }
});

router.delete('/delete_job_department/:id', async (req, res) => {
  try {
    const result = await runQuery(req.db, 'DELETE FROM job_department_data WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ "status": false, "status_code": 404, "message": "Job Department not found" });
    }

    res.json({ "status": true, "status_code": 200, "message": "Job Department data deleted successfully" });
  } catch (error) {
    res.status(500).json({ "status": false, "status_code": 500, "message": error.message });
  }
});

module.exports = router;
