const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 19760,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ DB:', err.message);
  } else {
    console.log('เชื่อมต่อฐานข้อมูล MySQL สำเร็จ!');
    connection.release();
  }
});

module.exports = pool.promise();