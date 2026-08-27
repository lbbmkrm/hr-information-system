import { LeaveStatus } from "../generated/prisma/index.js";

export interface CreateLeaveRequest {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
}

export interface UpdateLeaveRequest {
    startDate?: Date;
    endDate?: Date;
    reason?: string | null;
}

export interface UpdateStatusLeaveRequest {
    status: LeaveStatus;
    reviewedBy: string;
}

export interface LeaveRequestFilter {
    startDate: Date;
    endDate: Date;
}
