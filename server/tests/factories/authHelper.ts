import bcrypt from "bcrypt";
import prisma from "../prisma.js";
import { jwtSignature } from "../../src/lib/jwt.js";
import type { Role } from "../../src/generated/prisma/index.js";

export async function createUserWithToken(overrides?: {
    email?: string;
    password?: string;
    role?: Role;
}) {
    const plainPassword = overrides?.password ?? "password123";
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = await prisma.user.create({
        data: {
            email: overrides?.email ?? `user-${crypto.randomUUID()}@test.com`,
            password: hashedPassword,
            ...(overrides?.role !== undefined && { role: overrides.role }),
        },
    });

    const token = jwtSignature({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return { user, token };
}