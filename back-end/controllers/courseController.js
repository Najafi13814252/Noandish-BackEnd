const Courses = require('../models/courseModel')
const Favorites = require('../models/favoriteModel')

const getCourses = async (req, res) => {
    try {
        const { slug } = req.params
        const { sort, points, level, type } = req.query
        const courses = await Courses.getAll(sort, points, level, type, slug)
        
        res.status(200).json(courses)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Courses.getCourseById(id)
        res.status(200).json(course)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getCourseContents = async (req, res) => {
    try {
        const { id } = req.params
        const content = await Courses.getCourseContents(id)
        res.status(200).json(content)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params
        const content = await Courses.getTeacherById(id)
        res.status(200).json(content)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getCourses, getCourseById, getCourseContents, getTeacherById }