import prisma from "../lib/prisma.js";
import type { LeaveRequest } from "@prisma/client";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
    LeaveRequestResponse,
} from "../types/leaveRequestTypes.js";

export default class LeaveRequestRepository {
    private RelationsInclude = {
        employee: {
            select: {
                id: true,
                name: true,
                department: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        },
        reviewer: {
            select: {
                id: true,
                email: true,
                role: true,
                employee: {
                    select: { id: true, name: true },
                },
            },
        },
    };

    async create(data: CreateLeaveRequest): Promise<LeaveRequestResponse> {
        return prisma.leaveRequest.create({
            data: data,
            include: this.RelationsInclude,
        });
    }

    async findAll(filter?: LeaveRequestFilter): Promise<LeaveRequestResponse[]> {
        if (filter) {
            return prisma.leaveRequest.findMany({
                where: {
                    startDate: {
                        gte: filter.startDate,
                    },
                    endDate: {
                        lte: filter.endDate,
                    },
                },
                include: this.RelationsInclude,
            });
        }
        return prisma.leaveRequest.findMany({
            include: this.RelationsInclude,
        });
    }

    async findByEmployee(id: string): Promise<LeaveRequestResponse[] | null> {
        return prisma.leaveRequest.findMany({
            where: {
                employeeId: id,
            },
            include: this.RelationsInclude,
        });
    }

    async findById(id: string): Promise<LeaveRequestResponse | null> {
        return prisma.leaveRequest.findUnique({
            where: {
                id: id,
            },
            include: this.RelationsInclude,
        });
    }

    async update(id: string, data: UpdateLeaveRequest): Promise<LeaveRequest> {
        return prisma.leaveRequest.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    async updateStatus(id: string, data: UpdateStatusLeaveRequest): Promise<LeaveRequest> {
        return prisma.leaveRequest.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.leaveRequest.delete({
            where: {
                id: id,
            },
        });
        return;
    }
}
