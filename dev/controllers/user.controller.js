const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.getAllUsers = async (req, res) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'chemist',
    password: 'Lilly2024',
    database: 'school'
});
  try {
    const [users] = await connection.execute('SELECT * FROM viewstaff');
    res.json(users);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { first_name, last_name, id_number, dob, gender, email, phone } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Invalid email address');
  }

  const password = "123456";
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ errors: ['Email already exists'] });
    }

    const checkPhone = await User.findOne({ where: { phone } });
    if (checkPhone) {
      return res.status(400).json({ errors: ['Phone number already exists'] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const image_url = req.file ? req.file.path : null;

    const user = await User.create({
      first_name,
      last_name,
      id_number,
      dob,
      email,
      phone,
      gender,
      password: hashedPassword,
      image_url
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, id_number } = req.body;
  
  const token = req.header('Authorization')?.split(' ')[1];
  const decoded = jwt.verify(token, 'SECRET_KEY'); 
  const userId = decoded.id; 

  try {
    await User.update(
      { first_name, last_name, id_number,updated_by: userId },
      { where: { id } }
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const token = req.header('Authorization')?.split(' ')[1];
  const decoded = jwt.verify(token, 'SECRET_KEY'); 
  const userId = decoded.id; 

  try {
    await User.update(
      { email: null, phone: null, status_id: 3,updated_by: userId },
      { where: { id } }
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};