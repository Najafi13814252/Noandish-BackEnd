const NoandishDB = require('../configs/noandishDB')

class Favorites {
    static async addFavorite(userId, courseId) {
        const [result] = await NoandishDB.execute(`
            INSERT INTO favorites (user_id, course_id)
            VALUES (?, ?)
            `,
            [userId, courseId]
        )
        return result
    }

    static async removeFavorite(userId, courseId) {
        const [result] = await NoandishDB.execute(`
            DELETE FROM favorites 
            WHERE user_id = ? AND course_id = ?
            `,
            [userId, courseId]
        )
        return result
    }

    static async getFavorites(userId) {
        const [rows] = await NoandishDB.execute(`
            SELECT
            courses.*,
            teachers.fullname AS teacher_name,
            teachers.avatar AS teacher_avatar

            FROM favorites

            INNER JOIN courses
            ON favorites.course_id = courses.id

            LEFT JOIN teachers
            ON courses.teacher_id = teachers.id

            WHERE favorites.user_id = ?
        `, [userId])
        return rows
    }

    static async isFavorite(userId, courseId) {
        const [rows] = await NoandishDB.execute(`
            SELECT id
            FROM favorites
            WHERE user_id = ? AND course_id = ?
        `, [userId, courseId])
        return rows.length > 0
    }
}

module.exports = Favorites