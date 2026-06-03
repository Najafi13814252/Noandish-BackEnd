const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController')

router.get('/', courseController.getCourses)
router.get('/:id', courseController.getCourseById)
router.get('/:id/content', courseController.getCourseContents)
router.get('/:id/teacher', courseController.getTeacherById)

module.exports = router;