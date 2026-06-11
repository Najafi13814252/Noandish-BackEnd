const Users = require('../models/userModel')

const getUsers = async (_, res, next) => {
    try {
        const users = await Users.getAll()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

module.exports = { getUsers }