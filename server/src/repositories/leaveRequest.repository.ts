import prisma from "../lib/prisma.js";
import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
    LeaveRequestResponse,
} from "../types/leavelRequestTypes.js";

export default class LeaveRequestRepository {
    async create(data: CreateLeaveRequest): Promise<LeaveRequestResponse> {
        return prisma.leaveRequest.create({
            data: data,
            include: {
                employee: true,
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

    async findByEmployee(id: string): Promise<LeaveRequestResponse[] | null> {
        return prisma.leaveRequest.findMany({
            where: {
                employeeId: id,
            },
            include: {
                employee: true,
            },
        });
    }

    async findById(id: string): Promise<LeaveRequestResponse | null> {
        return prisma.leaveRequest.findUnique({
            where: {
                id: id,
            },
            include: {
                employee: true,
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
