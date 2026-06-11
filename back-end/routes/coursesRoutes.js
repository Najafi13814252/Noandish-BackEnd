const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController')
const courseQueryValidation = require('../validations/courseQueryValidation')
const cqvMiddleware = require('../middlewares/courseQueryValidationMiddleware')

router.get(
    '/',
    courseQueryValidation,
    cqvMiddleware,
    courseController.getCourses
)

router.get('/:id/content', courseController.getCourseContents)
router.get('/:id/teacher', courseController.getTeacherById)
router.get('/category/:slug', courseController.getCourses)
router.get('/:id', courseController.getCourseById)

module.exports = router;