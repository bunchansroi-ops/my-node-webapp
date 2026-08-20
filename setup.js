 const db = require('./config/db');

async function setup() {
  try {
    // 1. สร้างและเพิ่มข้อมูลตาราง products
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        productsname VARCHAR(255),
        price DECIMAL(10,2),
        stock INT,
        MFG_date DATE,
        EXP_date DATE
      )
    `);
    await db.query(`
      INSERT INTO products (productsname, price, stock, MFG_date, EXP_date)
      VALUES ('สินค้าทดสอบ Aiven', 99.00, 10, '2026-01-01', '2026-12-31')
    `);
    console.log('1. ตาราง products สร้างและเพิ่มข้อมูลสำเร็จ!');

    // 2. สร้างและเพิ่มข้อมูลตาราง users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100),
        email VARCHAR(100)
      )
    `);
    await db.query(`
      INSERT INTO users (username, email)
      VALUES ('admin_test', 'admin@example.com')
    `);
    console.log('2. ตาราง users สร้างและเพิ่มข้อมูลสำเร็จ!');

    process.exit(0);
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err.message);
    process.exit(1);
  }
}

setup();