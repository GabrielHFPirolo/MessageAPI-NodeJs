import express from 'express'
import path from 'path'
import cors from 'cors'
import routes from './routes/atendimento.js';
import { fileURLToPath } from 'url'

const app = express();

app.use(cors())
app.use(express.json())

app.use('/atendimento', routes)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// sobe dois níveis: src → api → raiz → web
app.use(express.static(path.join(__dirname, '../../web')))

export default app