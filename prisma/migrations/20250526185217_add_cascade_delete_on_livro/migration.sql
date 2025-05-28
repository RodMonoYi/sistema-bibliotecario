-- DropForeignKey
ALTER TABLE "Livro" DROP CONSTRAINT "Livro_usuarioId_fkey";

-- AddForeignKey
ALTER TABLE "Livro" ADD CONSTRAINT "Livro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
