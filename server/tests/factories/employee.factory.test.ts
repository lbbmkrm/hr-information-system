import { describe, expect, it } from "vitest";
import { createEmployee } from "./employee.factory.js";
import { createUser } from "./user.factory.js";

describe("Employee Factory", () => {
    it("should create employee", async () => {
        const employee = await createEmployee();

        expect(employee.id).toBeDefined();
        expect(employee.name).toBe("John Doe");
        expect(employee.position).toBe("Software Engineer");
        expect(employee.department).toBe("IT");
        expect(employee.joinDate).toEqual(new Date("2025-01-01"));
        expect(employee.phone).toBe("081234567890");
        expect(employee.userId).toBeNull();
    });

    it("should create employee associated with user", async () => {
        const user = await createUser();

        const employee = await createEmployee({
            user: {
                connect: {
                    id: user.id,
                },
            },
        });

        expect(employee.userId).toBe(user.id);
    });
});
