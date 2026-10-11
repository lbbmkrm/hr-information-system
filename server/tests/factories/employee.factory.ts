import prisma from "../prisma.js";
import type { Prisma } from "@prisma/client";

export async function createEmployee(overrides: Partial<Prisma.EmployeeCreateInput> = {}) {
    return prisma.employee.create({
        data: {
            name: "John Doe",
            position: "Software Engineer",
            department: "IT",
            joinDate: new Date("2025-01-01"),
            phone: "081234567890",
            ...overrides,
        },
    });
}
