const express = require('express');
const router = express.Router();
const { uploadImage, createUser, getAllUsers, updateUser, deleteUser} = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');

// Protect these routes
router.post('/add', authenticate, uploadImage, createUser);
router.get('/users', authenticate, getAllUsers);
router.put('/users/:id', authenticate, updateUser);
router.put('/users/deactivate/:id', authenticate, deleteUser);
module.exports = router;
