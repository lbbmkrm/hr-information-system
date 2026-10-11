import type { ROLE } from "./user.ts";
export type Status = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: Status;
    reviewedBy: string | null;
    createdAt: string;
    updatedAt: string;
    employee: {
        id: string;
        name: string;
        department: string;
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
    reason?: string | null;
}

export interface LeaveRequestEditPayload {
    startDate?: string;
    endDate?: string;
    reason?: string | null;
}

export interface LeaveRequestUpdateStatus {
    status: Status;
}

export interface LeaveRequestFilter {
    startDate: Date;
    endDate: Date;
}
