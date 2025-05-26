//autenticacao.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: number
  tipo: string
}

declare global {
  namespace Express {
    interface Request {
      usuario: TokenPayload
    }
  }
}

export const autenticar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
    req.usuario = decoded
    next()
  } catch {
    return res.status(401).json({ erro: 'Token inválido' })
  }
}
