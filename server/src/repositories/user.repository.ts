import prisma from "./../lib/prisma.js";
import { type User, Prisma } from "./../generated/prisma/index.js";
import type {
    CreateUserData,
    GetUsersFilter,
    UpdateUserData,
    UsersResponse,
    UserResponse,
} from "../types/userTypes.js";

export default class UserRepository {
    private userReturnFilter = {
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
    async create(data: CreateUserData): Promise<UserResponse> {
        return prisma.user.create({
            data: data,
            select: this.userReturnFilter,
        });
    }

    async findAll(filter?: GetUsersFilter): Promise<UsersResponse[]> {
        const where: Prisma.UserWhereInput = {};

        if (filter?.role !== undefined) {
            where.role = filter.role;
        }

        if (filter?.createdAfter || filter?.createdBefore) {
            const createdAtFilter: { gte?: Date; lte?: Date } = {};
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
            },
        });
    }

    async findById(id: string): Promise<UserResponse | null> {
        return prisma.user.findUnique({
            where: {
                id: id,
            },
            select: this.userReturnFilter,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async update(id: string, data: UpdateUserData): Promise<UserResponse | null> {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: data,
            select: this.userReturnFilter,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });
    }
}
