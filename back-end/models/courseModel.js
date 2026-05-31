const NoandishDB = require('../configs/noandishDB')

class Courses {
    static async getAll() {
        const [rows] = await NoandishDB.query(`
            SELECT
                c.*,
                t.fullname AS teacher_name,
                t.avatar AS teacher_avatar
            FROM courses c
            JOIN teachers t
                ON c.teacher_id = t.id
        `)
        return rows
    }
}

module.exports = Courses