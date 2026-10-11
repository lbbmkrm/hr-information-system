import type { Role } from "../../src/generated/prisma/index.js";
export declare function createUserWithToken(overrides?: {
    email?: string;
    password?: string;
    role?: Role;
}): Promise<{
    user: {
        id: string;
        email: string;
        password: string;
        role: import("../../src/generated/prisma/index.js").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    };
    token: string;
}>;
//# sourceMappingURL=authHelper.d.ts.map
