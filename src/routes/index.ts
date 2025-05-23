import { Router } from 'express'
import usuarioRoutes from './usuarioRoutes'
import livroRoutes from './livroRoutes'

const rotas = Router()

rotas.use('/usuarios', usuarioRoutes)
rotas.use('/livros', livroRoutes)

// Rota pra testar API

/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Verifica se a API está online
 *     tags:
 *       - Sistema
 *     responses:
 *       200:
 *         description: Resposta de sucesso (pong)
 */
rotas.get('/ping', (req, res) => {
  res.status(200).json({ mensagem: 'pong 🏓' })
})

export default rotas
