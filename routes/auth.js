// Existing imports
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.json({ success: false, error: "Error" });
        
        if (result.length > 0) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, error: "Invalid username or password" });
        }
    });
});

// Register endpoint
router.post('/register', (req, res) => {
    console.log(req.body); // Kiểm tra dữ liệu nhận được
    const { username, password, phone, fullname } = req.body;

    if (!username || !password || !phone || !fullname) {
        console.log("Missing fields: ", { username, password, phone, fullname });
        return res.json({ success: false, message: "All fields are required." });
    }

    // Check if the username already exists
    const checkSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Error checking username." });
        }
        if (results.length > 0) {
            return res.json({ success: false, message: "Username already exists." });
        }

        // If the username doesn't exist, proceed to insert
        const sql = 'INSERT INTO users (username, password, phone, fullname) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, password, phone, fullname], (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: "Error saving user." });
            }
            return res.json({ success: true, message: "User registered successfully!" });
        });
    });
});


// Get all users endpoint
router.get('/getusername', (req, res) => {
    const sql = 'SELECT username FROM users';
    
    db.query(sql, (err, result) => {
        if (err) return res.json({ success: false, error: "Error fetching username" });
        
        return res.json({ success: true, users: result });
    });
});

module.exports = router;