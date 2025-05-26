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
const corsOptions = {
  // origin: [
  //   'http://localhost:5174', // Adicione a origem do seu frontend local
  //   'https://sistema-bibliotecario-frontend.vercel.app', // Se você tiver um deploy do frontend (exemplo)
  //   'http://127.0.0.1:5174' // Às vezes, localhost pode ser resolvido para 127.0.0.1
  // ],
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP que sua API suporta
  credentials: true, // Permite o envio de cookies e headers de autorização
  optionsSuccessStatus: 204 // Para requisições preflight (OPTIONS)
}

app.use(cors(corsOptions)) // Use o cors com as opções configuradas
app.use(express.json())
app.use(morgan('dev'))


// Rotas da aplicação
app.use('/api', rotas)

// Rota da documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rota raiz
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <title>API Biblioteca</title>
      <style>
        body {
          background: #f9f9f9;
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
          text-align: center;
        }
        h1 {
          color: #4CAF50;
        }
        a {
          color: #2196F3;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        code {
          background: #eee;
          padding: 2px 6px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <h1>✅ API da Biblioteca rodando com sucesso!</h1>
      <p>Acesse a <a href="/docs" target="_blank">documentação Swagger</a></p>
      <p>Você pode usar a rota <code>/api</code> para acessar os endpoints da aplicação.</p>
    </body>
    </html>
  `)
})

// Inicialização do servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`)
})
