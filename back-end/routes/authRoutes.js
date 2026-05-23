const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

// مسیرهای عمومی
authRouter.post('/signup', authController.signup);
authRouter.post('/signin', authController.signin);
authRouter.get('/logout', authController.logout);

module.exports = authRouter;