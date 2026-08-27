import prisma from "../lib/prisma.js";
import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
} from "../types/leavelRequestTypes.js";

export default class LeaveRequestRepository {
    async create(data: CreateLeaveRequest): Promise<LeaveRequest> {
        return prisma.leaveRequest.create({
            data: data,
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        position: true,
                        department: true,
                    },
                },
            },
        });
    }

    async findAll(filter?: LeaveRequestFilter): Promise<LeaveRequest[]> {
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
            });
        }
        return prisma.leaveRequest.findMany();
    }

    async findByEmployee(id: string): Promise<LeaveRequest[] | null> {
        return prisma.leaveRequest.findMany({
            where: {
                employeeId: id,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        position: true,
                        department: true,
                    },
                },
            },
        });
    }

    async findById(id: string): Promise<LeaveRequest | null> {
        return prisma.leaveRequest.findUnique({
            where: {
                id: id,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        position: true,
                        department: true,
                    },
                },
            },
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
