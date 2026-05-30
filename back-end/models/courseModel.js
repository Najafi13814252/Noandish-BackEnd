const NoandishDB = require('../configs/noandishDB')

class Courses {
    static async getAll() {

        const [db] = await NoandishDB.query('SELECT DATABASE() as db')
        console.log('DATABASE =>', db)

        const [tables] = await NoandishDB.query('SHOW TABLES')
        console.log('TABLES =>', tables)

        const [rows] = await NoandishDB.query('SELECT * FROM courses')
        return rows
    }
}

module.exports = Courses