import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '8h'
    })
}

export function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET)
}