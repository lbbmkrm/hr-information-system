import type { LeaveStatus, Role } from "../generated/prisma/index.js";
import type { jwtPayload } from "../lib/jwt.js";
type DashboardStatVariant =
    "employees" | "users" | "requests" | "pending" | "approved" | "rejected";
interface DashboardStat {
    key: string;
    label: string;
    value: number;
    variant: DashboardStatVariant;
}
interface RecentLeaveRequest {
    id: string;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    status: LeaveStatus;
    employee: {
        id: string;
        name: string;
        department: string;
    };
}
interface DashboardData {
    role: Role;
    stats: DashboardStat[];
    recentLeaveRequests: RecentLeaveRequest[];
}
export default class DashboardService {
    getDashboard(user: jwtPayload): Promise<DashboardData>;
    private getAdminDashboard;
    private getHrDashboard;
    private getEmployeeDashboard;
    private getRecentLeaveRequests;
}
export {};
//# sourceMappingURL=dashboard.service.d.ts.map
