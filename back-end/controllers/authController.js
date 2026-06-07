const User = require('../models/userModel');
const { hashePassword, generateToken, verifyPassword } = require('../utils/auth');
const { serialize } = require('cookie');


// ثبت نام
const signup = async (req, res) => {
    try {
        let { firstname, lastname, email, username, password } = req.body;
        const createdAt = new Date();

        // Validation
        if (!firstname?.trim() || !lastname?.trim() || !email?.trim() || !username?.trim() || !password?.trim()) {
            return res.status(422).json({ message: 'All fields are required!' });
        }

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
        const token = generateToken({ id: result.insertId, email });

        // Set cookie and send response
        setAuthCookie(res, token);
        return res.status(201).json({
            message: 'User registered successfully',
            user_id: result.insertId,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unknown Internal Server Error!' });
    }
}

// ورود
const signin = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validation
        if (!identifier?.trim() || !password?.trim()) {
            return res.status(422).json({ message: 'All fields are required!' });
        }

        // بررسی وجود کاربر
        const user = await User.findUserForLogin(identifier);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Username or password is not correct!' });
        }

        // Create token
        const token = generateToken({ id: user.id, email: user.email });

        // Set cookie and send response
        setAuthCookie(res, token);

        return res.status(200).json({
            message: 'User logged in successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unknown Internal Server Error!' });
    }
}

// خروج
const logout = async (_, res) => {
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
        console.error(error);
        return res.status(500).json({ message: 'Unknown Internal Server Error!' });
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
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { signup, signin, logout, getMe }