const Favorites = require('../models/favoriteModel')

// Add favorite
const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id
        const { courseId } = req.body

        await Favorites.addFavorite(userId, courseId)

        res.status(201).json({
            success: true,
            message: 'Course added to favorites'
        })

    } catch (error) {

        // duplicate favorite (UNIQUE constraint)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Course already in favorites'
            })
        }

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Remove favorite
const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id
        const { courseId } = req.params

        await Favorites.removeFavorite(userId, courseId)

        res.status(200).json({
            success: true,
            message: 'Course removed from favorites'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get favorites
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id

        const favorites = await Favorites.getFavorites(userId)

        res.status(200).json({
            success: true,
            data: favorites
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Check favorite
const isFavorite = async (req, res) => {
    try {
        const userId = req.user.id
        const { courseId } = req.params

        const result = await Favorites.isFavorite(userId, courseId)

        res.status(200).json({
            success: true,
            isFavorite: result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite
}