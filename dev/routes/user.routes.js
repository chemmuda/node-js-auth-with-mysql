const express = require('express');
const router = express.Router();
const { uploadImage, createUser, getAllUsers, updateUser, deleteUser, getOne} = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');

// Protect these routes
router.post('/add', authenticate, uploadImage, createUser);
router.get('/all', authenticate, getAllUsers);
router.get('/:id', authenticate, getOne);
router.put('/:id', authenticate, updateUser);
router.put('/deactivate/:id', authenticate, deleteUser);
module.exports = router;
