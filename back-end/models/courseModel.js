const NoandishDB = require('../configs/noandishDB')

class Courses {
    static async getAll() {
        const [rows] = await NoandishDB.query(`
            SELECT
            courses.*,
            teachers.fullname AS teacher_name,
            teachers.avatar AS teacher_avatar
            FROM courses
            LEFT JOIN teachers
            ON courses.teacher_id = teachers.id
        `)
        return rows
    }
}

module.exports = Courses