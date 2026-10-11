// tests/factories/user.factory.ts
import prisma from "../prisma.js";
export async function createUser(overrides = {}) {
    return prisma.user.create({
        data: {
            email: `user-${crypto.randomUUID()}@test.com`,
            password: "hashed-password",
            ...overrides,
        },
    });
}
//# sourceMappingURL=user.factory.js.map