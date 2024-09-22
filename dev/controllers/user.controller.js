const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const validator = require('validator');

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

exports.createUser = async (req, res) => {
    const { first_name, last_name, id_number, dob, gender, email } = req.body;
    const phone = req.body.phone ? req.body.phone : null;

    let errors = [];

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

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ errors: ['Email already exists'] });
    }

    const checkPhone = await User.findOne({ where: { phone } });
    if (checkPhone) {
        return res.status(400).json({ errors: ['Phone number already exists'] });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 6);
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
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    // const jwt = require('jsonwebtoken');
    const token = req.headers.authorization;  
    try {
      const decoded = jwt.verify(token, 'SECRET_KEY'); 
      const userId = decoded.id;
      const userRoleId = decoded.roleId;      
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    try {
      const users = await User.findAll();
      res.json(users);
    
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
  };

  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const {first_name, last_name, id_number } = req.body;
  
    try {
      const users = await User.update(
        {first_name, last_name, id_number },
        { where: { id } }
      );
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    const { id } = req.params;  
    try {
        await User.update(
            { email: null, phone: null, status_id: 3 },
            { where: { id } }
        );
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
