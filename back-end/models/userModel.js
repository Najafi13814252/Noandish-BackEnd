const NoandishDB = require('../configs/noandishDB')

class Users {
    // گرفتن همه کاربران
    static async getAll() {
        const [rows] = await NoandishDB.query(`SELECT * FROM users`)
        return rows
    }

    // بررسی وجود کاربر با email یا username
    static async findUserByEmailOrUsername(email, username) {
        const [rows] = await NoandishDB.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        return rows;
    }

    //   پیدا کردن کاربر برای ورود (با ایمیل یا یوزرنیم)
    static async findUserForLogin(identifier) {
        const [rows] = await NoandishDB.execute(
            'SELECT id, email, username, password FROM users WHERE email = ? OR username = ?',
            [identifier, identifier]
        );
        return rows[0]; // برگرداندن اولین کاربر یا undefined
    }

    // ایجاد کاربر جدید
    static async createUser(userData) {
        const { firstname, lastname, email, username, hashedPassword, createdAt } = userData;

        const newUserInsertQuery = `INSERT INTO users (firstname, lastname, email, username, password, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [firstname, lastname, email, username, hashedPassword, createdAt];

        const [result] = await NoandishDB.execute(newUserInsertQuery, values);
        return result;
    }

    //  دریافت اطلاعات کاربر
    static async getUserById(userId) {
        const [rows] = await NoandishDB.execute(
            'SELECT id, firstname, lastname, email, username, created_at FROM users WHERE id = ?',
            [userId]
        );
        return rows[0];
    }
}

module.exports = Users