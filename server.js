// 1. นำเข้า Framework และโมดูลที่จำเป็น
const express = require('express');
require('dotenv').config();

const app = express();

// นำเข้าไฟล์ฐานข้อมูล
const db = require('./config/db');

// 2. ตั้งค่า Middleware (ใส่ครั้งเดียวด้านบนสุด)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 3. ตั้งค่า View Engine
app.set('views', './views');
app.set('view engine', 'ejs');

// ==========================================
// ROUTES (เส้นทางต่างๆ)
// ==========================================

// หน้าแรก
app.get('/', (req, res) => {
  res.render('index', {
    title: 'หน้าแรก - เว็บแอปพลิเคชัน',
    username: 'นางสาวปณิดา บุญจันทร์ 68319090027'
  });
});

// หน้าเกี่ยวกับฉัน
app.get('/about', (req, res) => {
  res.send('<h1>หน้าเกี่ยวกับฉัน</h1><p>นี่คือหน้าเกี่ยวกับฉัน</p>');
});

// หน้าติดต่อเรา
app.get('/contact', (req, res) => {
  res.send('<h1>ติดต่อเรา</h1><p>อีเมล: admin@example.com</p>');
});

// หน้า Users (ดึงข้อมูลผู้ใช้งาน)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.render('users', {
      title: 'รายชื่อผู้ใช้งาน',
      users_data: rows,
      users: rows // ส่งให้รองรับทั้งชื่อ users และ users_data
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน: ${error.message}`);
  }
});

// หน้า Products (ดึงข้อมูลสินค้า)
app.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.render('products', {
      title: 'รายการสินค้า',
      products: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send(`เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า: ${error.message}`);
  }
});

// แสดงหน้าฟอร์มสมัครสมาชิก
app.get('/register', (req, res) => {
  res.render('register', {
    title: 'สมัครสมาชิก',
    message: null
  });
});

// รับข้อมูลการสมัครสมาชิก
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register', {
      title: 'สมัครสมาชิก',
      message: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง!',
      messageType: 'danger'
    });
  }

  try {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.query(sql, [username, email, password]);
    res.redirect('/users');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.render('register', {
        title: 'สมัครสมาชิก',
        message: 'อีเมลนี้มีในระบบแล้ว กรุณาใช้อีเมลอื่น',
        messageType: 'warning'
      });
    }
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

// ==========================================
// 4. สั่งเริ่มการทำงานของ Server
// ==========================================
const PORT = process.env.PORT || 19760;

app.listen(PORT, () => {
  console.log(`Server is running strongly on port ${PORT}`);
});