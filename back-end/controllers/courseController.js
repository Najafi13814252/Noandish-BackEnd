const Courses = require('../models/courseModel')

const getCourses = async (_, res) => {
    try {
        const courses = await Courses.getAll()
        res.status(200).json({data: courses})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = {getCourses}