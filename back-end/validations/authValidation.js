const { body } = require('express-validator')

const signupValidation = [
    body('firstname')
        .trim()
        .notEmpty()
        .withMessage('Firstname is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('Firstname must be between 3 and 30 characters'),

    body('lastname')
        .trim()
        .notEmpty()
        .withMessage('Lastname is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('Lastname must be between 3 and 30 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 4, max: 30 })
        .withMessage('Username must be between 4 and 30 characters')
        .matches(/^[a-zA-Z0-9_\-@$]+$/)
        .withMessage(
            'Username can only contain letters, numbers and _ , - , @ , $'
        ),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 100 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage(
            'Password must contain at least one letter and one number'
        )
]

const signinValidation = [
   body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Email or username is required')
        .custom((value) => {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            const isUsername = /^[a-zA-Z0-9_\-@$]{4,30}$/.test(value)

            if (!isEmail && !isUsername) {
                throw new Error('Invalid email or username')
            }
            return true
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 100 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage(
            'Password must contain at least one letter and one number'
        )
]

module.exports = {
    signupValidation,
    signinValidation
}