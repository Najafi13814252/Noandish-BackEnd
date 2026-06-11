function groupCourseContent(rows) {
    const chaptersMap = {}

    for (const row of rows) {

        if (!chaptersMap[row.chapter_id]) {
            chaptersMap[row.chapter_id] = {
                id: row.chapter_id,
                title: row.chapter_title,
                lessons: []
            }
        }

        if (row.lesson_id) {
            chaptersMap[row.chapter_id].lessons.push({
                id: row.lesson_id,
                title: row.lesson_title,
                video_url: row.video_url
            })
        }
    }

    return Object.values(chaptersMap)
}

module.exports = groupCourseContent