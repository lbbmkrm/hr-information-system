import LeaveRequestService from "../services/leaveRequest.service.js";
import type { Request, Response } from "express";
import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    LeaveRequestFilter,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
} from "../types/leavelRequestTypes.js";
import AppError from "../utils/AppError.js";
import type { jwtPayload } from "../lib/jwt.js";

export default class LeaveRequestController {
    private leaveRequestService: LeaveRequestService;

    constructor() {
        this.leaveRequestService = new LeaveRequestService();
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const leaveRequests: LeaveRequest[] =
                await this.leaveRequestService.getAllLeaveRequests(
                    req.user as jwtPayload,
                    req.validatedQuery as LeaveRequestFilter,
                );
            return res.status(200).json({
                status: "success",
                message: "Retrieved all Leave Requests successfully",
                data: leaveRequests,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const leaveRequest = await this.leaveRequestService.getLeaveRequest(
                req.user as jwtPayload,
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "Retrieved Leave Request successfully",
                data: leaveRequest,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public showByEmployee = async (req: Request, res: Response): Promise<Response> => {
        try {
            const leaveRequest = await this.leaveRequestService.getEmployeeLeaveRequest(
                req.user as jwtPayload,
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "Retrieved Leave Request successfully",
                data: leaveRequest,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public store = async (req: Request, res: Response): Promise<Response> => {
        try {
            const leaveRequest = await this.leaveRequestService.addLeaveRequest(
                req.user as jwtPayload,
                req.validatedBody as CreateLeaveRequest,
            );
            return res.status(201).json({
                status: "success",
                message: "Created Leave Request successfully",
                data: leaveRequest,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error: err,
            });
        }
    };

    public edit = async (req: Request, res: Response): Promise<Response> => {
        try {
            const leaveRequest = await this.leaveRequestService.updateLeaveRequest(
                req.user as jwtPayload,
                req.params.id as string,
                req.validatedBody as UpdateLeaveRequest,
            );
            return res.status(200).json({
                status: "success",
                message: "Updated Leave Request successfully",
                data: leaveRequest,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public editStatus = async (req: Request, res: Response): Promise<Response> => {
        try {
            const data: UpdateStatusLeaveRequest = req.validatedBody as UpdateStatusLeaveRequest;
            data.reviewedBy = req.user?.userId as string;
            const leaveRequest = await this.leaveRequestService.updateStatusLeaveRequest(
                req.user as jwtPayload,
                req.params.id as string,
                data,
            );

            return res.status(200).json({
                status: "success",
                message: "Updated Leave Request status successfully",
                data: leaveRequest,
            });
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };

    public destroy = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.leaveRequestService.deleteLeaveRequest(
                req.user as jwtPayload,
                req.params.id as string,
            );
            return res.status(200).json({
                status: "success",
                message: "Deleted Leave Request successfully",
            });
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.code).json({
                    status: "error",
                    message: err.message,
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };
}
