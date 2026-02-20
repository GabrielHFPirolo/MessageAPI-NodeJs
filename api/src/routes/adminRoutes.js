import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { somenteAdmin } from "../jwt.js";
import adminController from "../controllers/adminController.js";

const AdminRoutes = Router()
AdminRoutes.use(authMiddleware)

AdminRoutes.get(
    '/atividade',
    somenteAdmin,
    adminController.atividade
)

export default AdminRoutes