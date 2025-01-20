const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fetch all students
router.get('/getstudents', (req, res) => {
    const query = 'SELECT * FROM students_list';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching students', error: err });
        }
        res.json(results);
    });
});

// Add a new student
router.post('/addstudent', (req, res) => {
    const { studentid, studentname, studentunit } = req.body;

    const query = 'INSERT INTO students_list (studentid, studentname, studentunit, attendance) VALUES (?, ?, ?, ?)';
    db.query(query, [studentid, studentname, studentunit, 'Vắng mặt'], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding student', error: err });
        }
        res.status(201).json({ message: 'Student added successfully', studentid });
    });
});

// Delete a student by ID
router.post('/deletestudent', (req, res) => {
    const { studentid } = req.body;

    const query = 'DELETE FROM students_list WHERE studentid = ?';
    db.query(query, [studentid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting student', error: err });
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

// Delete all students
router.post('/deleteallstudents', (req, res) => {
    const query = 'DELETE FROM students_list';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting all students', error: err });
        }
        res.json({ message: 'All students deleted successfully' });
    });
});

// Update a student by ID
router.put('/updatestudent', (req, res) => {
    const { studentid, studentname, studentunit, attendance } = req.body;

    const query = 'UPDATE students_list SET studentname = ?, studentunit = ?, attendance = ? WHERE studentid = ?';
    db.query(query, [studentname, studentunit, attendance, studentid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating student', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully' });
    });
});

// Thêm sinh viên vào danh sách tham dự cuộc thi
router.post('/addcontestant', (req, res) => {
    const { studentid, studentname, studentunit, contestName } = req.body;

    // Kiểm tra xem tất cả các tham số có được cung cấp không
    if (!studentid || !studentname || !studentunit || !contestName) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
    }

    // Kiểm tra xem sinh viên đã tham gia cuộc thi hay chưa
    const checkQuery = 'SELECT * FROM contest_assignments WHERE studentid = ? AND contestName = ?';
    
    db.query(checkQuery, [studentid, contestName], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking contestant:', checkErr);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra sinh viên.', error: checkErr });
        }

        if (checkResults.length > 0) {
            return res.status(400).json({ message: 'Sinh viên đã tham gia cuộc thi này rồi.' });
        }

        // Tạo truy vấn SQL để chèn sinh viên vào danh sách tham dự cuộc thi
        const query = 'INSERT INTO contest_assignments (studentid, studentname, studentunit, contestName) VALUES (?, ?, ?, ?)';
        
        db.query(query, [studentid, studentname, studentunit, contestName], (err, results) => {
            if (err) {
                console.error('Error adding contestant:', err);
                return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sinh viên vào cuộc thi.', error: err });
            }
            res.status(201).json({ message: 'Sinh viên đã được thêm vào danh sách tham dự cuộc thi thành công!', studentid });
        });
    });
});

// Xóa sinh viên tham dự cuộc thi
router.delete('/deletestudentfromcontest', async (req, res) => {
    const { studentid, contestName } = req.body; // Lấy studentid và contestName từ body

    if (!studentid || !contestName) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin sinh viên hoặc tên cuộc thi.' });
    }

    const query = 'DELETE FROM contest_assignments WHERE studentid = ? AND contestName = ?';

    db.query(query, [studentid, contestName], (err, results) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa sinh viên.', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên để xóa.' });
        }

        res.status(200).json({ success: true, message: 'Sinh viên đã được xóa thành công.' });
    });
});
module.exports = router;