const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.post('/toggle', favoriteController.toggleFavorite)

router.get('/', favoriteController.getUserFavorites)

module.exports = router;
