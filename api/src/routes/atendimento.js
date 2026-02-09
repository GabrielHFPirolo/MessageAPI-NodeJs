import { Router } from "express";
<<<<<<< HEAD
import atendimentoController, { listarAnexos } from "../controllers/atendimentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const AtendimentoRoutes = Router();

AtendimentoRoutes.use(authMiddleware)

AtendimentoRoutes.get("/", atendimentoController.list)
AtendimentoRoutes.post("/", atendimentoController.create)
AtendimentoRoutes.patch("/:id", atendimentoController.update)
AtendimentoRoutes.get('/:id/anexos', listarAnexos)

export default AtendimentoRoutes
=======
import atendimentoController from "../controllers/atendimentoController.js";

const routes = Router();

routes.get("/", atendimentoController.list)
routes.post("/", atendimentoController.create)
routes.patch("/:id", atendimentoController.update)

export default routes
>>>>>>> 34c235853d7b814ea50a75510e1625ad6ee1d0e4
