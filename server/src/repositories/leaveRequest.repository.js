import prisma from "../lib/prisma.js";
export default class LeaveRequestRepository {
    RelationsInclude = {
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
    async create(data) {
        return prisma.leaveRequest.create({
            data: data,
            include: this.RelationsInclude,
        });
    }
    async findAll(filter) {
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
    async findByEmployee(id) {
        return prisma.leaveRequest.findMany({
            where: {
                employeeId: id,
            },
            include: this.RelationsInclude,
        });
    }
    async findById(id) {
        return prisma.leaveRequest.findUnique({
            where: {
                id: id,
            },
            include: this.RelationsInclude,
        });
    }
    async update(id, data) {
        return prisma.leaveRequest.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
    async updateStatus(id, data) {
        return prisma.leaveRequest.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
    async delete(id) {
        await prisma.leaveRequest.delete({
            where: {
                id: id,
            },
        });
        return;
    }
}
//# sourceMappingURL=leaveRequest.repository.js.map