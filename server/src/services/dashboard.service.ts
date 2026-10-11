import type { LeaveStatus, Role } from "@prisma/client";
import type { jwtPayload } from "../lib/jwt.js";
import prisma from "../lib/prisma.js";

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
    async getDashboard(user: jwtPayload): Promise<DashboardData> {
        if (user.role === "EMPLOYEE") {
            return this.getEmployeeDashboard(user);
        }

        if (user.role === "HR") {
            return this.getHrDashboard(user);
        }

        return this.getAdminDashboard(user);
    }

    private async getAdminDashboard(user: jwtPayload): Promise<DashboardData> {
        const [
            totalEmployees,
            totalUsers,
            totalLeaveRequests,
            approvedLeaveRequests,
            recentLeaveRequests,
        ] = await Promise.all([
            prisma.employee.count(),
            prisma.user.count(),
            prisma.leaveRequest.count(),
            prisma.leaveRequest.count({
                where: {
                    status: "APPROVED",
                },
            }),
            this.getRecentLeaveRequests(),
        ]);

        return {
            role: user.role,
            stats: [
                {
                    key: "totalEmployees",
                    label: "Total Karyawan",
                    value: totalEmployees,
                    variant: "employees",
                },
                {
                    key: "totalUsers",
                    label: "Total User",
                    value: totalUsers,
                    variant: "users",
                },
                {
                    key: "totalLeaveRequests",
                    label: "Total Pengajuan",
                    value: totalLeaveRequests,
                    variant: "requests",
                },
                {
                    key: "approvedLeaveRequests",
                    label: "Disetujui",
                    value: approvedLeaveRequests,
                    variant: "approved",
                },
            ],
            recentLeaveRequests,
        };
    }

    private async getHrDashboard(user: jwtPayload): Promise<DashboardData> {
        const [
            totalEmployees,
            pendingLeaveRequests,
            approvedLeaveRequests,
            rejectedLeaveRequests,
            recentLeaveRequests,
        ] = await Promise.all([
            prisma.employee.count(),
            prisma.leaveRequest.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma.leaveRequest.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma.leaveRequest.count({
                where: {
                    status: "REJECTED",
                },
            }),
            this.getRecentLeaveRequests(),
        ]);

        return {
            role: user.role,
            stats: [
                {
                    key: "pendingLeaveRequests",
                    label: "Menunggu Review",
                    value: pendingLeaveRequests,
                    variant: "pending",
                },
                {
                    key: "approvedLeaveRequests",
                    label: "Disetujui",
                    value: approvedLeaveRequests,
                    variant: "approved",
                },
                {
                    key: "rejectedLeaveRequests",
                    label: "Ditolak",
                    value: rejectedLeaveRequests,
                    variant: "rejected",
                },
                {
                    key: "totalEmployees",
                    label: "Total Karyawan",
                    value: totalEmployees,
                    variant: "employees",
                },
            ],
            recentLeaveRequests,
        };
    }

    private async getEmployeeDashboard(user: jwtPayload): Promise<DashboardData> {
        const employee = await prisma.employee.findUnique({
            where: {
                userId: user.userId,
            },
            select: {
                id: true,
            },
        });

        if (!employee) {
            return {
                role: user.role,
                stats: [
                    {
                        key: "myLeaveRequests",
                        label: "Pengajuan Saya",
                        value: 0,
                        variant: "requests",
                    },
                    {
                        key: "myPendingLeaveRequests",
                        label: "Menunggu",
                        value: 0,
                        variant: "pending",
                    },
                    {
                        key: "myApprovedLeaveRequests",
                        label: "Disetujui",
                        value: 0,
                        variant: "approved",
                    },
                    {
                        key: "myRejectedLeaveRequests",
                        label: "Ditolak",
                        value: 0,
                        variant: "rejected",
                    },
                ],
                recentLeaveRequests: [],
            };
        }

        const [
            myLeaveRequests,
            myPendingLeaveRequests,
            myApprovedLeaveRequests,
            myRejectedLeaveRequests,
            recentLeaveRequests,
        ] = await Promise.all([
            prisma.leaveRequest.count({
                where: {
                    employeeId: employee.id,
                },
            }),
            prisma.leaveRequest.count({
                where: {
                    employeeId: employee.id,
                    status: "PENDING",
                },
            }),
            prisma.leaveRequest.count({
                where: {
                    employeeId: employee.id,
                    status: "APPROVED",
                },
            }),
            prisma.leaveRequest.count({
                where: {
                    employeeId: employee.id,
                    status: "REJECTED",
                },
            }),
            this.getRecentLeaveRequests(employee.id),
        ]);

        return {
            role: user.role,
            stats: [
                {
                    key: "myLeaveRequests",
                    label: "Pengajuan Saya",
                    value: myLeaveRequests,
                    variant: "requests",
                },
                {
                    key: "myPendingLeaveRequests",
                    label: "Menunggu",
                    value: myPendingLeaveRequests,
                    variant: "pending",
                },
                {
                    key: "myApprovedLeaveRequests",
                    label: "Disetujui",
                    value: myApprovedLeaveRequests,
                    variant: "approved",
                },
                {
                    key: "myRejectedLeaveRequests",
                    label: "Ditolak",
                    value: myRejectedLeaveRequests,
                    variant: "rejected",
                },
            ],
            recentLeaveRequests,
        };
    }

    private async getRecentLeaveRequests(employeeId?: string): Promise<RecentLeaveRequest[]> {
        const where = employeeId
            ? {
                  employeeId,
              }
            : {};

        return prisma.leaveRequest.findMany({
            where,
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        department: true,
                    },
                },
            },
        });
    }
}
