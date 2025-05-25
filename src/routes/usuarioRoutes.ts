import { Router } from 'express'
import * as usuarioController from '../controllers/usuarioController'
import { verificarPermissaoAdmin } from '../middlewares/permissao'
import { verificarPermissaoOuAdmin } from '../middlewares/permissao'
import { autenticar } from '../middlewares/autenticacao'


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

/**
 * @openapi
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui uma conta de usuário (somente ADM)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Conta excluída com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', autenticar, verificarPermissaoAdmin, usuarioController.remover)

/**
 * @openapi
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza dados de um usuário (ADM ou o próprio usuário)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
router.put('/:id', autenticar, verificarPermissaoOuAdmin, usuarioController.atualizar)

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários do sistema (somente ADM)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/', autenticar, verificarPermissaoAdmin, usuarioController.listarTodos)

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna as informações de um usuário específico
 *     tags:
 *       - Usuários
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informações do usuário retornadas com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', usuarioController.buscarPorId)
//se quiser proteger a rota pra só adm poder ver as informações do usuário, só adicionar o parametro de autenticação do middleware
// router.get('/:id', autenticar, usuarioController.buscarPorId)



export default router
