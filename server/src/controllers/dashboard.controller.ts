import { type Request, type Response } from "express";
import type { jwtPayload } from "../lib/jwt.js";
import DashboardService from "../services/dashboard.service.js";

export default class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    public show = async (req: Request, res: Response): Promise<Response> => {
        const dashboard = await this.dashboardService.getDashboard(req.user as jwtPayload);

        return res.status(200).json({
            status: "success",
            message: "Data dashboard berhasil dimuat.",
            data: dashboard,
        });
    };
}
