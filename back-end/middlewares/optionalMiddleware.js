// احراز هویت اختیاری 

const jwt = require('jsonwebtoken')
const { parse } = require('cookie')
require('dotenv').config()

const optionalMiddleware = (req, _, next) => {
    try {
        const cookies = parse(req.headers.cookie || '')
        const token = cookies.token

        // اگر token وجود نداشت میتوانی سراغ conroller بعدی بروی 
        if (!token) {
            return next()
        }

        // اگر token به مشکل بخورد، next میشود
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)

        req.user = {
            id: decoded.id,
            email: decoded.email,
        }

        next()

    } catch (error) {
        // Token is invalid — just continue without user
        next()
    }
}

module.exports = optionalMiddleware
