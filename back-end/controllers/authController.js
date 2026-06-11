const User = require('../models/userModel');
const { hashePassword, generateToken, verifyPassword } = require('../utils/auth');
const { serialize } = require('cookie');


// ثبت نام
const signup = async (req, res, next) => {
    try {
        let { firstname, lastname, email, username, password } = req.body;
        const createdAt = new Date();

        // بررسی وجود کابر
        const existingUser = await User.findUserByEmailOrUsername(email, username);
        if (existingUser.length) {
            return res.status(422).json({ message: 'This username or email exist already!' });
        }

        // Hash password
        const hashedPassword = await hashePassword(password);

        // Create user
        const userData = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.trim(),
            username: username.trim(),
            hashedPassword,
            createdAt
        };
        const result = await User.createUser(userData);

        // Generate token
        const token = generateToken({ id: result.insertId });

        // Set cookie and send response
        setAuthCookie(res, token);
        return res.status(201).json({
            message: 'User registered successfully',
            user_id: result.insertId
        });

    } catch (error) {
        next(error)
    }
}

// ورود
const signin = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        // بررسی وجود کاربر
        const user = await User.findUserForLogin(identifier);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        // Create token
        const token = generateToken({ id: user.id });

        // Set cookie and send response
        setAuthCookie(res, token);

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        next(error)
    }
}

// خروج
const logout = async (_, res, next) => {
    try {
        // Clear the cookie by setting maxAge to 0
        res.setHeader('Set-Cookie', serialize('token', "", {
            httpOnly: true,
            path: '/',
            maxAge: 0
        }));

        return res.status(200).json({
            message: 'User logged out successfully!'
        });
    } catch (error) {
        next(error)
    }
}

// تنظیم کوکی
const setAuthCookie = (res, token) => {
    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    }));
}

// me
const getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });

    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin, logout, getMe }