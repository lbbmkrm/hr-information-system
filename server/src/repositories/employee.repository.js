import prisma from "../lib/prisma.js";
export default class EmployeeRepository {
    async create(data) {
        return prisma.employee.create({
            data: data,
        });
    }
    async findAll(filter) {
        if (!filter) {
            return prisma.employee.findMany();
        }
        return prisma.employee.findMany({
            where: filter,
        });
    }
    async findById(id) {
        return prisma.employee.findUnique({
            where: {
                id: id,
            },
        });
    }
    async findByUserId(userId) {
        return prisma.employee.findUnique({
            where: {
                userId: userId,
            },
        });
    }
    async update(id, data) {
        return prisma.employee.update({
            where: {
                id: id,
            },
            data: data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        await prisma.employee.delete({
            where: {
                id: id,
            },
        });
    }
}
//# sourceMappingURL=employee.repository.js.map