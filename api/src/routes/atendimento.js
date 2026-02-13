import { Router } from "express";
import atendimentoController, { listarAnexos, ListarNotas, CriarNotas } from "../controllers/atendimentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const AtendimentoRoutes = Router();

AtendimentoRoutes.use(authMiddleware)

AtendimentoRoutes.get("/", atendimentoController.list)
AtendimentoRoutes.post("/", atendimentoController.create)
AtendimentoRoutes.patch("/:id", atendimentoController.update)
AtendimentoRoutes.get('/:id/anexos', listarAnexos)
AtendimentoRoutes.get('/:id/notas', ListarNotas)
AtendimentoRoutes.post('/:id/notas', CriarNotas)

export default AtendimentoRoutes