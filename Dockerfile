# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: produção
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY .env ./

RUN npm install -g prisma
RUN npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc typescript ts-node ts-node-dev

CMD ["node", "dist/index.js"]
