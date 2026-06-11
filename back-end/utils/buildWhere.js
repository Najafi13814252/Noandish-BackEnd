function buildCourseFilters(points, level, type, categorySlug) {
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

    return {
        whereClause: whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '',
        values
    }
}

module.exports = buildCourseFilters