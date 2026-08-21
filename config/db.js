const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 19760,
  ssl: {
    rejectUnauthorized: false // บังคับใส่บรรทัดนี้สำหรับ Aiven
  },
  connectTimeout: 10000
});

module.exports = pool;