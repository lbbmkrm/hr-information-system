import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateBody, validatePathParams, validateQueryParams, } from "../middlewares/validate.middleware.js";
import { CreateUserSchema, GetUsersFilterSchema, IdParamsSchema, UpdateUserSchema, } from "../validators/user.validator.js";
const router = Router();
router.use(authMiddleware);
const userController = new UserController();
router.get("/", validateQueryParams(GetUsersFilterSchema), userController.index);
router.get("/:id", validatePathParams(IdParamsSchema), userController.show);
router.post("/", validateBody(CreateUserSchema), userController.store);
router.patch("/:id", validatePathParams(IdParamsSchema), validateBody(UpdateUserSchema), userController.edit);
router.delete("/:id", validatePathParams(IdParamsSchema), userController.destroy);
export default router;
//# sourceMappingURL=user.route.js.map