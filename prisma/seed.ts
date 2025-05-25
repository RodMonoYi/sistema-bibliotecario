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
      id: 1,
      nome: 'Administrador',
      email: 'admin@biblioteca.com',
      senha: senhaPadrao,
      tipo: TipoUsuario.ADMINISTRADOR,
    },
  })

  //Outro usuário administrador
  const rod = await prisma.usuario.upsert({
    where: { email: 'rod@biblioteca.com' },
    update: {},
    create: {
      id: 2,
      nome: 'Rodrigo Barreto',
      email: 'rod@biblioteca.com',
      senha: senhaPadrao,
      tipo: TipoUsuario.ADMINISTRADOR,
    },
  })

  // Usuário comum
  const usuario = await prisma.usuario.upsert({
    where: { email: 'usuario@biblioteca.com' },
    update: {},
    create: {
      id: 3,
      nome: 'Usuário Comum',
      email: 'usuario@biblioteca.com',
      senha: senhaPadrao,
    },
  })

  // Outro usuário comum
  const usuario2 = await prisma.usuario.upsert({
    where: { email: 'joao@biblioteca.com' },
    update: {},
    create: {
      id: 4,
      nome: 'João Silva',
      email: 'joao@biblioteca.com',
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
      {
        titulo: 'Percy Jackson e o Ladrão de Raios',
        autor: 'Rick Riordan',
        descricao: 'Aventuras de um semideus.',
        usuarioId: usuario.id,
      },
      {
        titulo: 'Harry Potter e a Pedra Filosofal',
        autor: 'J.K. Rowling',
        descricao: 'A história de um jovem bruxo.',
        usuarioId: rod.id,
      },
      
      {
        titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
        autor: 'J.R.R. Tolkien',
        descricao: 'A jornada de Frodo Bolseiro.',
        usuarioId: rod.id,
      },
      {
        titulo: 'A Revolução dos Bichos',
        autor: 'George Orwell',
        descricao: 'Uma fábula política sobre a Revolução Russa.',
        usuarioId: rod.id,
      },
      {
        titulo: '1984',
        autor: 'George Orwell',
        descricao: 'Uma distopia sobre um futuro totalitário.',
        usuarioId: admin.id,
      },
      {
        titulo: 'O Pequeno Príncipe',
        autor: 'Antoine de Saint-Exupéry',
        descricao: 'Uma história poética sobre a infância e a solidão.',
        usuarioId: usuario.id,
      },
      {
        titulo: 'A Arte da Guerra',
        autor: 'Sun Tzu',
        descricao: 'Um tratado militar sobre estratégia e tática.',
        usuarioId: rod.id,
      },
      {
        titulo: 'O Alquimista',
        autor: 'Paulo Coelho',
        descricao: 'A jornada de um jovem pastor em busca de seu destino.',
        usuarioId: usuario2.id,
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
