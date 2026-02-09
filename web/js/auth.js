const API_URL = 'http://localhost:3333'

export async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })

    const data = await res.json()

    if (!res.ok){
        throw new Error(data.error || 'Erro no Login')
    }

    localStorage.setItem('token', data.token)
}

export function logout() {
    localStorage.removeItem('token')
    location.reload()
}

export function getToken() {
    return localStorage.getItem('token')
}