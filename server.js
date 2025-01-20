const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const createContestRouter = require('./routes/createcontest');
const getContestRouter = require('./routes/getcontest');
const totalsRoutes = require('./routes/totals');

const authAdminRoutes = require('./routes-admin/auth');
const rolesRoutes = require('./routes-admin/roles');
const totalsAccountAdminRoutes = require('./routes-admin/totalsAccount');
const totalsListAdminRoutes = require('./routes-admin/totalsList');
const AccountListAdminRoutes = require('./routes-admin/accountlist');
const excelAdminRoutes = require('./routes-admin/excel')

const app = express();
const PORT = process.env.PORT || 8081;

// Sử dụng cors
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sử dụng bodyParser để xử lý dữ liệu JSON
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


// Đăng ký các route
app.use('/api', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', createContestRouter);
app.use('/api', getContestRouter);
app.use('/api', totalsRoutes);
app.use('/uploads', express.static('uploads'));

// Đăng ký các route admin
app.use('/api', authAdminRoutes);
app.use('/api', rolesRoutes);
app.use('/api', totalsListAdminRoutes);
app.use('/api', totalsAccountAdminRoutes);
app.use('/api', excelAdminRoutes);
app.use('/api', AccountListAdminRoutes);

// Khởi động server

app.listen(process.env.PORT || 8081)