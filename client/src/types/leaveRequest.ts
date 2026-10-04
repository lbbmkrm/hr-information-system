import type { ROLE } from "./user.ts";
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
    employee: {
        id: string;
        name: string;
        user?: {
            id: string;
            email: string;
            role: ROLE;
            createdAt: string;
            updatedAt: string;
        };
    };
    reviewer?: {
        id: string;
        email: string;
        role: ROLE;
        employee?: {
            id: string;
            name: string;
        };
    };
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
