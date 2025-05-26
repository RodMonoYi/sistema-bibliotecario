//permissao.ts
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

// Somente administradores podem seguir
export const verificarPermissaoAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.usuario.tipo !== 'ADMINISTRADOR') {
    return res.status(403).json({ erro: 'Acesso negado: apenas administradores' })
  }
  next()
}

// Somente administradores ou o próprio usuário podem acessar
export const verificarPermissaoOuAdmin = (req: Request, res: Response, next: NextFunction) => {
  const idAlvo = Number(req.params.id)

  if (req.usuario.id !== idAlvo && req.usuario.tipo !== 'ADMINISTRADOR') {
    return res.status(403).json({ erro: 'Acesso negado: sem permissão para este recurso' })
  }

  next()
}

