const NoandishDB = require('../configs/noandishDB')

class Courses {
    static async getAll() {
        const [rows] = await NoandishDB.query(`SELECT * FROM courses`)
        return rows
    }
}

module.exports = Courses