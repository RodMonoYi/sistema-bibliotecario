# Caminho do docker-compose de desenvolvimento
DOCKER_COMPOSE = docker compose -f docker-compose.dev.yml

# Subir ambiente de desenvolvimento
dev:
	$(DOCKER_COMPOSE) up --build --detach
	$(DOCKER_COMPOSE) exec api npx prisma generate
	$(DOCKER_COMPOSE) exec -d api npx prisma studio
	$(DOCKER_COMPOSE) logs -f api

# Parar containers
stop:
	$(DOCKER_COMPOSE) down

# Parar e remover volumes
clean:
	$(DOCKER_COMPOSE) down -v

# Compilar TypeScript
build:
	npm run build

# Rodar seed manualmente
seed:
	$(DOCKER_COMPOSE) exec api npx prisma db seed

# Aplicar migrations
migrate:
	$(DOCKER_COMPOSE) exec api npx prisma migrate deploy

# Prisma Studio (interface web para o banco)
studio:
	$(DOCKER_COMPOSE) exec api npx prisma studio

# Criar nova migration (ex: make migrate-create name=addCampo)
migrate-create:
	$(DOCKER_COMPOSE) exec api npx prisma migrate dev --name $(name)

# Acessar terminal do container
api:
	$(DOCKER_COMPOSE) exec api sh
