import { verifyToken } from "../jwt.js";

export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization

    if (!authHeader){
        return res.status(401).json({error: 'Token Ausente'})
    }

    const [, token] = authHeader.split(' ')

    try{
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    }
    catch{
        return res.status(401).json({error: 'Token Inválido'})
    }
}