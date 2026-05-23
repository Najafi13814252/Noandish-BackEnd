import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'

const hashePassword = async (password) => {
    const hashedPassword = await hash(password, 12);
    return hashedPassword
}

const generateToken = (data) => {
    const token = jwt.sign({ ...data }, process.env.PRIVATE_KEY, {
        // algorithm: ''
        expiresIn: "24h",
    })
    return token
}

const verifyPassword = async (password, hashedPassword) => {
    const isValid = await compare(password, hashedPassword)
    return isValid
}

const verifyToken = async (token) => {
    try {
        const validationResult = jwt.verify(token, process.env.PRIVATE_KEY)
        return validationResult
    } catch (error) {
        return false
    }
}

export { hashePassword, generateToken, verifyPassword, verifyToken }