const mysql = require('mysql2/promise');
require('dotenv').config();

// สร้าง Connection Pool สำหรับ Aiven MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // เช็กชื่อใน Render ให้ตรง (DB_PASSWORD หรือ DB_PASS)
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // จำเป็นสำหรับการเชื่อมต่อ Aiven
  }
});

// ตรวจสอบการเชื่อมต่อเบื้องต้นแบบ Async/Await
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('เชื่อมต่อฐานข้อมูล MySQL สำเร็จ!');
    connection.release();
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', err.message);
  }
})();

module.exports = pool;