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

export function somenteAdmin (req, res, next) {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso Restrito a admins'})
    }
    next()
}