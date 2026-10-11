import { describe, expect, it } from "vitest";
import { Role } from "../../src/generated/prisma/index.js";
import { createUser } from "./user.factory.js";
describe("User Factory", () => {
    it("should create user with default data", async () => {
        const user = await createUser();
        expect(user.id).toBeDefined();
        expect(user.email).toContain("@test.com");
        expect(user.password).toBe("hashed-password");
        expect(user.role).toBe(Role.EMPLOYEE);
    });
    it("should allow overriding user data", async () => {
        const user = await createUser({
            email: "admin@test.com",
            role: Role.ADMIN,
        });
        expect(user.email).toBe("admin@test.com");
        expect(user.role).toBe(Role.ADMIN);
    });
});
//# sourceMappingURL=user.factory.test.js.map