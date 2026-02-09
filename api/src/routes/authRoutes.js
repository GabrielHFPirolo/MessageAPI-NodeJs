import { Router } from "express";
import { loginController } from "../controllers/authController.js";

const AuthRoutes = Router()

AuthRoutes.post('/login', loginController)

export default AuthRoutes