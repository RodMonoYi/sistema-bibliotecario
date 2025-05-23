import { z } from 'zod'

export const schemaRegistro = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const schemaLogin = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha inválida'),
})
