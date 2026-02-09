import { Router } from "express";
import atendimentoController, { listarAnexos } from "../controllers/atendimentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const AtendimentoRoutes = Router();

AtendimentoRoutes.use(authMiddleware)

AtendimentoRoutes.get("/", atendimentoController.list)
AtendimentoRoutes.post("/", atendimentoController.create)
AtendimentoRoutes.patch("/:id", atendimentoController.update)
AtendimentoRoutes.get('/:id/anexos', listarAnexos)

export default AtendimentoRoutes