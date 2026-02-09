import app from './app.js'
import 'dotenv/config'
import bcrypt from 'bcrypt'

const PORT = process.env.PORT || 3333

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor Rodando na Porta ${PORT}`)
})
