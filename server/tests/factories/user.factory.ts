import prisma from "../prisma.js";
import type { Prisma } from "@prisma/client";

export async function createUser(overrides: Partial<Prisma.UserCreateInput> = {}) {
    return prisma.user.create({
        data: {
            email: `user-${crypto.randomUUID()}@test.com`,
            password: "hashed-password",
            ...overrides,
        },
    });
}
