const NoandishDB = require('../configs/noandishDB')

class Courses {
    static async getAll() {
        const [rows] = await NoandishDB.query(`
            SELECT
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

            GROUP BY courses.id
        `)
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