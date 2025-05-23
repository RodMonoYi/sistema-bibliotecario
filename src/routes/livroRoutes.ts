import { Router } from 'express'
import * as livroController from '../controllers/livroController'
import { autenticar } from '../middlewares/autenticacao'
import { verificarPermissao } from '../middlewares/permissao'

const router = Router()

/**
 * @openapi
 * /livros:
 *   get:
 *     summary: Lista todos os livros cadastrados
 *     tags:
 *       - Livros
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
router.get('/', livroController.listarTodos)

/**
 * @openapi
 * /livros/meus:
 *   get:
 *     summary: Lista apenas os livros cadastrados pelo usuário autenticado
 *     tags:
 *       - Livros
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de livros do próprio usuário retornada com sucesso
 */
router.get('/meus', autenticar, livroController.listarMeus)

/**
 * @openapi
 * /livros/usuario/{id}:
 *   get:
 *     summary: Lista todos os livros cadastrados por um usuário específico
 *     tags:
 *       - Livros
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de livros do usuário retornada com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/usuario/:id', livroController.listarPorUsuarioId)


/**
 * @openapi
 * /livros:
 *   post:
 *     summary: Cadastra um novo livro (usuário autenticado)
 *     tags:
 *       - Livros
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso
 */
router.post('/', autenticar, livroController.cadastrar)

/**
 * @openapi
 * /livros/{id}:
 *   put:
 *     summary: Edita um livro (somente dono ou admin)
 *     tags:
 *       - Livros
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
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 */
router.put('/:id', autenticar, verificarPermissao, livroController.editar)

/**
 * @openapi
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro (somente dono ou admin)
 *     tags:
 *       - Livros
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
 *         description: Livro removido com sucesso
 */
router.delete('/:id', autenticar, verificarPermissao, livroController.remover)

export default router
