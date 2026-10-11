import type { Role } from "./auth.ts";
import type { Status } from "./leaveRequest.ts";

export type DashboardStatVariant =
    "employees" | "users" | "requests" | "pending" | "approved" | "rejected";

export interface DashboardStat {
    key: string;
    label: string;
    value: number;
    variant: DashboardStatVariant;
}

export interface RecentLeaveRequest {
    id: string;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: Status;
    employee: { id: string; name: string; department: string };
}

export interface DashboardData {
    role: Role;
    stats: DashboardStat[];
    recentLeaveRequests: RecentLeaveRequest[];
}
