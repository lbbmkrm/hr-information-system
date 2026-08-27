import prisma from "./../lib/prisma.js";
import type { User, Role } from "./../generated/prisma/index.js";
import type { RegisterUserData, UpdateUserData } from "../types/userTypes.js";

export default class UserRepository {
    async create(data: RegisterUserData): Promise<User> {
        return prisma.user.create({
            data: data,
        });
    }

    async findAll(filter?: Role): Promise<User[]> {
        if (!filter) {
            return prisma.user.findMany();
        }
        return prisma.user.findMany({
            where: {
                role: filter,
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async update(id: string, data: UpdateUserData): Promise<User | null> {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: data,
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
