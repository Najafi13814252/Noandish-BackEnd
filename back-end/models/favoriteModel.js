const NoandishDB = require('../configs/noandishDB')

class Favorites {
    // افزودن دوره به علاقه‌مندی‌ها
    static async addFavorite(userId, courseId) {
        const [result] = await NoandishDB.execute(
            `INSERT INTO favorites (user_id, course_id) VALUES (?, ?)`,
            [userId, courseId]
        )
        return result
    }

    // حذف دوره از علاقه‌مندی‌ها
    static async removeFavorite(userId, courseId) {
        const [result] = await NoandishDB.execute(
            `DELETE FROM favorites WHERE user_id = ? AND course_id = ?`,
            [userId, courseId]
        )
        return result
    }

    // گرفتن همه علاقه‌مندی‌های یک کاربر (با اطلاعات دوره‌ها)
    static async getAllFavoriteByUser(userId) {
        const [rows] = await NoandishDB.execute(
            `SELECT
                f.id AS favorite_id,
                f.created_at AS favorited_at,
                c.*,
                categories.title AS category_name,
                categories.slug AS category_slug,
                teachers.fullname AS teacher_name,
                teachers.avatar AS teacher_avatar
            FROM favorites f
            JOIN courses c ON f.course_id = c.id
            LEFT JOIN categories ON c.category_id = categories.id
            LEFT JOIN teachers ON c.teacher_id = teachers.id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC`,
            [userId]
        )
        return rows
    }

    // بررسی اینکه آیا یک دوره در علاقه‌مندی‌های کاربر هست یا نه
    static async isFavorite(userId, courseId) {
        const [rows] = await NoandishDB.execute(
            `SELECT 1 FROM favorites WHERE user_id = ? AND course_id = ? LIMIT 1`,
            [userId, courseId]
        )
        return rows.length > 0
    }

    // گرفتن favorite ids کاربر
    static async getFavoriteIds(userId) {
        const [rows] = await NoandishDB.execute(
            `SELECT course_id FROM favorites WHERE user_id = ?`,
            [userId]
        )

        return rows.map(item => item.course_id)
    }
}

module.exports = Favorites
