import { z } from 'zod'

export const schemaLivro = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  autor: z.string().min(1, 'Autor é obrigatório'),
  descricao: z.string().optional(),
})
