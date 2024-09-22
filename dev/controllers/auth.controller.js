const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user.model');


exports.login = async (req, res) => {
  const { staff_number, password } = req.body;
  let errors = [];

  if (!staff_number) {
    errors.push('Staff Code must be valid');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await User.findOne({ where: { code: staff_number, status_id : 1 } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }  

    const token = jwt.sign({ id: user.id, roleId: user.role_id }, 'SECRET_KEY', { expiresIn: '72h' });  
    const userDetails = {
      id: user.id,
      name: user.first_name + ' ' + user.last_name,
      email: user.email,
      email: user.phone,
      roleId: user.role_id,
    };  
    res.json({ token, user: userDetails });
  } catch (error) {
    res.status(500).json({ error: error});
  }
  
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    let errors = [];
    if (!currentPassword || !newPassword || !confirmPassword) {
        errors.push('All fields are required');
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
        errors.push('New password cannot be the same as the current password');
    }
    if (newPassword && newPassword.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        errors.push('Passwords do not match');
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const user = req.user; 
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  let errors = [];
  if (!email ||!validator.isEmail(email)) {
    errors.push('Invalid email address');
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await User.findOne({ where: { email, status_id : 1 } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const randomEightDigitNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const hashedPassword = await bcrypt.hash(randomEightDigitNumber, 8);
    user.password = hashedPassword
    await user.save();
    // send the password to the user via email
  
    res.json({ message: 'New password was sent to your email', data: { password: randomEightDigitNumber}});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};