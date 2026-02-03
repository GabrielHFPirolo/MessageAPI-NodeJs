import { Router } from "express";
import atendimentoController from "../controllers/atendimentoController.js";

const routes = Router();

routes.get("/", atendimentoController.list)
routes.post("/", atendimentoController.create)
routes.patch("/:id", atendimentoController.update)

export default routes