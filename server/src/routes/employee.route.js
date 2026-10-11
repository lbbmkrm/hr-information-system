import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateBody, validatePathParams, validateQueryParams, } from "../middlewares/validate.middleware.js";
import { CreateEmployeeSchema, UpdateEmployeeSchema, GetEmployeeSchema, IdParamsSchema, } from "../validators/employee.validator.js";
import EmployeeController from "../controllers/employee.controller.js";
const router = Router();
const employeeController = new EmployeeController();
router.use(authMiddleware);
router.get("/", validateQueryParams(GetEmployeeSchema), employeeController.index);
router.get("/user/:id", authMiddleware, validatePathParams(IdParamsSchema), employeeController.showByUser);
router.get("/:id", validatePathParams(IdParamsSchema), employeeController.show);
router.post("/", validateBody(CreateEmployeeSchema), employeeController.store);
router.patch("/:id", validatePathParams(IdParamsSchema), validateBody(UpdateEmployeeSchema), employeeController.edit);
router.delete("/:id", validatePathParams(IdParamsSchema), employeeController.destroy);
export default router;
//# sourceMappingURL=employee.route.js.map