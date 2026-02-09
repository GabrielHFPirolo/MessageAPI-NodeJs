import { login } from "../services/authService.js";

export async function loginController(req, res) {
    const {username, password} = req.body

    if (!username || !password){
        return res.status(400).json({error: 'Dados Obrigatórios'})
    }

    try {
        const result = await login(username, password)
        return res.json(result)
    }
    catch (err){
        return res.status(401).json({error: err.message})
    }
}