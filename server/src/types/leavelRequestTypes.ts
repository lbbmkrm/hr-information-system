import { LeaveStatus, type Role } from "../generated/prisma/index.js";

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

export interface EmployeeUserDto {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmployeeSummaryDto {
    id: string;
    name: string;
    user: EmployeeUserDto | null;
}

export interface ReviewerEmployeeDto {
    id: string;
    name: string;
}

export interface ReviewerDto {
    id: string;
    email: string;
    role: Role;
    employee: ReviewerEmployeeDto | null;
}

export interface LeaveRequestResponse {
    id: string;
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    status: LeaveStatus;
    reviewedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    employee: EmployeeSummaryDto;
    reviewer: ReviewerDto | null;
}
