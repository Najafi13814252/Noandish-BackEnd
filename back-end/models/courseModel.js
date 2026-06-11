const NoandishDB = require('../configs/noandishDB')
const buildCourseFilters = require('../utils/buildWhere')
const groupCourseContent = require('../utils/groupCourseContent')

class Courses {
    static async getAll(sort = 'default', points, level, type, categorySlug) {

        const { whereClause, values } = buildCourseFilters(points, level, type, categorySlug)

        let orderBy = ''
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
            teachers.fullname AS teacher_name,
            teachers.avatar AS teacher_avatar,
            categories.title AS category_name,
            categories.slug AS category_slug,
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
            `
            SELECT
            courses.*,
            teachers.fullname AS teacher_name,
            teachers.avatar AS teacher_avatar,
            COALESCE(
                JSON_ARRAYAGG(
                    CASE
                        WHEN prerequisite.id IS NOT NULL
                        THEN prerequisite.title
                    END
                ),
                JSON_ARRAY()
            ) AS prerequisites

            FROM courses

            LEFT JOIN teachers
            ON courses.teacher_id = teachers.id

            LEFT JOIN course_prerequisites cp
            ON courses.id = cp.course_id

            LEFT JOIN courses prerequisite
            ON cp.prerequisite_id = prerequisite.id

            WHERE courses.id = ?

            GROUP BY courses.id
            `,
            [courseId]
        );
        return rows[0];
    }

    static async getCourseContents(courseId) {
        const [rows] = await NoandishDB.execute(
            `
            SELECT
            cc.id AS chapter_id,
            cc.title AS chapter_title,

            l.id AS lesson_id,
            l.title AS lesson_title,
            l.video_url

            FROM course_chapters cc

            LEFT JOIN lessons l
            ON cc.id = l.chapter_id

            WHERE cc.course_id = ?

            ORDER BY cc.id, l.id
            `,
            [courseId]
        )

        return groupCourseContent(rows)
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