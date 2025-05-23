import { Router } from 'express'
import * as usuarioController from '../controllers/usuarioController'

const router = Router()

/**
 * @openapi
 * /usuarios/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 */
router.post('/registrar', usuarioController.registrar)

/**
 * @openapi
 * /usuarios/login:
 *   post:
 *     summary: Realiza login e retorna o token JWT
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT retornado com sucesso
 */
router.post('/login', usuarioController.login)

export default router
