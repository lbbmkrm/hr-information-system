import { Router } from "express";
import authRoute from "./auth.route.js";
import employeeRoute from "./employee.route.js";
import leaveRequestRoute from "./leaveRequest.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/employees", employeeRoute);
router.use("/leave-requests", leaveRequestRoute);
export default router;
