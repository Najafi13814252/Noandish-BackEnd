// فقط به کاربر register شده اجازه دسترسی میدهد (احراز هویت اجباری) 

const jwt = require('jsonwebtoken')
const { parse } = require('cookie')
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    try {
        // پیدا کردن token 
        const cookies = parse(req.headers.cookie || '')
        const token = cookies.token

        // بررسی وجود token 
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized - No token'
            })
        }

        // اعتبارسنجی JWT | بررسی توکن 
        // اگر token به مشکل بخورد، catch اجرا میشود 
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)

        // ذخیره اطلاعات کاربر 
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        
        // وقتی middleware تمام شد برو سراخ conroller بعدی 
        next()

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}

module.exports = authMiddleware