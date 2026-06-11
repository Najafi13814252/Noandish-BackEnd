const Courses = require('../models/courseModel')

const getCourses = async (req, res, next) => {
    try {
        const { slug } = req.params
        const { sort, points, level, type } = req.query
        const courses = await Courses.getAll(sort, points, level, type, slug)

        res.status(200).json(courses)

    } catch (error) {
        next(error)
    }
}

const getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params
        const course = await Courses.getCourseById(id)
        res.status(200).json(course)
    } catch (error) {
        next(error)
    }
}

const getCourseContents = async (req, res, next) => {
    try {
        const { id } = req.params
        const content = await Courses.getCourseContents(id)
        res.status(200).json(content)
    } catch (error) {
        next(error)
    }
}

const getTeacherById = async (req, res, next) => {
    try {
        const { id } = req.params
        const content = await Courses.getTeacherById(id)
        res.status(200).json(content)
    } catch (error) {
        next(error)
    }
}

module.exports = { getCourses, getCourseById, getCourseContents, getTeacherById }