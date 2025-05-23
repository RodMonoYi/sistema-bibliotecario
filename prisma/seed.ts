import { PrismaClient, TipoUsuario } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Cria senha criptografada
  const senhaPadrao = await bcrypt.hash('123456', 10)

  // Usuário administrador
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@biblioteca.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@biblioteca.com',
      senha: senhaPadrao,
      tipo: TipoUsuario.ADMINISTRADOR,
    },
  })

  // Usuário comum
  const usuario = await prisma.usuario.upsert({
    where: { email: 'usuario@biblioteca.com' },
    update: {},
    create: {
      nome: 'Usuário Comum',
      email: 'usuario@biblioteca.com',
      senha: senhaPadrao,
    },
  })

  // Livros de exemplo
  await prisma.livro.createMany({
    data: [
      {
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        descricao: 'Clássico da literatura brasileira.',
        usuarioId: usuario.id,
      },
      {
        titulo: 'O Hobbit',
        autor: 'J.R.R. Tolkien',
        descricao: 'Aventuras da Terra Média.',
        usuarioId: admin.id,
      },
    ],
  })

  console.log('Seed executado com sucesso.')
}

main()
  .catch((erro) => {
    console.error(erro)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
