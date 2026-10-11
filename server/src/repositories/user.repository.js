import prisma from "./../lib/prisma.js";
import { Prisma } from "./../generated/prisma/index.js";
export default class UserRepository {
    userReturnFilter = {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        employee: {
            select: {
                id: true,
                name: true,
                position: true,
                department: true,
            },
        },
    };
    async create(data) {
        return prisma.user.create({
            data: data,
            select: this.userReturnFilter,
        });
    }
    async findAll(filter) {
        const where = {};
        if (filter?.assigned === false) {
            where.employee = null;
        }
        else if (filter?.assigned === true) {
            where.employee = { isNot: null };
        }
        if (filter?.role) {
            where.role = filter.role;
        }
        if (filter?.createdAfter || filter?.createdBefore) {
            const createdAtFilter = {};
            if (filter.createdAfter) {
                createdAtFilter.gte = filter.createdAfter;
            }
            if (filter.createdBefore) {
                createdAtFilter.lte = filter.createdBefore;
            }
            where.createdAt = createdAtFilter;
        }
        return prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                employee: true,
            },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: {
                id: id,
            },
            select: this.userReturnFilter,
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
    async update(id, data) {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: data,
            select: this.userReturnFilter,
        });
    }
    async delete(id) {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });
    }
}
//# sourceMappingURL=user.repository.js.map