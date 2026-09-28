import type { EmployeeName } from "./employee.ts";
import type { UserWithEmployee } from "./user.ts";
export type status = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: status;
    reviewedBy: string | null;
    createdAt: string;
    updatedAt: string;
    employee: EmployeeName;
    reviewer?: UserWithEmployee;
}
export interface LeaveRequestPayload {
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string | null;
}

export interface LeaveRequestEditPayload {
    startDate?: string;
    endDate?: string;
    reason?: string | null;
}

export interface LeaveRequestUpdateStatus {
    status: status;
}

export interface LeaveRequestFilter {
    startDate: Date;
    endDate: Date;
}
