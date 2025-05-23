import { Request, Response } from 'express'
import { PrismaClient, TipoUsuario } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { schemaRegistro, schemaLogin } from '../validations/usuarioValidation'

const prisma = new PrismaClient()

// Registro de novo usuário
export const registrar = async (req: Request, res: Response) => {
  try {
    const dados = schemaRegistro.parse(req.body)

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaCriptografada,
      },
    })

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' })
  } catch (erro) {
    res.status(400).json({ erro: erro instanceof Error ? erro.message : erro })
  }
}

// Login do usuário
export const login = async (req: Request, res: Response) => {
  try {
    const dados = schemaLogin.parse(req.body)

    const usuario = await prisma.usuario.findUnique({
      where: { email: dados.email },
    })

    if (!usuario || !(await bcrypt.compare(dados.senha, usuario.senha))) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' })
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    res.json({ token })
  } catch (erro) {
    res.status(400).json({ erro: erro instanceof Error ? erro.message : erro })
  }
}
