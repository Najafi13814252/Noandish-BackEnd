const NoandishDB = require('../configs/noandishDB')

class Courses {
    static async getAll(sort = 'default', points, level, type, categorySlug) {

        let orderBy = ''
        // شرط‌ها را نگه میدارد
        let whereConditions = []
        let values = []

        if (points !== undefined) {
            whereConditions.push('courses.points >= ?')
            values.push(Number(points))
        }

        if (level) {
            whereConditions.push('courses.level = ?')
            values.push(level)
        }

        if (type === 'free') {
            whereConditions.push('courses.discount = 100')
        }
        if (type === 'paid') {
            whereConditions.push('courses.discount < 100')
        }

        if (categorySlug) {
            whereConditions.push('categories.slug = ?')
            values.push(categorySlug)
        }

        let whereClause = ''
        if (whereConditions.length > 0) {
            whereClause =
                'WHERE ' +
                whereConditions.join(' AND ')
        }


        switch (sort) {
            case 'newest':
                orderBy = 'ORDER BY courses.created_at DESC'
                break

            case 'discount':
                orderBy = 'ORDER BY courses.discount DESC'
                break

            case 'popular':
                orderBy = 'ORDER BY courses.members DESC'
                break

            default:
                orderBy = ''
        }

        const [rows] = await NoandishDB.execute(`
            SELECT
            courses.*,
            categories.title AS category_name,
            categories.slug AS category_slug,
            teachers.fullname AS teacher_name,
            teachers.avatar AS teacher_avatar,
            JSON_ARRAYAGG(prerequisite.title) AS prerequisites

            FROM courses

            LEFT JOIN categories
            ON courses.category_id = categories.id

            LEFT JOIN teachers
            ON courses.teacher_id = teachers.id

            LEFT JOIN course_prerequisites cp
            ON courses.id = cp.course_id

            LEFT JOIN courses prerequisite
            ON cp.prerequisite_id = prerequisite.id

            ${whereClause}

            GROUP BY courses.id

            ${orderBy}
        `, values)

        return rows
    }

    static async getCourseById(courseId) {
        const [rows] = await NoandishDB.execute(
            `SELECT
            courses.*,
            teachers.fullname AS teacher_name,
            teachers.avatar AS teacher_avatar,
            JSON_ARRAYAGG(prerequisite.title) AS prerequisites
            FROM courses

            LEFT JOIN teachers
            ON courses.teacher_id = teachers.id

            LEFT JOIN course_prerequisites cp
            ON courses.id = cp.course_id

            LEFT JOIN courses prerequisite
            ON cp.prerequisite_id = prerequisite.id

            WHERE courses.id = ?

            GROUP BY courses.id`,
            [courseId]
        );
        return rows[0];
    }

    static async getCourseContents(courseId) {
        const [chapters] = await NoandishDB.execute(
            `
        SELECT *
        FROM course_chapters
        WHERE course_id = ?
        `,
            [courseId]
        )

        for (const chapter of chapters) {
            const [lessons] = await NoandishDB.execute(
                `
            SELECT *
            FROM lessons
            WHERE chapter_id = ?
            `,
                [chapter.id]
            )

            chapter.lessons = lessons
        }

        return chapters
    }

    static async getTeacherById(courseId) {
        const [rows] = await NoandishDB.execute(`
        SELECT
            t.id,
            t.fullname,
            t.avatar,
            t.bio,
            COUNT(c2.id) AS courses_count

        FROM courses c

        JOIN teachers t
        ON c.teacher_id = t.id

        LEFT JOIN courses c2
        ON c2.teacher_id = t.id

        WHERE c.id = ?

        GROUP BY t.id
    `, [courseId])

        return rows[0]
    }
}

module.exports = Courses