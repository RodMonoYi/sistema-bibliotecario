import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { schemaLivro } from '../validations/livroValidation'

const prisma = new PrismaClient()

// Listar todos os livros
export const listarTodos = async (_: Request, res: Response) => {
  const livros = await prisma.livro.findMany({
    include: {
      usuario: {
        select: { nome: true },
      },
    },
  })

  res.json(livros)
}

// Listar livro por ID
export const buscarPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const livro = await prisma.livro.findUnique({
    where: { id },
    include: {
      usuario: {
        select: { id: true, nome: true, email: true },
      },
    },
  })

  if (!livro) {
    return res.status(404).json({ erro: 'Livro não encontrado' })
  }

  res.json(livro)
}

// Listar livros do usuário autenticado
export const listarMeus = async (req: Request, res: Response) => {
  const livros = await prisma.livro.findMany({
    where: { usuarioId: req.usuario.id },
    include: {
      usuario: {
        select: { nome: true },
      },
    },
  })

  res.json(livros)
}

//Lista os livros enviados por um usuário especifico a partir do ID
export const listarPorUsuarioId = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const usuario = await prisma.usuario.findUnique({
    where: { id },
  })

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' })
  }

  const livros = await prisma.livro.findMany({
    where: { usuarioId: id },
    include: {
      usuario: {
        select: { nome: true },
      },
    },
  })

  res.json(livros)
}


// Cadastrar livro
export const cadastrar = async (req: Request, res: Response) => {
  try {
    const dados = schemaLivro.parse(req.body)

    const livro = await prisma.livro.create({
      data: {
        ...dados,
        usuarioId: req.usuario.id,
      },
    })

    res.status(201).json(livro)
  } catch (erro) {
    res.status(400).json({ erro: erro instanceof Error ? erro.message : erro })
  }
}

// Editar livro
export const editar = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  try {
    const dados = schemaLivro.parse(req.body)

    const livroAtualizado = await prisma.livro.update({
      where: { id },
      data: dados,
    })

    res.json(livroAtualizado)
  } catch (erro) {
    res.status(400).json({ erro: erro instanceof Error ? erro.message : erro })
  }
}

// Remover livro
export const remover = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  try {
    await prisma.livro.delete({ where: { id } })
    res.status(204).send()
  } catch (erro) {
    res.status(400).json({ erro: erro instanceof Error ? erro.message : erro })
  }
}
