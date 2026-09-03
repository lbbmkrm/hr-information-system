import { Router } from "express";
import authRoute from "./auth.route.js";
import employeeRoute from "./employee.route.js";
import leaveRequestRoute from "./leaveRequest.route.js";
import userRoute from "./user.route.js";
const router = Router();

router.use("/auth", authRoute);
router.use("/employees", employeeRoute);
router.use("/leave-requests", leaveRequestRoute);
router.use("/users", userRoute);
export default router;
