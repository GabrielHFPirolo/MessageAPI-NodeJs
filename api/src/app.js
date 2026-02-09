import express from 'express'
import path from 'path'
import cors from 'cors'
<<<<<<< HEAD
import AtendimentoRoutes from './routes/atendimento.js';
import AuthRoutes from './routes/authRoutes.js';
=======
import routes from './routes/atendimento.js';
>>>>>>> 34c235853d7b814ea50a75510e1625ad6ee1d0e4
import { fileURLToPath } from 'url'

const app = express();

app.use(cors())
app.use(express.json())

<<<<<<< HEAD
app.use('/auth', AuthRoutes)
app.use('/atendimento', AtendimentoRoutes)
=======
app.use('/atendimento', routes)
>>>>>>> 34c235853d7b814ea50a75510e1625ad6ee1d0e4

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// sobe dois níveis: src → api → raiz → web
app.use(express.static(path.join(__dirname, '../../web')))

export default app