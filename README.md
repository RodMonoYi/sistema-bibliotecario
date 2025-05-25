# 📚 API RESTful – Sistema de Biblioteca

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

API para gestão de usuários e catalogação de livros em uma biblioteca. Dockerizada pronta para ambiente de desenvolvimento.

---

## ✅ Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/) (Linux/macOS ou [Git Bash no Windows](https://gitforwindows.org/))

---

## 🚀 Instruções de uso (ambiente dev)

### 1. Clone o repositório

```bash
git clone https://seurepositorio.com/biblioteca-api.git
cd biblioteca-api
```

### 2. Crie o `.env`

```env
DATABASE_URL="postgresql://usuario:senha@postgres:5432/biblioteca?schema=public"
JWT_SECRET=suaChaveSecretaJWT
PORT=3333
```

### 3. Suba o ambiente

```bash
make dev
```

Esse comando:
- Faz build dos containers
- Aplica migrations e o seed
- Gera binários Prisma compatíveis com Docker
- Inicia Prisma Studio
- Exibe logs da API

---

## 🌐 Acessos

| Serviço          | URL                            |
|------------------|---------------------------------|
| API              | http://localhost:3333           |
| Swagger (Docs)   | http://localhost:3333/docs      |
| Prisma Studio    | http://localhost:5555           |

---

## 🧪 Usuários de exemplo

| Tipo       | Email                      | Senha   |
|------------|----------------------------|---------|
| Admin      | admin@biblioteca.com       | 123456  |
| Rodrigo    | rod@biblioteca.com         | 123456  |
| João       | joao@biblioteca.com        | 123456  |
| Usuário    | usuario@biblioteca.com     | 123456  |

---

## 🛠 Comandos úteis via Makefile

| Comando                | Ação                                                       |
|------------------------|------------------------------------------------------------|
| `make dev`             | Inicia a aplicação com tudo configurado                    |
| `make stop`            | Para os containers                                         |
| `make clean`           | Remove containers e volumes (reseta banco)                 |
| `make seed`            | Executa manualmente o seed                                 |
| `make migrate`         | Aplica migrations                                          |
| `make studio`          | Abre Prisma Studio                                         |
| `make build`           | Compila TypeScript para `/dist`                            |
| `make api`             | Abre um terminal dentro do container da API                |
| `make migrate-create name=nome` | Cria uma nova migration com nome personalizado    |

---

## 📁 Estrutura de Pastas

```
.
├── prisma/               → Schema e seed do banco
├── src/                  → Código-fonte da API
├── dist/                 → Código compilado
├── Dockerfile.dev        → Docker para dev
├── docker-compose.dev.yml
├── .env                  → Configurações locais
├── Makefile              → Comandos de automação
└── .dockerignore
```

