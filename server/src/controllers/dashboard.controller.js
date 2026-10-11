import {} from "express";
import DashboardService from "../services/dashboard.service.js";
export default class DashboardController {
    dashboardService;
    constructor() {
        this.dashboardService = new DashboardService();
    }
    show = async (req, res) => {
        const dashboard = await this.dashboardService.getDashboard(req.user);
        return res.status(200).json({
            status: "success",
            message: "Data dashboard berhasil dimuat.",
            data: dashboard,
        });
    };
}
//# sourceMappingURL=dashboard.controller.js.map