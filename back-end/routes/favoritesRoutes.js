const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

// Add favorite
router.post('/', favoriteController.addFavorite)

// Get all favorites
router.get('/', favoriteController.getFavorites)

// Remove favorite
router.delete('/:courseId', favoriteController.removeFavorite)

// Check favorite
router.get('/check/:courseId', favoriteController.isFavorite)

module.exports = router;