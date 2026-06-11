const { query } = require('express-validator')

const courseQueryValidation = [
    query('sort')
        .optional()
        .isIn(['newest', 'discount', 'popular', 'default'])
        .withMessage('Invalid sort value'),

    query('points')
        .optional()
        .isInt([3.0, 3.5, 4.0, 4.5])
        .withMessage('Points must be a positive number'),

    query('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Invalid level'),

    query('type')
        .optional()
        .isIn(['free', 'paid'])
        .withMessage('Type must be free or paid')
]

module.exports = courseQueryValidation