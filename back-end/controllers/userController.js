const Users = require('../models/userModel')

const getUsers = async (_, res) => {
    try {
        const users = await Users.getAll()
        res.status(200).json({data: users})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = {getUsers}