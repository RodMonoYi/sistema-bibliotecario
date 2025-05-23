import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import rotas from './routes'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './utils/swagger'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const porta = process.env.PORT || 3333

// Middlewares globais
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Rotas da aplicação
app.use('/api', rotas)

// Rota da documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rota raiz
app.get('/', (req, res) => {
  res.send('API da Biblioteca rodando com sucesso!')
})

// Inicialização do servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`)
})
