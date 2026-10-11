import type { Prisma } from "../../src/generated/prisma/index.js";
export declare function createUser(overrides?: Partial<Prisma.UserCreateInput>): Promise<{
    id: string;
    email: string;
    password: string;
    role: import("../../src/generated/prisma/index.js").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=user.factory.d.ts.map
