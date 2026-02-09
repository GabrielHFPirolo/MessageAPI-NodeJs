import { getToken } from "./auth.js";

const API_URL = 'http://localhost:3333'

export async function apiFetch(url, options = {}) {
    const token = getToken()

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    }

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
    })

    if (res.status === 401){
        localStorage.removeItem('token')
        location.reload()
        return
    }

    return res.json()
}
