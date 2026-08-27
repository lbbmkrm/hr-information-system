import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import {
    validateBody,
    validatePathParams,
    validateQueryParams,
} from "../middlewares/validate.middleware.js";
import {
    CreateLeaveRequestSchema,
    UpdateLeaveRequestSchema,
    UpdateStatusLeaveRequestSchema,
    IdParamsSchema,
    QueryParamsSchema,
} from "../validators/leaveRequest.validator.js";
import LeaveRequestController from "../controllers/leaveRequest.controller.js";

const router = Router();
router.use(AuthMiddleware);
const leaveRequestController = new LeaveRequestController();

router.get("/", validateQueryParams(QueryParamsSchema), leaveRequestController.index);

router.get("/:id", validatePathParams(IdParamsSchema), leaveRequestController.show);

router.get(
    "/employees/:id",
    validatePathParams(IdParamsSchema),
    leaveRequestController.showByEmployee,
);

router.post("/", validateBody(CreateLeaveRequestSchema), leaveRequestController.store);

router.patch(
    "/:id",
    validatePathParams(IdParamsSchema),
    validateBody(UpdateLeaveRequestSchema),
    leaveRequestController.edit,
);

router.put(
    "/:id/review",
    validatePathParams(IdParamsSchema),
    validateBody(UpdateStatusLeaveRequestSchema),
    leaveRequestController.editStatus,
);

router.delete("/:id", validatePathParams(IdParamsSchema), leaveRequestController.destroy);

export default router;
