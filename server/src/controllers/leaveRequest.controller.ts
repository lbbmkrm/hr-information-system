import LeaveRequestService from "../services/leaveRequest.service.js";
import type { Request, Response } from "express";
import type {
    CreateLeaveRequest,
    LeaveRequestFilter,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
} from "../types/leaveRequestTypes.js";
import type { jwtPayload } from "../lib/jwt.js";

export default class LeaveRequestController {
    private leaveRequestService: LeaveRequestService;

    constructor() {
        this.leaveRequestService = new LeaveRequestService();
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        const leaveRequests = await this.leaveRequestService.getAllLeaveRequests(
            req.user as jwtPayload,
            req.validatedQuery as LeaveRequestFilter,
        );

        return res.status(200).json({
            status: "success",
            message: "Data pengajuan cuti berhasil dimuat.",
            data: leaveRequests,
        });
    };

    public show = async (req: Request, res: Response): Promise<Response> => {
        const leaveRequest = await this.leaveRequestService.getLeaveRequest(
            req.user as jwtPayload,
            req.params.id as string,
        );

        return res.status(200).json({
            status: "success",
            message: "Detail pengajuan cuti berhasil dimuat.",
            data: leaveRequest,
        });
    };

    public showByEmployee = async (req: Request, res: Response): Promise<Response> => {
        const leaveRequest = await this.leaveRequestService.getEmployeeLeaveRequest(
            req.user as jwtPayload,
            req.params.id as string,
        );

        return res.status(200).json({
            status: "success",
            message: "Detail pengajuan cuti karyawan berhasil dimuat.",
            data: leaveRequest,
        });
    };

    public store = async (req: Request, res: Response): Promise<Response> => {
        const leaveRequest = await this.leaveRequestService.addLeaveRequest(
            req.user as jwtPayload,
            req.validatedBody as CreateLeaveRequest,
        );

        return res.status(201).json({
            status: "success",
            message: "Pengajuan cuti baru berhasil dikirim.",
            data: leaveRequest,
        });
    };

    public edit = async (req: Request, res: Response): Promise<Response> => {
        const leaveRequest = await this.leaveRequestService.updateLeaveRequest(
            req.user as jwtPayload,
            req.params.id as string,
            req.validatedBody as UpdateLeaveRequest,
        );

        return res.status(200).json({
            status: "success",
            message: "Data pengajuan cuti berhasil diperbarui.",
            data: leaveRequest,
        });
    };

    public editStatus = async (req: Request, res: Response): Promise<Response> => {
        const data: UpdateStatusLeaveRequest = req.validatedBody as UpdateStatusLeaveRequest;
        data.reviewedBy = req.user?.userId as string;

        const leaveRequest = await this.leaveRequestService.updateStatusLeaveRequest(
            req.user as jwtPayload,
            req.params.id as string,
            data,
        );

        return res.status(200).json({
            status: "success",
            message: "Status pengajuan cuti berhasil diperbarui.",
            data: leaveRequest,
        });
    };

    public destroy = async (req: Request, res: Response): Promise<Response> => {
        await this.leaveRequestService.deleteLeaveRequest(
            req.user as jwtPayload,
            req.params.id as string,
        );

        return res.status(200).json({
            status: "success",
            message: "Pengajuan cuti berhasil dihapus.",
        });
    };
}
