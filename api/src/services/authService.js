import { supabaseAnon, supabaseService } from "../database/supabase.js"
import { generateToken } from "../jwt.js"

export async function login(username, password) {
    const email = `${username}@internal.local`

    const {data, error} = await supabaseAnon.auth.signInWithPassword({
        email,
        password
    })

    if(error){
        throw new Error('Credenciais Inválidas')
    }
    
    const {data: user} = await supabaseService
        .from('users')
        .select('id, username, role')
        .eq('id', data.user.id)
        .single()

    if(!user){
        throw new Error('Usuário não autorizado')
    }

    const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role
    })

    return {
        token,
        user
    }
}