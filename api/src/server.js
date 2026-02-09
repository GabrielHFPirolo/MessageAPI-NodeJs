import app from './app.js'
import 'dotenv/config'
<<<<<<< HEAD
import bcrypt from 'bcrypt'
=======
>>>>>>> 34c235853d7b814ea50a75510e1625ad6ee1d0e4

const PORT = process.env.PORT || 3333

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor Rodando na Porta ${PORT}`)
})
