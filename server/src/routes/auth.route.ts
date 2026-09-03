import { Router } from "express";
import { validateBody } from "../middlewares/validate.middleware.js";
import { RegisterSchema, LoginSchema } from "../validators/auth.validator.js";
import AuthController from "../controllers/auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post("/login", validateBody(LoginSchema), authController.login);
export default router;
