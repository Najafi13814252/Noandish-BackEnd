const jwt = require('jsonwebtoken')
const { parse } = require('cookie')
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    try {
        const cookies = parse(req.headers.cookie || '')
        const token = cookies.token

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized - No token'
            })
        }

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)

        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        
        next()

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}

module.exports = authMiddleware