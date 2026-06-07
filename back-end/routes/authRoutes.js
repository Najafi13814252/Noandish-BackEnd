const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware')

const authRouter = express.Router();

// مسیرهای عمومی
authRouter.post('/signup', authController.signup);
authRouter.post('/signin', authController.signin);
authRouter.get('/logout', authController.logout);

authRouter.get('/me', authMiddleware, authController.getMe);

module.exports = authRouter;