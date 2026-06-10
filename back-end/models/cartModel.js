const NoandishDB = require('../configs/noandishDB')

class Cart {

    // گرفتن سبد خرید کاربر 
    static async findByUserId(userId) {
        const [rows] = await NoandishDB.query(
            `
            SELECT *
            FROM carts
            WHERE user_id = ?
            LIMIT 1
            `,
            [userId]
        )

        return rows[0]
    }

    // ساخت سبد خرید جدید کاربر 
    static async createNewCart(userId) {
        const [result] = await NoandishDB.query(
            `
            INSERT INTO carts(user_id)
            VALUES(?)
            `,
            [userId]
        )

        return result.insertId
    }

    // گرفتن یک items از cart 
    static async findCartItems(cartId, courseId) {
        const [rows] = await NoandishDB.query(
            `
            SELECT *
            FROM cart_items
            WHERE cart_id = ?
            AND course_id = ?
            LIMIT 1
            `,
            [cartId, courseId]
        )

        return rows[0]
    }

    // ساخت items جدید در cart 
    static async createNewCartItems(cartId, productId) {
        const [result] = await NoandishDB.query(
            `
            INSERT INTO cart_items(
                cart_id, course_id
            )
            VALUES (?, ?)
            `,
            [cartId, productId]
        )

        return result.insertId
    }

    // حذف از سبد خرید 
    static async delete(itemId) {
        await NoandishDB.query(
            `
            DELETE FROM cart_items
            WHERE id = ?
            `,
            [itemId]
        )
    }

    // گرفتن آیتم‌های سبد خرید 
    static async getCartCourses(userId) {
        const [rows] = await NoandishDB.query(
            `
            SELECT
                ci.id,

                c.id AS course_id,
                c.title,
                c.image_url,
                c.price,
                c.discount

            FROM carts cart

            JOIN cart_items ci
                ON ci.cart_id = cart.id

            JOIN courses c
                ON c.id = ci.course_id

            WHERE cart.user_id = ?
            `,
            [userId]
        )

        return rows
    }

    static async getTotal(userId) {
        const [rows] = await NoandishDB.query(
            `
            SELECT
                SUM(
                    CASE
                        WHEN c.discount > 0
                        THEN c.price - (c.price * c.discount / 100)
                        ELSE c.price
                    END
                ) AS total

            FROM carts cart

            JOIN cart_items ci
                ON ci.cart_id = cart.id

            JOIN courses c
                ON c.id = ci.course_id

            WHERE cart.user_id = ?
            `,
            [userId]
        )

        return rows[0]
    }

}

module.exports = Cart