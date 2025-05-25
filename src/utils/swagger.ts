import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "API de Biblioteca", version: "1.0.0", description: "Api para um sistema bibliotecário para a disciplina de Integração de sistemas." },
    servers: [{ url: "https://sistema-bibliotecario-production-56a2.up.railway.app/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Documentação por JSDoc
});

export default swaggerSpec;
