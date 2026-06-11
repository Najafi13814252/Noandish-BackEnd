const Favorites = require('../models/favoriteModel')

// افزودن به علاقه‌مندی‌ها
const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { course_id } = req.body

        if (!course_id) {
            return res.status(422).json({ message: 'course_id is required!' })
        }

        // بررسی تکراری نبودن
        const alreadyFavorited = await Favorites.isFavorite(userId, course_id)
        if (alreadyFavorited) {
            return res.status(409).json({ message: 'This course is already in your favorites!' })
        }

        const result = await Favorites.addFavorite(userId, course_id)

        res.status(201).json({
            message: 'Course added to favorites successfully',
            favorite_id: result.insertId
        })

    } catch (error) {
        next(error)
    }
}

// حذف از علاقه‌مندی‌ها
const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { courseId } = req.params

        const result = await Favorites.removeFavorite(userId, courseId)

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Favorite not found!' })
        }

        res.status(200).json({ message: 'Course removed from favorites successfully' })

    } catch (error) {
        next(error)
    }
}

// گرفتن لیست علاقه‌مندی‌های کاربر
const getUserFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id
        const favorites = await Favorites.getAllFavoriteByUser(userId)

        res.status(200).json(favorites)

    } catch (error) {
        next(error)
    }
}

// حذف یا اضافه علاقه‌مندی
const toggleFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { course_id } = req.body

        if (!course_id) {
            return res.status(422).json({
                message: 'course_id is required'
            })
        }

        const favorite = await Favorites.isFavorite(userId, course_id)

        // اگر قبلا favorite شده بود حذف کن
        if (favorite) {
            await Favorites.removeFavorite(userId, course_id)
            return res.status(200).json({
                isFavorite: false,
                message: 'Course removed from favorites'
            })
        }

        // اگر favorite نبود اضافه کن
        await Favorites.addFavorite(userId, course_id)
        return res.status(201).json({
            isFavorite: true,
            message: 'Course added to favorites'
        })

    } catch (error) {
        next(error)
    }
}

module.exports = { addFavorite, removeFavorite, getUserFavorites, toggleFavorite }
