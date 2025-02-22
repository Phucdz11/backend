const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đảm bảo đường dẫn đúng

// Fetch all students
router.get('/admin/getstudents', (req, res) => {
    const query = 'SELECT * FROM students_list';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching students', error: err });
        }
        res.json(results);
    });
});

// Lấy danh sách các cuộc thi
router.get('/admin/getcontest', async (req, res) => {
    const query = 'SELECT * FROM contests_list ORDER BY startDateTime ASC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching contests:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lấy danh sách cuộc thi.', error: err });
        }

        res.status(200).json({ success: true, contests: results });
    });
});


// Lấy danh sách sinh viên tham dự cuộc thi
router.get('/admin/getcontestants/:contestName', async (req, res) => {
    const { contestName } = req.params; // Lấy tên cuộc thi từ tham số URL
    const query = 'SELECT * FROM contest_assignments WHERE contestName = ? ORDER BY studentname ASC';

    db.query(query, [contestName], (err, results) => {
        if (err) {
            console.error('Error fetching contestants:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lấy danh sách sinh viên.', error: err });
        }

        res.status(200).json({ success: true, contestants: results });
    });
});
module.exports = router;