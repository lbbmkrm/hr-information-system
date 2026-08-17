import { Router } from "express";
import authRoute from "./auth.route.js";
import employeeRoute from "./employee.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/employees", employeeRoute);

export default router;