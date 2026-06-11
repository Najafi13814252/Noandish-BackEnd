const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware')
const validationMiddleware = require('../middlewares/validationMiddleware')
const {signupValidation , signinValidation} = require('../validations/authValidation')

const authRouter = express.Router();

// مسیرهای عمومی
authRouter.post('/signup', signupValidation, validationMiddleware, authController.signup);
authRouter.post('/signin', signinValidation, validationMiddleware, authController.signin);
authRouter.post('/logout', authController.logout);

authRouter.get('/me', authMiddleware, authController.getMe);

module.exports = authRouter;