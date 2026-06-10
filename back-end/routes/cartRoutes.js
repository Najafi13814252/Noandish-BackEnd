const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middlewares/optionalMiddleware')

router.use(authMiddleware)

router.post(
    '/',
    cartController.addCart
)

router.get(
    '/',
    cartController.getCart
)

router.delete(
    '/:id',
    cartController.remove
)

module.exports = router