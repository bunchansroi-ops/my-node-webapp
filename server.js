// 1. นำเข้า Framework และโมดูลที่จำเป็น
const express = require('express');
require('dotenv').config();

// 2. สร้างตัวแปร app เพื่อแทนตัวแอปพลิเคชัน
const app = express();
// อนุญาตให้ Express อ่านข้อมูลที่ส่งมาจากฟอร์ม HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// อนุญาตให้อ่านข้อมูลรูปแบบ JSON
app.use(express.json());

 // นำเข้าไฟล์ฐานข้อมูล (ได้การนำเข้า express)
const db = require('./config/db');

// สร้างเส้นทาง /users
app.get('/users', async (req, res) => {
  try {
    // รันคำสั่ง SQL ดึงข้อมูลทั้งหมด
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM users'
    );

    // ส่งข้อมูลไปแสดงผลที่ users.ejs
    res.render('users', {
      title: 'รายชื่อผู้ใช้งาน',
      users_data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
});
 // นำเข้าไฟล์ฐานข้อมูล (ได้การนำเข้า express)
//const db = require('./config/db');

// Route สำหรับดูรายการสินค้า
// Route สำหรับ Users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.render('users', { users: rows }); // หรือ res.json(rows) ตามโครงสร้างโปรเจกต์
  } catch (error) {
    console.error(error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
  }
});

// Route สำหรับ Products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.render('products', { products: rows }); // หรือ res.json(rows) ตามโครงสร้างโปรเจกต์
  } catch (error) {
    console.error(error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
  }
});


// 4. การตั้งค่า (Configuration) ให้ Framework รู้จักโฟลเดอร์ต่างๆ
app.use(express.static('public')); // อนุญาตให้เข้าถึงโฟลเดอร์ public
app.set('views', './views'); // บอกตำแหน่งโฟลเดอร์หน้าจอ
app.set('view engine', 'ejs'); // กำหนด Template Engine ที่ใช้

// อนุญาตให้ Express อ่านข้อมูลที่ส่งมาจากฟอร์ม HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// อนุญาตให้อ่านข้อมูลรูปแบบ JSON
app.use(express.json());

// 5. สร้าง Route เริ่มต้นเพื่อทดสอบระบบ
app.get('/', (req, res) => {
  // ส่งตัวแปร title และ username
  // ไปให้หน้า index.ejs
  res.render('index', {
    title: 'หน้าแรก - เว็บแอปพลิเคชัน',
    username: 'นางสาวปณิดา บุญจันทร์ 68319090027'
  });
});

// อนุญาตให้ Express อ่านข้อมูลที่ส่งมาจากฟอร์ม HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// อนุญาตให้อ่านข้อมูลรูปแบบ JSON
app.use(express.json());

// เส้นทางสำหรับหน้า "เกี่ยวกับเรา"
app.get('/about', (req, res) => {
  res.send(
    '<h1>หน้าเกี่ยวกับฉัน</h1>' +
    '<p>นี่คือหน้าเกี่ยวกับฉัน</p>'
  );
});

// อนุญาตให้ Express อ่านข้อมูลที่ส่งมาจากฟอร์ม HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// อนุญาตให้อ่านข้อมูลรูปแบบ JSON
app.use(express.json());
// เส้นทางสำหรับหน้า "ติดต่อเรา"
app.get('/contact', (req, res) => {
  res.send(
    '<h1>ติดต่อเรา</h1>' +
    '<p>อีเมล: admin@example.com</p>'
  );
});

// แสดงหน้าฟอร์มสมัครสมาชิก
app.get('/register', (req, res) => {
  res.render('register', {
    title: 'สมัครสมาชิก',
    message: null
  });
});

// รับข้อมูลจากการ Submit ฟอร์ม (Create)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 1. ตรวจสอบข้อมูลเบื้องต้น
  if (!username || !email || !password) {
    return res.render('register', {
      title: 'สมัครสมาชิก',
      message: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง!',
      messageType: 'danger'
    });
  }

  try {
    // 2. ใช้ Parameterized Query ป้องกัน SQL Injection
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, password];

    // 3. สั่ง Execute คำสั่ง SQL
    await db.query(sql, values);

    // 4. เมื่อบันทึกสำเร็จ ให้ Redirect ไปยังหน้ารายชื่อผู้ใช้งาน
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

// 6. สั่งให้เซิร์ฟเวอร์เริ่มทำงานและรับฟังการเชื่อมต่อ
// ประกาศตัวแปร PORT ก่อนใช้งาน
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running strongly on http://localhost:${PORT}`);
});