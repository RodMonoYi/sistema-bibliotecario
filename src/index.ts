import express from 'express'
import cors from 'cors'
import { CorsOptions } from 'cors'
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

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://sistema-bibliotecario-frontend.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Adicionado para pré-flight funcionar
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', rotas); // rotas vêm depois dos middlewares

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
