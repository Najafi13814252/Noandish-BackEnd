const Cart = require('../models/cartModel')

const addCart = async (req, res) => {
    try {

        const userId = req.user.id
        const { courseId } = req.body

        let cart = await Cart.findByUserId(userId)

        if (!cart) {
            const cartId = await Cart.createNewCart(userId)
            cart = {
                id: cartId
            }
        }

        // اگر item از قبل وجود داشت 
        const exists = await Cart.findCartItems(
            cart.id,
            courseId
        )
        if (exists) {
            return res.status(400).json({
                message: 'Course already exists in cart'
            })
        }

        await Cart.createNewCartItems(
            cart.id,
            courseId
        )

        return res.status(201).json({
            message: 'Course added to cart'
        })

    } catch (error) {

        return res.status(500).json({
            message: error.message
        })
    }

}

const getCart = async (req, res) => {
    try {

        const userId = req.user.id

        const courses = await Cart.getCartCourses(userId)

        const total = await Cart.getTotal(userId)

        return res.json({
            courses,
            total: total.total || 0
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params

        await Cart.delete(id)

        return res.json({
            message: 'Course removed from cart'
        })

    } catch (error) {

        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { addCart, getCart, remove }