const mysql = require('mysql');

const db = mysql.createConnection({ 
    host: 'sql12.freesqldatabase.com',
    user: 'sql12758666',          // Username
    password: 'PVrSmiIpYR', // Mật khẩu thực tế (bạn kiểm tra email để lấy)
    database: 'sql12758666'       // Tên database
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to database');
});

module.exports = db;
