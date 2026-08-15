import {Router} from "express";
import validate from '../middlewares/validate.middleware.js'
import {RegisterSchema, LoginSchema} from "../validators/auth.validator.js";
import AuthController from "../controllers/auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post('/register', validate(RegisterSchema),authController.register);
router.post('/login', validate(LoginSchema), authController.login);
export default router;