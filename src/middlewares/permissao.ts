import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const verificarPermissao = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idLivro = Number(req.params.id)
  const { id: idUsuario, tipo } = req.usuario

  const livro = await prisma.livro.findUnique({
    where: { id: idLivro },
  })

  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado' })
  }

  if (livro.usuarioId !== idUsuario && tipo !== 'ADMINISTRADOR') {
    return res.status(403).json({ erro: 'Acesso negado' })
  }

  next()
}
