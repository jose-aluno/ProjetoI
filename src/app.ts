import express from "express";
import { RegisterRoutes } from "./route/routes";
import { setupSwagger } from "./config/swagger";
import { inicializarTabelas } from "./database/initializer";

async function main() {
  await inicializarTabelas()

  const app = express()
  app.use(express.json())
  const port = 3090

  const apiRouter = express.Router();
  RegisterRoutes(apiRouter);
  app.use("/library", apiRouter);

  setupSwagger(app);

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/library`)
  })
}

main().catch((err) => {
  console.error("Erro ao iniciar o servidor:", err)
})
